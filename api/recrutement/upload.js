/**
 * Téléversement des pièces d’une candidature : CV, diplôme, photo.
 *
 * Le contrôle ne se contente pas de l’extension ni du type annoncé par le
 * navigateur — tous deux sont déclaratifs et falsifiables. Le contenu réel est
 * identifié par ses octets d’en-tête, et un fichier dont le contenu contredit
 * l’annonce est refusé. C’est la même exigence que pour la photo de carte
 * membre, étendue au PDF.
 */

import crypto from 'node:crypto';
import Busboy from 'busboy';
import { FILE_RULES } from '../_lib/recruitment.js';

const BODY_READ_TIMEOUT_MS = 25_000;
const PARSE_UPLOAD_TIMEOUT_MS = 30_000;
const MAX_ANY_FILE = Math.max(...Object.values(FILE_RULES).map((rule) => rule.maxBytes));
const MAX_REQUEST_SIZE = MAX_ANY_FILE + 64 * 1024;

const serverEnvironment = () => ({
  appId:
    process.env.BACK4APP_APP_ID ||
    process.env.PARSE_APP_ID ||
    process.env.VITE_PARSE_APP_ID,
  // Jamais sous un nom préfixé VITE_ : Vite embarquerait le secret dans le
  // bundle du navigateur.
  masterKey: process.env.BACK4APP_MASTER_KEY || process.env.PARSE_MASTER_KEY,
  serverUrl:
    process.env.BACK4APP_SERVER_URL ||
    process.env.PARSE_SERVER_URL ||
    process.env.VITE_PARSE_SERVER_URL,
});

const ENVIRONMENT_VARIABLE_NAMES = {
  appId: 'PARSE_APP_ID',
  masterKey: 'PARSE_MASTER_KEY',
  serverUrl: 'PARSE_SERVER_URL',
};

const httpError = (status, code, message) => ({ status, code, message });

const extensionOf = (fileName = '') => {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
};

/** Type réel déduit des octets d’en-tête, indépendamment du nom du fichier. */
const detectType = (buffer) => {
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-') {
    return { mimeType: 'application/pdf', extension: 'pdf' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
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

const readRawBody = (request) =>
  new Promise((resolve, reject) => {
    const buffered = request.body;
    if (Buffer.isBuffer(buffered)) return resolve(buffered);
    if (typeof buffered === 'string') return resolve(Buffer.from(buffered, 'binary'));
    if (ArrayBuffer.isView(buffered)) {
      return resolve(Buffer.from(buffered.buffer, buffered.byteOffset, buffered.byteLength));
    }
    if (request.readableEnded || request.destroyed) {
      return reject(
        httpError(400, 'body_unavailable', 'Le fichier n’a pas pu être lu. Réessayez.'),
      );
    }

    const chunks = [];
    let size = 0;
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      request.destroy();
      reject(httpError(408, 'body_timeout', 'La lecture du fichier a expiré.'));
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
        settle(reject, httpError(413, 'too_large', 'Le fichier envoyé est trop volumineux.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => settle(resolve, Buffer.concat(chunks)));
    request.on('aborted', () =>
      settle(reject, httpError(400, 'aborted', 'Le téléversement a été interrompu.')),
    );
    request.on('error', () =>
      settle(reject, httpError(400, 'stream_error', 'Le fichier n’a pas pu être lu.')),
    );
  });

const parseUpload = (headers, rawBody, rule) =>
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
        limits: { files: 1, fileSize: rule.maxBytes, fields: 4, parts: 5 },
      });
    } catch {
      reject(httpError(400, 'busboy_init', 'Le formulaire envoyé est illisible.'));
      return;
    }

    let file = null;
    let tooLarge = false;
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    parser.on('file', (fieldName, stream, info) => {
      if (fieldName !== 'file') {
        stream.resume();
        return;
      }
      const chunks = [];
      stream.on('limit', () => {
        tooLarge = true;
      });
      stream.on('data', (chunk) => {
        if (!tooLarge) chunks.push(chunk);
      });
      stream.on('error', () =>
        fail(httpError(400, 'file_stream_error', 'Le fichier n’a pas pu être lu.')),
      );
      stream.on('end', () => {
        if (tooLarge || settled) return;
        file = {
          buffer: Buffer.concat(chunks),
          declaredMimeType: (info.mimeType || '').toLowerCase(),
          extension: extensionOf(info.filename),
          originalName: String(info.filename ?? ''),
        };
      });
    });

    parser.on('filesLimit', () =>
      fail(httpError(400, 'too_many_files', 'Un seul fichier peut être envoyé à la fois.')),
    );
    parser.on('partsLimit', () =>
      fail(httpError(400, 'parts_limit', 'Le formulaire contient trop de données.')),
    );
    parser.on('error', () =>
      fail(httpError(400, 'busboy_error', 'Le formulaire envoyé est illisible.')),
    );

    parser.on('finish', () => {
      if (settled) return;
      if (tooLarge) {
        fail(
          httpError(
            413,
            'too_large',
            `Le fichier « ${rule.label} » ne doit pas dépasser ${rule.maxLabel}.`,
          ),
        );
        return;
      }
      if (!file || file.buffer.length === 0) {
        fail(httpError(400, 'no_file', 'Aucun fichier n’a été reçu.'));
        return;
      }
      if (!rule.extensions.includes(file.extension)) {
        fail(
          httpError(
            415,
            'bad_extension',
            `Format interdit pour « ${rule.label} ». Utilisez un fichier ${rule.formatLabel}.`,
          ),
        );
        return;
      }
      if (file.declaredMimeType && !rule.mimeTypes.includes(file.declaredMimeType)) {
        fail(
          httpError(
            415,
            'bad_mime',
            `Format interdit pour « ${rule.label} ». Utilisez un fichier ${rule.formatLabel}.`,
          ),
        );
        return;
      }

      const detected = detectType(file.buffer);
      if (!detected || !rule.mimeTypes.includes(detected.mimeType)) {
        fail(
          httpError(
            415,
            'unrecognized_content',
            `Le contenu du fichier ne correspond pas à un document ${rule.formatLabel}.`,
          ),
        );
        return;
      }
      if (file.declaredMimeType && file.declaredMimeType !== detected.mimeType) {
        fail(
          httpError(
            415,
            'mime_mismatch',
            'Le type réel du fichier ne correspond pas au format annoncé.',
          ),
        );
        return;
      }

      settled = true;
      resolve({ ...file, mimeType: detected.mimeType, realExtension: detected.extension });
    });

    parser.end(rawBody);
  });

