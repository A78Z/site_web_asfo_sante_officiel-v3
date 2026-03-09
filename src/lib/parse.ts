/* ═══════════════════════════════════════════════════════════
   Parse REST API client — pure fetch, zero dependencies
   ═══════════════════════════════════════════════════════════ */

const APP_ID = import.meta.env.VITE_PARSE_APP_ID as string;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY as string;
const MASTER_KEY = import.meta.env.VITE_PARSE_MASTER_KEY as string;
const SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL as string;

/* Warn once at startup if critical keys are missing */
if (!APP_ID || !SERVER_URL) console.error('[Parse] VITE_PARSE_APP_ID or VITE_PARSE_SERVER_URL is missing!');
if (!MASTER_KEY) console.warn('[Parse] VITE_PARSE_MASTER_KEY is missing — file uploads will fail on Back4App.');

const headers = (): HeadersInit => ({
  'X-Parse-Application-Id': APP_ID,
  'X-Parse-REST-API-Key': REST_KEY,
  'Content-Type': 'application/json',
});

function apiUrl(path: string) {
  return `${SERVER_URL}${path}`;
}

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface ParseFile {
  __type: 'File';
  name: string;
  url: string;
}

export interface ParseObject {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

/* ═══════════════════════════════════════════════════════════
   File Upload — pure fetch, base64 JSON approach
   ═══════════════════════════════════════════════════════════ */

/** Max file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

function safeFileName(raw: string): string {
  const dot = raw.lastIndexOf('.');
  const ext = dot > 0 ? raw.slice(dot) : '';
  const base = (dot > 0 ? raw.slice(0, dot) : raw)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 60);
  return `${base || 'file'}${ext.toLowerCase()}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error('Impossible de lire le fichier.'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(
  fileName: string,
  file: File,
): Promise<ParseFile> {
  /* ── Validation ── */
  if (!file || file.size === 0) {
    throw new Error('Aucun fichier sélectionné.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Max : 10 Mo.`,
    );
  }
  const mimeType = file.type || 'application/octet-stream';
  if (
    !ALLOWED_FILE_TYPES.includes(mimeType) &&
    mimeType !== 'application/octet-stream'
  ) {
    throw new Error(
      `Type non supporté (${mimeType}). Utilisez JPG, PNG, WEBP, GIF ou PDF.`,
    );
  }

  if (!MASTER_KEY) {
    throw new Error(
      'Configuration serveur incomplète (clé Master manquante). Contactez l\'administrateur.',
    );
  }

  const safeName = safeFileName(fileName);

  /* ── Strategy 1: Blob via REST API (most compatible) ── */
  try {
    const base64Data = await fileToBase64(file);
    const res = await fetch(apiUrl(`/files/${encodeURIComponent(safeName)}`), {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': REST_KEY,
        'X-Parse-Master-Key': MASTER_KEY,
        'Content-Type': mimeType,
      },
      body: base64toBlob(base64Data, mimeType),
    });

    if (res.ok) {
      const data = await res.json();
      return { __type: 'File', name: data.name, url: data.url };
    }

    // If master key failed, try JS key
    const errText = await res.text().catch(() => '');
    console.warn(`Upload attempt 1 failed (HTTP ${res.status}):`, errText);
  } catch (err) {
    console.warn('Upload strategy 1 failed:', err);
  }

  /* ── Strategy 2: ArrayBuffer + Master Key ── */
  try {
    const buffer = await file.arrayBuffer();
    const res = await fetch(apiUrl(`/files/${encodeURIComponent(safeName)}`), {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-Master-Key': MASTER_KEY,
        'Content-Type': mimeType,
      },
      body: buffer,
    });

    if (res.ok) {
      const data = await res.json();
      return { __type: 'File', name: data.name, url: data.url };
    }

    const errBody = await res.text().catch(() => '');
    let detail = '';
    try {
      detail = JSON.parse(errBody).error || errBody;
    } catch {
      detail = errBody;
    }
    throw new Error(`HTTP ${res.status}: ${detail || 'Erreur serveur'}`);
  } catch (err) {
    console.error('Upload strategy 2 failed:', err);
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    throw new Error(`Upload impossible. ${msg}`);
  }
}

/** Convert base64 string to Blob for proper binary upload */
function base64toBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const byteArrays: Uint8Array[] = [];
  for (let offset = 0; offset < byteChars.length; offset += 512) {
    const slice = byteChars.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays as BlobPart[], { type: mimeType });
}

/* ═══════════════════════════════════════════════════════════
   CRUD — REST API
   ═══════════════════════════════════════════════════════════ */

export async function createObject<T extends Record<string, unknown>>(
  className: string,
  body: T,
): Promise<ParseObject> {
  const res = await fetch(apiUrl(`/classes/${className}`), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Create failed');
  }
  return res.json();
}

export async function queryObjects<T = ParseObject>(
  className: string,
  params?: {
    where?: Record<string, unknown>;
    order?: string;
    limit?: number;
    skip?: number;
    count?: boolean;
    keys?: string;
    exclude?: string;
  },
): Promise<{ results: T[]; count?: number }> {
  const qs = new URLSearchParams();
  if (params?.where) qs.set('where', JSON.stringify(params.where));
  if (params?.order) qs.set('order', params.order);
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.skip) qs.set('skip', String(params.skip));
  if (params?.count) qs.set('count', '1');
  if (params?.keys) qs.set('keys', params.keys);
  if (params?.exclude) qs.set('excludeKeys', params.exclude);

  const res = await fetch(apiUrl(`/classes/${className}?${qs.toString()}`), {
    headers: headers(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Query ${className} failed (HTTP ${res.status})`);
  }
  return res.json();
}

export async function updateObject(
  className: string,
  objectId: string,
  body: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(apiUrl(`/classes/${className}/${objectId}`), {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Update failed');
}

export async function deleteObject(
  className: string,
  objectId: string,
): Promise<void> {
  const res = await fetch(apiUrl(`/classes/${className}/${objectId}`), {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Delete failed');
}
