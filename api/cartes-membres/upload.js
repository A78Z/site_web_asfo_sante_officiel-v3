import crypto from 'node:crypto';
import Busboy from 'busboy';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
// Marge pour les entêtes multipart (frontière, Content-Disposition, etc.).
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;
const MIN_PHOTO_DIMENSION = 300;
const BODY_READ_TIMEOUT_MS = 25_000;
const PARSE_UPLOAD_TIMEOUT_MS = 30_000;
const UPLOAD_CACHE_MS = 10 * 60 * 1000;
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_DECLARED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSIONS_BY_MIME_TYPE = {
  'image/jpeg': new Set(['.jpg', '.jpeg']),
  'image/png': new Set(['.png']),
  'image/webp': new Set(['.webp']),
};
const uploadCache =
  globalThis.__asfoMemberUploadCache ||
  (globalThis.__asfoMemberUploadCache = new Map());

// NOTE : `export const config = { api: { bodyParser: false } }` est une convention
// Next.js ; le runtime @vercel/node l’ignore. Le corps multipart est donc lu
// explicitement par `readRawBody` ci-dessous, qui gère les deux cas possibles
// (corps déjà bufferisé par le runtime, ou flux encore ouvert).

const serverEnvironment = () => ({
  appId:
    process.env.BACK4APP_APP_ID ||
    process.env.PARSE_APP_ID ||
    process.env.VITE_PARSE_APP_ID,
  // La clé master est lue uniquement depuis l’environnement serveur, et jamais
  // sous un nom préfixé VITE_ : Vite peut embarquer ces variables dans le bundle
  // client, ce qui exposerait publiquement le secret.
  masterKey: process.env.BACK4APP_MASTER_KEY || process.env.PARSE_MASTER_KEY,
  serverUrl:
    process.env.BACK4APP_SERVER_URL ||
    process.env.PARSE_SERVER_URL ||
    process.env.VITE_PARSE_SERVER_URL,
});

// Nom de variable d’environnement à citer dans le diagnostic quand la valeur
// manque. Seul le NOM est exposé : jamais la valeur, jamais la clé master.
const ENVIRONMENT_VARIABLE_NAMES = {
  appId: 'PARSE_APP_ID',
  masterKey: 'PARSE_MASTER_KEY',
  serverUrl: 'PARSE_SERVER_URL',
};

const missingEnvironmentKeys = (environment) =>
  Object.keys(ENVIRONMENT_VARIABLE_NAMES).filter((key) => !environment[key]);

const extensionOf = (fileName = '') => {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
};

const detectImageType = (buffer) => {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { mimeType: 'image/webp', extension: 'webp' };
  }

  return null;
};

// Lecture des dimensions depuis les entêtes du fichier, sans dépendance externe.
const jpegDimensions = (buffer) => {
  let offset = 2;
  while (offset + 9 <= buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    // Marqueurs sans charge utile.
    if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    // Fin d’image ou début des données compressées : plus de SOF au-delà.
    if (marker === 0xd9 || marker === 0xda) return null;

    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;

    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + segmentLength;
  }
  return null;
};

const pngDimensions = (buffer) => {
  if (buffer.length < 24) return null;
  if (buffer.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const webpDimensions = (buffer) => {
  if (buffer.length < 26) return null;
  const format = buffer.subarray(12, 16).toString('ascii');

  if (format === 'VP8 ') {
    if (buffer.length < 30) return null;
    if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) return null;
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (format === 'VP8L') {
    if (buffer.length < 25 || buffer[20] !== 0x2f) return null;
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >>> 14) & 0x3fff) + 1,
    };
  }

  if (format === 'VP8X') {
    if (buffer.length < 30) return null;
    return {
      width: 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)),
      height: 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)),
    };
  }

  return null;
};

const imageDimensions = (buffer, mimeType) => {
  try {
    if (mimeType === 'image/jpeg') return jpegDimensions(buffer);
    if (mimeType === 'image/png') return pngDimensions(buffer);
    if (mimeType === 'image/webp') return webpDimensions(buffer);
  } catch {
    return null;
  }
  return null;
};

const httpError = (status, code, message) => ({ status, code, message });

/**
 * Récupère le corps brut de la requête.
 * Sur @vercel/node, `request.body` peut déjà contenir le corps bufferisé ;
 * sinon le flux est encore ouvert et doit être consommé manuellement.
 */
