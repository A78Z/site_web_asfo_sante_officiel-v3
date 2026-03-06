const APP_ID = import.meta.env.VITE_PARSE_APP_ID as string;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY as string;
const MASTER_KEY = import.meta.env.VITE_PARSE_MASTER_KEY as string;
const SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL as string;

const headers = (): HeadersInit => ({
  'X-Parse-Application-Id': APP_ID,
  'X-Parse-REST-API-Key': REST_KEY,
  'Content-Type': 'application/json',
});

function url(path: string) {
  return `${SERVER_URL}${path}`;
}

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

export async function uploadFile(
  fileName: string,
  file: File,
): Promise<ParseFile> {
  const res = await fetch(url(`/files/${encodeURIComponent(fileName)}`), {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-Master-Key': MASTER_KEY,
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'File upload failed');
  }
  const data = await res.json();
  return { __type: 'File', name: data.name, url: data.url };
}

export async function createObject<T extends Record<string, unknown>>(
  className: string,
  body: T,
): Promise<ParseObject> {
  const res = await fetch(url(`/classes/${className}`), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
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

  const res = await fetch(url(`/classes/${className}?${qs.toString()}`), {
    headers: headers(),
  });
  if (!res.ok) throw new Error('Query failed');
  return res.json();
}

export async function updateObject(
  className: string,
  objectId: string,
  body: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(url(`/classes/${className}/${objectId}`), {
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
  const res = await fetch(url(`/classes/${className}/${objectId}`), {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Delete failed');
}