const sendToParse = async (environment, fileName, file) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PARSE_UPLOAD_TIMEOUT_MS);
  try {
    const parseResponse = await fetch(
      `${environment.serverUrl.replace(/\/+$/, '')}/files/${encodeURIComponent(fileName)}`,
      {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': environment.appId,
          'X-Parse-Master-Key': environment.masterKey,
          'Content-Type': file.mimeType,
        },
        body: file.buffer,
        signal: controller.signal,
      },
    );
    if (!parseResponse.ok) {
      console.error('[recruitment-upload] parse_file_rejected', {
        status: parseResponse.status,
      });
      throw httpError(
        502,
        'storage_rejected',
        'Le service de fichiers a refusé le téléversement. Veuillez réessayer.',
      );
    }
    const uploaded = await parseResponse.json();
    if (typeof uploaded?.name !== 'string' || typeof uploaded?.url !== 'string') {
      throw httpError(502, 'storage_bad_response', 'Confirmation de téléversement invalide.');
    }
    return { __type: 'File', name: uploaded.name, url: uploaded.url };
  } catch (error) {
    if (typeof error?.status === 'number') throw error;
    if (error?.name === 'AbortError') {
      throw httpError(504, 'storage_timeout', 'Le téléversement a expiré.');
    }
    console.error('[recruitment-upload] storage_unreachable', { name: error?.name });
    throw httpError(502, 'storage_unreachable', 'Service de fichiers injoignable.');
  } finally {
    clearTimeout(timeout);
  }
};

const sendErrorResponse = (response, status, message, code) => {
  response.status(status).json({ success: false, error: message, code });
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendErrorResponse(response, 405, 'Méthode non autorisée.', 'method_not_allowed');
    return;
  }

  const kind = String(request.query?.kind ?? request.headers['x-upload-kind'] ?? '');
  const rule = FILE_RULES[kind];
  if (!rule) {
    sendErrorResponse(response, 400, 'Type de pièce inconnu.', 'unknown_kind');
    return;
  }

  const environment = serverEnvironment();
  const missing = Object.keys(ENVIRONMENT_VARIABLE_NAMES)
    .filter((key) => !environment[key])
    .map((key) => ENVIRONMENT_VARIABLE_NAMES[key]);
  if (missing.length > 0) {
    console.error('[recruitment-upload] missing_configuration', { missing });
    sendErrorResponse(
      response,
      503,
      `Configuration du stockage manquante : ${missing.join(', ')}.`,
      'missing_configuration',
    );
    return;
  }

  let file;
  try {
    const rawBody = await readRawBody(request);
    file = await parseUpload(request.headers, rawBody, rule);
  } catch (error) {
    sendErrorResponse(
      response,
      typeof error?.status === 'number' ? error.status : 400,
      typeof error?.message === 'string' ? error.message : 'Le fichier n’a pas pu être traité.',
      error?.code || 'file_invalid',
    );
    return;
  }

  // Le nom porte l’empreinte du contenu : réenvoyer le même fichier ne crée pas
  // de doublon, et remplacer une pièce produit bien un fichier distinct.
  const contentHash = crypto
    .createHash('sha256')
    .update(file.buffer)
    .digest('hex')
    .slice(0, 16);
  const fileName = `recrutement-${kind}-${contentHash}.${file.realExtension}`;

  try {
    const stored = await sendToParse(environment, fileName, file);
    response.status(201).json({
      success: true,
      kind,
      file: stored,
      originalName: file.originalName.slice(0, 120),
      size: file.buffer.length,
    });
  } catch (error) {
    sendErrorResponse(
      response,
      typeof error?.status === 'number' ? error.status : 502,
      typeof error?.message === 'string' ? error.message : 'Le fichier n’a pas pu être envoyé.',
      error?.code || 'upload_failed',
    );
  }
}