const readRawBody = (request) =>
  new Promise((resolve, reject) => {
    const buffered = request.body;
    if (Buffer.isBuffer(buffered)) {
      resolve(buffered);
      return;
    }
    if (typeof buffered === 'string') {
      resolve(Buffer.from(buffered, 'binary'));
      return;
    }
    if (ArrayBuffer.isView(buffered)) {
      resolve(Buffer.from(buffered.buffer, buffered.byteOffset, buffered.byteLength));
      return;
    }
    if (request.readableEnded || request.destroyed) {
      reject(
        httpError(
          400,
          'body_unavailable',
          'La photo n’a pas pu être lue par le serveur. Veuillez la sélectionner à nouveau.',
        ),
      );
      return;
    }

    const chunks = [];
    let size = 0;
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      request.destroy();
      reject(
        httpError(
          408,
          'body_timeout',
          'La lecture de la photo a expiré. Vérifiez votre connexion puis réessayez.',
        ),
      );
    }, BODY_READ_TIMEOUT_MS);

    const settle = (action, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      action(value);
    };

    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_REQUEST_SIZE) {
        settle(reject, httpError(413, 'too_large', 'La photo ne doit pas dépasser 2 Mo.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => settle(resolve, Buffer.concat(chunks)));
    request.on('aborted', () =>
      settle(
        reject,
        httpError(
          400,
          'aborted',
          'Le téléversement a été interrompu. Vérifiez votre connexion puis réessayez.',
        ),
      ),
    );
    request.on('error', () =>
      settle(
        reject,
        httpError(
          400,
          'stream_error',
          'La photo n’a pas pu être lue. Veuillez la sélectionner à nouveau.',
        ),
      ),
    );
  });

const parsePhoto = (headers, rawBody) =>
  new Promise((resolve, reject) => {
    const contentType = headers['content-type'] || '';
    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      reject(httpError(415, 'bad_content_type', 'Le formulaire envoyé est invalide.'));
      return;
    }

    let parser;
    try {
      parser = Busboy({
        headers,
        limits: {
          files: 1,
          fileSize: MAX_FILE_SIZE,
          fields: 4,
          parts: 5,
        },
      });
    } catch {
      reject(httpError(400, 'busboy_init', 'Le formulaire envoyé est illisible.'));
      return;
    }

    let photo = null;
    let fileFound = false;
    let tooLarge = false;
    let tooManyFiles = false;
    let settled = false;

    const finishWithError = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    parser.on('file', (fieldName, fileStream, info) => {
      if (fieldName !== 'photo') {
        fileStream.resume();
        return;
      }

      fileFound = true;
      const chunks = [];
      const declaredMimeType = (info.mimeType || '').toLowerCase();
      const originalExtension = extensionOf(info.filename);

      fileStream.on('limit', () => {
        tooLarge = true;
      });
      fileStream.on('data', (chunk) => {
        if (!tooLarge) chunks.push(chunk);
      });
      fileStream.on('error', () => {
        finishWithError(
          httpError(
            400,
            'file_stream_error',
            'La photo n’a pas pu être lue. Veuillez la sélectionner à nouveau.',
          ),
        );
      });
      fileStream.on('end', () => {
        if (tooLarge || settled) return;
        photo = {
          buffer: Buffer.concat(chunks),
          declaredMimeType,
          originalExtension,
        };
      });
    });

    parser.on('filesLimit', () => {
      tooManyFiles = true;
    });
    parser.on('partsLimit', () => {
      finishWithError(
        httpError(400, 'parts_limit', 'Le formulaire contient trop de données.'),
      );
    });
    parser.on('error', () => {
      finishWithError(httpError(400, 'busboy_error', 'Le formulaire envoyé est illisible.'));
    });

    parser.on('finish', () => {
      if (settled) return;
      if (tooLarge) {
        finishWithError(httpError(413, 'too_large', 'La photo ne doit pas dépasser 2 Mo.'));
        return;
      }
      if (tooManyFiles) {
        finishWithError(
          httpError(400, 'too_many_files', 'Une seule photo peut être envoyée.'),
        );
        return;
      }
      if (!fileFound || !photo || photo.buffer.length === 0) {
        finishWithError(httpError(400, 'no_file', 'Aucune photo n’a été reçue.'));
        return;
      }
      if (!ALLOWED_EXTENSIONS.has(photo.originalExtension)) {
        finishWithError(
          httpError(
            415,
            'bad_extension',
            'Format interdit. Utilisez une photo JPG, JPEG, PNG ou WEBP.',
          ),
        );
        return;
      }
      if (
        photo.declaredMimeType &&
        !ALLOWED_DECLARED_MIME_TYPES.has(photo.declaredMimeType)
      ) {
        finishWithError(
          httpError(
            415,
            'bad_mime',
            'Format interdit. Utilisez une photo JPG, JPEG, PNG ou WEBP.',
          ),
        );
        return;
      }

      const detectedType = detectImageType(photo.buffer);
      if (!detectedType) {
        finishWithError(
          httpError(
            415,
            'unrecognized_content',
            'Le contenu du fichier ne correspond pas à une image JPG, PNG ou WEBP valide.',
          ),
        );
        return;
      }
      if (photo.declaredMimeType && photo.declaredMimeType !== detectedType.mimeType) {
        finishWithError(
          httpError(
            415,
            'mime_mismatch',
            'Le type réel de la photo ne correspond pas au format annoncé.',
          ),
        );
        return;
      }
      if (!EXTENSIONS_BY_MIME_TYPE[detectedType.mimeType].has(photo.originalExtension)) {
        finishWithError(
          httpError(
            415,
            'extension_mismatch',
            'L’extension de la photo ne correspond pas à son type réel.',
          ),
        );
        return;
      }

      // Validation serveur des dimensions, alignée sur le contrôle client.
      const dimensions = imageDimensions(photo.buffer, detectedType.mimeType);
      if (!dimensions || !dimensions.width || !dimensions.height) {
        finishWithError(
          httpError(
            415,
            'unreadable_dimensions',
            'Les dimensions de la photo n’ont pas pu être lues. Utilisez une autre photo.',
          ),
        );
        return;
      }
      if (
        dimensions.width < MIN_PHOTO_DIMENSION ||
        dimensions.height < MIN_PHOTO_DIMENSION
      ) {
        finishWithError(
          httpError(
            422,
            'too_small',
            `La photo doit mesurer au moins ${MIN_PHOTO_DIMENSION} × ${MIN_PHOTO_DIMENSION} pixels.`,
          ),
        );
        return;
      }

      settled = true;
      resolve({
        buffer: photo.buffer,
        mimeType: detectedType.mimeType,
        extension: detectedType.extension,
        width: dimensions.width,
        height: dimensions.height,
      });
    });

    parser.end(rawBody);
  });

