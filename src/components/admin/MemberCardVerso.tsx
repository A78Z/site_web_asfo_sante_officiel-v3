import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface MemberCardVersoProps {
  name: string;
  memberId: string;
  createdAt?: string;
  cardId?: string;
  /** Date de naissance ISO (AAAA-MM-JJ). Omise, la ligne n’est pas affichée. */
  birthDate?: string;
  /** Lieu de naissance. Omis, la ligne n’est pas affichée. */
  birthPlace?: string;
}

const MemberCardVerso: React.FC<MemberCardVersoProps> = ({
  name,
  memberId,
  createdAt,
  cardId,
  birthDate,
  birthPlace,
}) => {
  const qrUrl = `https://asfosante.org/verify/${memberId}`;

  // Format court : sur 428 px de large, « 18/06/1990 » tient sans risque de
  // repli, contrairement à « 18 juin 1990 ».
  const isoBirthDate = birthDate ?? '';
  const birthDateLabel = /^\d{4}-\d{2}-\d{2}$/.test(isoBirthDate)
    ? `${isoBirthDate.slice(8, 10)}/${isoBirthDate.slice(5, 7)}/${isoBirthDate.slice(0, 4)}`
    : isoBirthDate;

  // Validite dynamique : 2 ans apres la date de creation
  const creationDate = createdAt ? new Date(createdAt) : new Date();
  const expiryDate = new Date(creationDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  const expiryMonth = expiryDate.toLocaleDateString('fr-FR', { month: 'long' });
  const expiryYear = expiryDate.getFullYear();
  const expiryLabel = `${expiryMonth.charAt(0).toUpperCase() + expiryMonth.slice(1)} ${expiryYear}`;

  return (
    <div
      id={cardId || 'member-card-verso'}
      className="relative mx-auto overflow-hidden"
      style={{
        width: '428px',
        height: '270px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
        background: '#FFFFFF',
      }}
    >
      {/* ── Top accent bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex" style={{ height: '3px' }}>
        <div className="flex-[2]" style={{ background: '#1F6F8B' }} />
        <div className="w-12 bg-white" />
        <div className="flex-[3]" style={{ background: '#D62828' }} />
      </div>

      {/* ── Decorative wave bottom ── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
        viewBox="0 0 428 100"
        preserveAspectRatio="none"
        style={{ height: '100px' }}
      >
        <path
          d="M0,40 C80,70 180,20 280,50 C350,70 400,45 428,55 L428,100 L0,100 Z"
          fill="#1F6F8B"
          opacity="0.08"
        />
        <path
          d="M0,60 C120,80 200,40 320,65 C380,75 410,60 428,70 L428,100 L0,100 Z"
          fill="#5DA9C6"
          opacity="0.06"
        />
      </svg>

      {/* ── Checkered pattern ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '0',
          right: '0',
          width: '180px',
          height: '80px',
          opacity: 0.04,
          backgroundImage:
            'repeating-conic-gradient(#1F6F8B 0% 25%, transparent 0% 50%) 0 0 / 16px 16px',
        }}
      />

      {/* ── Red diagonal stripe ── */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: '0', left: '0', width: '100%', height: '100%' }}
        viewBox="0 0 428 270"
        preserveAspectRatio="none"
      >
        <path
          d="M0,210 Q214,190 428,215 L428,220 Q214,195 0,215 Z"
          fill="#D62828"
          opacity="0.15"
        />
      </svg>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex h-full flex-col" style={{ padding: '8px 20px 6px 20px' }}>
        {/* Top row: Logo + QR Code */}
        <div className="flex items-start justify-between">
          {/* Left: Logo + org info */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'white',
                border: '2px solid #1F6F8B',
                padding: '3px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="/logo-asfo.png"
                alt="Logo ASFO"
                className="rounded-full object-contain"
                style={{ width: '30px', height: '30px' }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p
                className="font-extrabold"
                style={{ fontSize: '14px', color: '#1F6F8B', letterSpacing: '1.5px' }}
              >
                ASFO
              </p>
              <p style={{ fontSize: '7px', color: '#888', letterSpacing: '0.3px' }}>
                Action Sanitaire pour le Fouta
              </p>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center">
            <div
              style={{
                background: 'white',
                padding: '4px',
                borderRadius: '8px',
                border: '2px solid #1F6F8B',
                boxShadow: '0 2px 8px rgba(31,111,139,0.15)',
              }}
            >
              <QRCodeSVG
                value={qrUrl}
                size={72}
                level="H"
                bgColor="#ffffff"
                fgColor="#1F6F8B"
              />
            </div>
            <p
              style={{
                fontSize: '6.5px',
                color: '#1F6F8B',
                marginTop: '2px',
                letterSpacing: '0.3px',
                fontWeight: 600,
              }}
            >
              Scanner pour verifier
            </p>
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            height: '1px',
            margin: '5px 0',
            background: 'linear-gradient(90deg, #1F6F8B 0%, #5DA9C6 50%, transparent 100%)',
            opacity: 0.3,
          }}
        />

        {/* Contact info grid */}
        <div className="flex gap-6" style={{ flex: 1 }}>
          {/* Left column: ASFO contact info */}
          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Address */}
            <div className="flex items-start gap-2">
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#D62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginTop: '1px', flexShrink: 0 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p style={{ fontSize: '9px', color: '#333', fontWeight: 600, lineHeight: 1.4 }}>
                  FMPO/UCAD Amicale Moussa
                </p>
                <p style={{ fontSize: '8px', color: '#555', fontWeight: 500, lineHeight: 1.3 }}>
                  BP 25255 - Dakar Fann
                </p>
              </div>
            </div>

            {/* Phone ASFO */}
            <div className="flex items-center gap-2">
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#1F6F8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <p style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>
                +221710401760
              </p>
            </div>

            {/* Email ASFO */}
            <div className="flex items-center gap-2">
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#1F6F8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <p style={{ fontSize: '9px', color: '#555', fontWeight: 500 }}>
                contact@asfosante.org
              </p>
            </div>

            {/* Website */}
            <div className="flex items-center gap-2">
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#1F6F8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <p style={{ fontSize: '9px', color: '#1F6F8B', fontWeight: 600 }}>
                www.asfosante.org
              </p>
            </div>

            {/* État civil du titulaire. Ajout purement additif : placé dans le
                seul espace libre mesuré du verso (bas de cette colonne), sans
                déplacer ni redimensionner aucun élément existant. */}
            {(birthDateLabel || birthPlace) && (
              <>
                <div
                  style={{
                    height: '1px',
                    marginTop: '2px',
                    background: 'rgba(31,111,139,0.15)',
                  }}
                />
                {birthDateLabel && (
                  <p style={{ fontSize: '8.5px', color: '#555', fontWeight: 500, lineHeight: 1.3 }}>
                    <span style={{ color: '#999' }}>Né(e) le : </span>
                    {birthDateLabel}
                  </p>
                )}
                {birthPlace && (
                  <p
                    style={{
                      fontSize: '8.5px',
                      color: '#555',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      // Un lieu long est tronqué plutôt que de repousser le
                      // slogan et le drapeau vers le bas.
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px',
                    }}
                    title={birthPlace}
                  >
                    <span style={{ color: '#999' }}>Lieu de naissance : </span>
                    {birthPlace}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Right column: member info summary */}
          <div
            className="flex flex-col justify-center"
            style={{
              minWidth: '140px',
              borderRadius: '8px',
              background: 'rgba(31,111,139,0.05)',
              border: '1px solid rgba(31,111,139,0.12)',
              padding: '8px 12px',
            }}
          >
            <p style={{ fontSize: '7px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Titulaire
            </p>
            <p style={{ fontSize: '11px', color: '#1F6F8B', fontWeight: 700, marginTop: '2px' }}>
              {name}
            </p>
            <div
              className="my-1.5"
              style={{ height: '1px', background: 'rgba(31,111,139,0.15)' }}
            />
            <p style={{ fontSize: '7px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              N° Membre
            </p>
            <p style={{ fontSize: '9px', color: '#333', fontWeight: 600, fontFamily: "'Courier New', monospace", marginTop: '1px' }}>
              {memberId}
            </p>
            <div
              className="my-1.5"
              style={{ height: '1px', background: 'rgba(31,111,139,0.15)' }}
            />
            <p style={{ fontSize: '7px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Expire
            </p>
            <p style={{ fontSize: '9px', color: '#D62828', fontWeight: 700, marginTop: '1px' }}>
              {expiryLabel}
            </p>
          </div>
        </div>

        {/* Bottom: slogan + flag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '3px' }}>
          <p
            style={{
              fontSize: '11px',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#1F6F8B',
              letterSpacing: '0.5px',
            }}
          >
            Au service du Fouta
          </p>
          {/* Senegal flag */}
          <svg width="28" height="20" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            <rect x="0" y="0" width="13.33" height="28" fill="#00853F" />
            <rect x="13.33" y="0" width="13.33" height="28" fill="#FDEF42" />
            <polygon points="20,8 21.8,13.5 27.5,13.5 22.8,17 24.6,22.5 20,19 15.4,22.5 17.2,17 12.5,13.5 18.2,13.5" fill="#00853F" />
            <rect x="26.66" y="0" width="13.34" height="28" fill="#E31B23" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MemberCardVerso;
