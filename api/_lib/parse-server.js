/**
 * Accès Parse côté serveur, avec la clé master.
 *
 * La clé master n’est lue que depuis l’environnement et n’est jamais préfixée
 * VITE_ : un tel nom serait embarqué par Vite dans le bundle du navigateur.
 */

const REQUEST_TIMEOUT_MS = 15_000;

export const serverEnvironment = () => ({
  appId:
    process.env.BACK4APP_APP_ID ||
    process.env.PARSE_APP_ID ||
    process.env.VITE_PARSE_APP_ID,
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

/** Noms des variables manquantes — jamais leurs valeurs. */
export const missingEnvironmentNames = (environment) =>
  Object.keys(ENVIRONMENT_VARIABLE_NAMES)
    .filter((key) => !environment[key])
    .map((key) => ENVIRONMENT_VARIABLE_NAMES[key]);

const baseUrl = (environment) => environment.serverUrl.replace(/\/+$/, '');

const masterHeaders = (environment) => ({
  'X-Parse-Application-Id': environment.appId,
  'X-Parse-Master-Key': environment.masterKey,
  'Content-Type': 'application/json',
});

const request = async (environment, path, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl(environment)}${path}`, {
      ...options,
      headers: masterHeaders(environment),
      signal: controller.signal,
    });
    if (!response.ok && response.status !== 404) {
      throw new Error(`parse_http_${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
};

/** Recherche des objets. `params` accepte where/limit/order/keys. */
export const findObjects = async (environment, className, params = {}) => {
  const query = new URLSearchParams();
  if (params.where) query.set('where', JSON.stringify(params.where));
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.order) query.set('order', params.order);
  if (params.keys) query.set('keys', params.keys);
  if (params.count) query.set('count', '1');

  const response = await request(
    environment,
    `/classes/${className}?${query.toString()}`,
  );
  if (response.status === 404) return { results: [], count: 0 };
  return response.json();
};

export const createObject = async (environment, className, fields) => {
  const response = await request(environment, `/classes/${className}`, {
    method: 'POST',
    body: JSON.stringify(fields),
  });
  return response.json();
};

export const updateObject = async (environment, className, objectId, fields) => {
  const response = await request(
    environment,
    `/classes/${className}/${objectId}`,
    { method: 'PUT', body: JSON.stringify(fields) },
  );
  return response.json();
};

/** Date Parse à partir d’un objet Date natif. */
export const parseDate = (date) => ({ __type: 'Date', iso: date.toISOString() });