const sendError = (response, status, message, code) => {
  response.status(status).json({ success: false, error: message, code });
};

const isValidSubmissionId = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const parseBaseUrl = (environment) => environment.serverUrl.replace(/\/+$/, '');

const findExistingPhoto = async (environment, submissionId) => {
  const query = new URLSearchParams({
    where: JSON.stringify({ submissionId }),
    limit: '1',
    keys: 'photo',
  });
  const result = await fetch(
    `${parseBaseUrl(environment)}/classes/MemberRequests?${query.toString()}`,
    {
      headers: {
        'X-Parse-Application-Id': environment.appId,
        'X-Parse-Master-Key': environment.masterKey,
      },
    },
  );
  if (!result.ok) return null;
  const payload = await result.json();
  return payload.results?.[0]?.photo ?? null;
};

const sendPhotoToParse = async (environment, fileName, photo) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PARSE_UPLOAD_TIMEOUT_MS);

  try {
    const parseResponse = await fetch(
      `${parseBaseUrl(environment)}/files/${encodeURIComponent(fileName)}`,
      {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': environment.appId,
          'X-Parse-Master-Key': environment.masterKey,
          'Content-Type': photo.mimeType,
        },
        body: photo.buffer,
        signal: controller.signal,
      },
    );

    if (!parseResponse.ok) {
      // Aucun secret n’est journalisé : uniquement le statut renvoyé par Back4App.
      console.error('[member-photo-upload] parse_file_rejected', {
        status: parseResponse.status,
      });
      if (parseResponse.status === 401 || parseResponse.status === 403) {
        throw httpError(
          502,
          'storage_forbidden',
          'Le service de fichiers a refusé l’accès. L’équipe technique a été alertée.',
        );
      }
      throw httpError(
        502,
        'storage_rejected',
        'Le service de fichiers a refusé le téléversement. Veuillez réessayer.',
      );
    }

    const uploadedFile = await parseResponse.json();
    if (
      typeof uploadedFile?.name !== 'string' ||
      typeof uploadedFile?.url !== 'string'
    ) {
      throw httpError(
        502,
        'storage_bad_response',
        'La confirmation du téléversement est invalide. Veuillez réessayer.',
      );
    }

    return {
      __type: 'File',
      name: uploadedFile.name,
      url: uploadedFile.url,
    };
  } catch (error) {
    if (typeof error?.status === 'number') throw error;
    if (error?.name === 'AbortError') {
      throw httpError(
        504,
        'storage_timeout',
        'Le téléversement a expiré. Vérifiez votre connexion puis réessayez.',
      );
    }
    console.error('[member-photo-upload] storage_unreachable', { name: error?.name });
    throw httpError(
      502,
      'storage_unreachable',
      'Connexion impossible avec le service de fichiers. Veuillez réessayer.',
    );
  } finally {
    clearTimeout(timeout);
  }
};

