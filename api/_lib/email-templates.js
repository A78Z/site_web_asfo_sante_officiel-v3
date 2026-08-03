/**
 * Gabarits d’e-mails du recrutement médical.
 *
 * Chaque gabarit produit une version HTML et une version texte : certains
 * clients de messagerie, et les lecteurs d’écran en mode texte, n’affichent que
 * la seconde. Le HTML reste volontairement simple — tableaux et styles en
 * ligne — parce que les clients de messagerie ignorent les feuilles de style
 * externes et une bonne partie du CSS moderne.
 */

import { RECRUITMENT_CAMPAIGN } from './recruitment.js';

/** Échappement HTML : toute valeur venant du candidat passe par ici. */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const BRAND = '#0d9488';
const INK = '#0f172a';
const MUTED = '#475569';

const layout = (title, bodyHtml) => `
<div style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <tr>
      <td style="background:${BRAND};padding:24px 28px;">
        <p style="margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#ccfbf1;font-weight:700;">ASFO — Action Sanitaire pour le Fouta</p>
        <h1 style="margin:6px 0 0;font-size:20px;line-height:1.3;color:#ffffff;font-weight:800;">${escapeHtml(title)}</h1>
      </td>
    </tr>
    <tr><td style="padding:28px;color:${INK};font-size:15px;line-height:1.65;">${bodyHtml}</td></tr>
    <tr>
      <td style="padding:18px 28px 26px;border-top:1px solid #e2e8f0;color:${MUTED};font-size:12px;line-height:1.6;">
        <p style="margin:0;">${escapeHtml(RECRUITMENT_CAMPAIGN)}</p>
        <p style="margin:6px 0 0;">Cet e-mail vous est adressé parce qu’une candidature a été déposée avec cette adresse. Si vous n’êtes pas à l’origine de cette démarche, ignorez ce message.</p>
      </td>
    </tr>
  </table>
</div>`;

const infoRow = (label, value) => `
  <tr>
    <td style="padding:8px 0;color:${MUTED};font-size:13px;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;text-align:right;font-weight:700;color:${INK};font-size:13px;">${escapeHtml(value)}</td>
  </tr>`;

/** Confirmation envoyée dès l’enregistrement de la candidature. */
export const recruitmentReceivedEmail = ({
  firstName,
  lastName,
  specialty,
  reference,
  region,
  availability,
}) => {
  const subject = `Candidature ${reference} — ${specialty} | ASFO 2026`;

  const html = layout('Votre candidature a bien été enregistrée', `
    <p style="margin:0 0 14px;">Bonjour <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>,</p>
    <p style="margin:0 0 14px;">Nous accusons réception de votre candidature en tant que <strong>${escapeHtml(specialty)}</strong> pour la ${escapeHtml(RECRUITMENT_CAMPAIGN)}.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:18px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
      ${infoRow('Référence du dossier', reference)}
      ${infoRow('Spécialité', specialty)}
      ${infoRow('Région', region)}
      ${infoRow('Disponibilité', availability)}
    </table>
    <p style="margin:0 0 14px;">Notre commission examinera votre dossier. Vous serez informé(e) de la suite par SMS ou WhatsApp.</p>
    <p style="margin:0 0 14px;">Conservez votre référence <strong>${escapeHtml(reference)}</strong> : elle est demandée pour tout échange concernant votre candidature.</p>
    <p style="margin:0;">Merci pour votre engagement au service des populations du Fouta.</p>
    <p style="margin:14px 0 0;font-weight:700;">L’équipe ASFO</p>
  `);

  const text = [
    `Bonjour ${firstName} ${lastName},`,
    '',
    `Nous accusons réception de votre candidature en tant que ${specialty} pour la ${RECRUITMENT_CAMPAIGN}.`,
    '',
    `Référence du dossier : ${reference}`,
    `Spécialité : ${specialty}`,
    `Région : ${region}`,
    `Disponibilité : ${availability}`,
    '',
    'Notre commission examinera votre dossier. Vous serez informé(e) de la suite par SMS ou WhatsApp.',
    `Conservez votre référence ${reference} : elle est demandée pour tout échange concernant votre candidature.`,
    '',
    'Merci pour votre engagement au service des populations du Fouta.',
    'L’équipe ASFO',
  ].join('\n');

  return { subject, html, text };
};

/** Notification de décision, déclenchée depuis le back-office. */
export const recruitmentDecisionEmail = ({
  firstName,
  lastName,
  specialty,
  reference,
  status,
  comment,
}) => {
  const subject = `Votre candidature ${reference} — ${status} | ASFO 2026`;

  const html = layout('Suite donnée à votre candidature', `
    <p style="margin:0 0 14px;">Bonjour <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>,</p>
    <p style="margin:0 0 14px;">Votre candidature <strong>${escapeHtml(reference)}</strong> en tant que <strong>${escapeHtml(specialty)}</strong> a été examinée par notre commission de recrutement.</p>
    <p style="margin:0 0 14px;padding:12px 16px;background:#f0fdfa;border-left:4px solid ${BRAND};border-radius:6px;">Décision : <strong>${escapeHtml(status)}</strong></p>
    ${comment ? `<p style="margin:0 0 14px;">${escapeHtml(comment)}</p>` : ''}
    <p style="margin:0;">Nous reviendrons vers vous par SMS ou WhatsApp pour les modalités pratiques.</p>
    <p style="margin:14px 0 0;font-weight:700;">L’équipe ASFO</p>
  `);

  const text = [
    `Bonjour ${firstName} ${lastName},`,
    '',
    `Votre candidature ${reference} en tant que ${specialty} a été examinée par notre commission de recrutement.`,
    `Décision : ${status}`,
    ...(comment ? ['', comment] : []),
    '',
    'Nous reviendrons vers vous par SMS ou WhatsApp pour les modalités pratiques.',
    'L’équipe ASFO',
  ].join('\n');

  return { subject, html, text };
};
