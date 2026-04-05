/**
 * Generate structured member IDs: ASFO-{PROF}-{YEAR}-{SEQ}
 * e.g. ASFO-MED-2026-001
 */

const professionCodes: Record<string, string> = {
  medecin: 'MED',
  infirmier: 'INF',
  sage_femme: 'SF',
  pharmacien: 'PH',
  technicien: 'TECH',
  etudiant: 'ETU',
  secretaire: 'SEC',
  agent_sante: 'AS',
  chauffeur: 'AMB',
  autre_medical: 'AM',
  enseignant: 'ENS',
  etudiant_non_medical: 'ETU2',
  commercant: 'COM',
  artisan: 'ART',
  agriculteur: 'AGR',
  cadre: 'CAD',
  employe: 'EMP',
  fonctionnaire: 'FON',
  secteur_informel: 'SI',
  retraite: 'RET',
  sans_emploi: 'SE',
  benevole: 'BEN',
  autre: 'AUT',
};

function getProfCode(profession: string): string {
  return professionCodes[profession] || 'AUT';
}

interface MemberLike {
  objectId: string;
  profession: string;
  createdAt: string;
}

/**
 * Generates a deterministic member ID based on profession, year, and creation order.
 * All members must be provided so the sequential number can be computed.
 */
export function generateMemberId(member: MemberLike, allMembers: MemberLike[]): string {
  const profCode = getProfCode(member.profession);
  const year = new Date(member.createdAt).getFullYear();

  // Filter members with same profession code and same year, sorted by createdAt ascending
  const sameGroup = allMembers
    .filter((m) => getProfCode(m.profession) === profCode && new Date(m.createdAt).getFullYear() === year)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const index = sameGroup.findIndex((m) => m.objectId === member.objectId);
  const seq = String((index >= 0 ? index : sameGroup.length) + 1).padStart(3, '0');

  return `ASFO-${profCode}-${year}-${seq}`;
}

/**
 * Find a member by their generated ID from a list of members.
 */
export function findMemberById(memberId: string, allMembers: MemberLike[]): MemberLike | undefined {
  return allMembers.find((m) => generateMemberId(m, allMembers) === memberId);
}