const uploadPhoto = async (environment, submissionId, photo, contentHash) => {
  let existingPhoto;
  try {
    existingPhoto = await findExistingPhoto(environment, submissionId);
  } catch (error) {
    console.error('[member-photo-upload] lookup_failed', { name: error?.name });
    throw httpError(
      502,
      'storage_unreachable',
      'Le service de fichiers est temporairement injoignable. Veuillez réessayer.',
    );
  }
  // La demande existe déjà : on renvoie sa photo (idempotence après soumission).
  if (existingPhoto?.__type === 'File') {
    return { photo: existingPhoto, reused: true };
  }

  const submissionHash = crypto
    .createHash('sha256')
    .update(submissionId)
    .digest('hex')
    .slice(0, 16);
  // Le nom inclut l’empreinte du contenu : rejouer le même envoi est idempotent,
  // et remplacer la photo produit bien un nouveau fichier.
  const fileName = `member-photo-${submissionHash}-${contentHash}.${photo.extension}`;

  return { photo: await sendPhotoToParse(environment, fileName, photo), reused: false };
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendError(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const environment = serverEnvironment();
  const missingKeys = missingEnvironmentKeys(environment);
  if (missingKeys.length > 0) {
    // On journalise et on renvoie les NOMS manquants, jamais les valeurs :
    // le diagnostic est immédiat sans jamais exposer un secret.
    const missingNames = missingKeys.map((key) => ENVIRONMENT_VARIABLE_NAMES[key]);
    console.error('[member-photo-upload] missing_configuration', { missingNames });
    sendError(
      response,
      503,
      `Configuration du stockage manquante : ${missingNames.join(', ')}. L’équipe technique a été alertée.`,
      'missing_configuration',
    );
    return;
  }

  const submissionId = request.headers['x-idempotency-key'];
  if (!isValidSubmissionId(submissionId)) {
    sendError(
      response,
      400,
      'L’identifiant de téléversement est invalide. Rechargez le formulaire puis réessayez.',
      'bad_submission_id',
    );
    return;
  }

  let photo;
  try {
    const rawBody = await readRawBody(request);
    photo = await parsePhoto(request.headers, rawBody);
  } catch (error) {
    const status = typeof error?.status === 'number' ? error.status : 400;
    sendError(
      response,
      status,
      typeof error?.message === 'string'
        ? error.message
        : 'La photo n’a pas pu être traitée.',
      error?.code || 'photo_invalid',
    );
    return;
  }

  const contentHash = crypto
    .createHash('sha256')
    .update(photo.buffer)
    .digest('hex')
    .slice(0, 16);
  const cacheKey = `${submissionId}:${contentHash}`;

  const now = Date.now();
  for (const [key, entry] of uploadCache) {
    if (entry.expiresAt <= now) uploadCache.delete(key);
  }

  const cached = uploadCache.get(cacheKey);
  if (cached) {
    try {
      const result = await cached.promise;
      response.status(200).json({ success: true, photo: result.photo });
    } catch (error) {
      uploadCache.delete(cacheKey);
      sendError(
        response,
        typeof error?.status === 'number' ? error.status : 502,
        typeof error?.message === 'string'
          ? error.message
          : 'La photo n’a pas pu être téléversée.',
        error?.code || 'upload_failed',
      );
    }
    return;
  }

  const promise = uploadPhoto(environment, submissionId, photo, contentHash);
  uploadCache.set(cacheKey, { promise, expiresAt: now + UPLOAD_CACHE_MS });

  try {
    const result = await promise;
    response.status(result.reused ? 200 : 201).json({
      success: true,
      photo: result.photo,
    });
  } catch (error) {
    uploadCache.delete(cacheKey);
    const status =
      typeof error?.status === 'number' && error.status >= 400 ? error.status : 502;
    sendError(
      response,
      status,
      typeof error?.message === 'string'
        ? error.message
        : 'La photo n’a pas pu être téléversée.',
      error?.code || 'upload_failed',
    );
  }
}
