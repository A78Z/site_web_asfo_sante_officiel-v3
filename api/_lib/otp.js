/**
 * Vérification du numéro de téléphone par code à usage unique (OTP).
 *
 * Le code n’est jamais stocké en clair : seule son empreinte SHA-256, salée par
 * un aléa propre à chaque envoi, est conservée. Les fonctions Vercel étant sans
 * état, la classe Parse `PhoneVerifications` sert de stockage partagé — elle est
 * distincte de `MemberRequests` et ne contient aucune donnée de demandeur.
 */

import crypto from 'node:crypto';
import {
  createObject,
  findObjects,
  parseDate,
  updateObject,
} from './parse-server.js';

export const VERIFICATION_CLASS = 'PhoneVerifications';

/** Durée de validité d’un code. */
export const CODE_TTL_MS = 10 * 60 * 1000;
/** Délai imposé entre deux envois vers le même numéro. */
export const RESEND_DELAY_MS = 60 * 1000;
/** Envois maximum vers un même numéro par fenêtre glissante. */
export const MAX_SENDS_PER_WINDOW = 5;
export const SEND_WINDOW_MS = 60 * 60 * 1000;
/** Envois maximum depuis une même adresse IP par fenêtre glissante. */
export const MAX_SENDS_PER_IP = 15;
/** Essais de saisie autorisés pour un code donné. */
export const MAX_ATTEMPTS = 5;
/**
 * Durée pendant laquelle une vérification réussie autorise l’enregistrement.
 * Au-delà, le numéro doit être vérifié à nouveau.
 */
export const VERIFICATION_VALIDITY_MS = 30 * 60 * 1000;

const CODE_LENGTH = 6;

/** Code numérique tiré d’une source cryptographique. */
export const generateCode = () => {
  const max = 10 ** CODE_LENGTH;
  return String(crypto.randomInt(0, max)).padStart(CODE_LENGTH, '0');
};

const hashCode = (code, salt) =>
  crypto.createHash('sha256').update(`${salt}:${code}`).digest('hex');

/** Empreinte d’IP : permet le comptage sans conserver l’adresse elle-même. */
export const hashIp = (ip) =>
  crypto.createHash('sha256').update(String(ip ?? 'unknown')).digest('hex').slice(0, 32);

/** Adresse d’origine, telle que transmise par le proxy Vercel. */
export const clientIp = (request) => {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return request.socket?.remoteAddress ?? 'unknown';
};

const since = (ms) => new Date(Date.now() - ms);

/** Dernière vérification en cours pour ce numéro, le cas échéant. */
export const findLatestVerification = async (environment, phone) => {
  const { results } = await findObjects(environment, VERIFICATION_CLASS, {
    where: { phone },
    order: '-createdAt',
    limit: 1,
  });
  return results?.[0] ?? null;
};

/** Nombre d’envois récents vers ce numéro. */
export const countRecentSends = async (environment, phone) => {
  const { count } = await findObjects(environment, VERIFICATION_CLASS, {
    where: { phone, createdAt: { $gte: parseDate(since(SEND_WINDOW_MS)) } },
    limit: 0,
    count: true,
  });
  return count ?? 0;
};

/** Nombre d’envois récents depuis cette adresse IP. */
export const countRecentSendsByIp = async (environment, ipHash) => {
  const { count } = await findObjects(environment, VERIFICATION_CLASS, {
    where: { ipHash, createdAt: { $gte: parseDate(since(SEND_WINDOW_MS)) } },
    limit: 0,
    count: true,
  });
  return count ?? 0;
};

/** Enregistre un nouveau code et renvoie sa valeur en clair, à envoyer par SMS. */
export const issueCode = async (environment, phone, ipHash) => {
  const code = generateCode();
  const salt = crypto.randomBytes(16).toString('hex');
  const now = new Date();

  const created = await createObject(environment, VERIFICATION_CLASS, {
    phone,
    codeHash: hashCode(code, salt),
    salt,
    ipHash,
    attempts: 0,
    sentAt: parseDate(now),
    expiresAt: parseDate(new Date(now.getTime() + CODE_TTL_MS)),
  });

  return { code, objectId: created.objectId, sentAt: now };
};

/**
 * Confronte le code saisi au dernier code émis.
 * Renvoie `{ ok: true }` ou `{ ok: false, reason }` — jamais le code attendu.
 */
export const verifyCode = async (environment, phone, submittedCode) => {
  const record = await findLatestVerification(environment, phone);
  if (!record) return { ok: false, reason: 'no_code' };
  if (record.verifiedAt) return { ok: true, record };

  if (new Date(record.expiresAt?.iso ?? 0).getTime() < Date.now()) {
    return { ok: false, reason: 'expired' };
  }
  if ((record.attempts ?? 0) >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  const expected = hashCode(submittedCode, record.salt ?? '');
  const submittedBuffer = Buffer.from(expected);
  const storedBuffer = Buffer.from(record.codeHash ?? '');
  const matches =
    submittedBuffer.length === storedBuffer.length &&
    crypto.timingSafeEqual(submittedBuffer, storedBuffer);

  if (!matches) {
    await updateObject(environment, VERIFICATION_CLASS, record.objectId, {
      attempts: { __op: 'Increment', amount: 1 },
    });
    const remaining = MAX_ATTEMPTS - ((record.attempts ?? 0) + 1);
    return { ok: false, reason: 'mismatch', remaining: Math.max(remaining, 0) };
  }

  await updateObject(environment, VERIFICATION_CLASS, record.objectId, {
    verifiedAt: parseDate(new Date()),
  });
  return { ok: true, record };
};

/**
 * Vrai si le numéro porte une vérification réussie, récente et non consommée.
 * Appelé au moment de l’enregistrement : c’est ce contrôle, et non le client,
 * qui autorise la création de la demande.
 */
export const isPhoneVerified = async (environment, phone) => {
  const record = await findLatestVerification(environment, phone);
  if (!record?.verifiedAt || record.consumedAt) return null;

  const verifiedAt = new Date(record.verifiedAt.iso ?? 0).getTime();
  if (Date.now() - verifiedAt > VERIFICATION_VALIDITY_MS) return null;
  return record;
};

/** Marque la vérification comme utilisée : un code ne vaut qu’une demande. */
export const consumeVerification = (environment, objectId) =>
  updateObject(environment, VERIFICATION_CLASS, objectId, {
    consumedAt: parseDate(new Date()),
  });
