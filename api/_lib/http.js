/** Utilitaires HTTP communs aux fonctions serverless. */

const MAX_BODY_SIZE = 256 * 1024;

/** Lit le corps encore en flux quand le runtime ne l’a pas bufferisé. */
const readRawBody = (request) =>
  new Promise((resolve) => {
    if (request.readableEnded || request.destroyed) {
      resolve(null);
      return;
    }
    const chunks = [];
    let size = 0;
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        request.destroy();
        settle(null);
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => settle(Buffer.concat(chunks).toString('utf8')));
    request.on('error', () => settle(null));
    request.on('aborted', () => settle(null));
  });

/**
 * Récupère le payload JSON quel que soit le runtime : corps déjà analysé,
 * bufferisé, ou flux encore ouvert. Renvoie `null` si le corps est illisible.
 */
export const readJsonBody = async (request) => {
  const { body } = request;
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'));
    } catch {
      return null;
    }
  }
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  const raw = await readRawBody(request);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const sendError = (response, status, message, code) => {
  response.status(status).json({ success: false, error: message, code });
};
