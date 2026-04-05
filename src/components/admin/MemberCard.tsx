import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

export interface MemberCardProps {
  name: string;
  role: string;
  phone: string;
  city: string;
  memberId: string;
  photo?: string;
  email?: string;
  validity?: string;
  createdAt?: string;
  cardId?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  name,
  role,
  phone,
  city,
  memberId,
  photo,
  email,
  validity,
  createdAt,
  cardId,
}) => {
  // Validite dynamique : 2 ans apres la date de creation
  const creationDate = createdAt ? new Date(createdAt) : new Date();
  const expiryDate = new Date(creationDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  const expiryMonth = expiryDate.toLocaleDateString('fr-FR', { month: 'long' });
  const expiryLabel = validity || `${expiryMonth.charAt(0).toUpperCase() + expiryMonth.slice(1)} ${expiryDate.getFullYear()}`;

  return (
    <div
      id={cardId || 'member-card'}
      className="relative mx-auto overflow-hidden"
      style={{
        width: '428px',
        height: '270px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1A5F7A 0%, #2A8BA8 30%, #5DA9C6 65%, #3B8DB5 100%)',
        }}
      />

      {/* ── Checkered pattern ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0.07,
          backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,0.7) 0% 25%, transparent 0% 50%) 0 0 / 18px 18px',
        }}
      />

      {/* ── Multi-layer wave zone ── */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: 0, right: 0, bottom: 0, width: '100%', height: '120px', zIndex: 4 }}
        viewBox="0 0 428 120"
        preserveAspectRatio="none"
      >
        <path d="M0,30 C60,15 120,45 200,25 C280,5 360,35 428,18 L428,120 L0,120 Z" fill="#1A5F7A" opacity="0.15" />
        <path d="M0,42 C70,28 150,55 230,35 C310,15 380,42 428,30 L428,120 L0,120 Z" fill="#2A8BA8" opacity="0.2" />
        <path d="M0,52 C80,38 170,62 260,42 C340,25 400,50 428,40 L428,120 L0,120 Z" fill="#5DA9C6" opacity="0.25" />
        <path d="M0,56 C90,42 180,65 270,48 C350,34 410,52 428,44 L428,49 C410,57 350,39 270,53 C180,70 90,47 0,61 Z" fill="#C62828" opacity="0.5" />
        <path d="M0,62 C90,48 180,70 270,54 C350,40 410,58 428,50 L428,90 L0,90 Z" fill="#F0F6FA" opacity="0.4" />
        <path d="M0,68 C100,55 200,72 300,58 C370,48 420,60 428,55 L428,90 L0,90 Z" fill="#FFFFFF" opacity="0.3" />
      </svg>

      {/* ── Slogan ── */}
      <div
        className="absolute"
        style={{
          bottom: '28px', left: 0, right: 0, zIndex: 6,
          textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" style={{ flexShrink: 0 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p
          style={{
            fontSize: '15px', fontStyle: 'italic', fontWeight: 700,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: '#FFFFFF', letterSpacing: '0.3px',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          Au service du Fouta
        </p>
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex" style={{ height: '3px' }}>
        <div style={{ flex: 2, background: '#1A5F7A' }} />
        <div style={{ width: '48px', background: 'rgba(255,255,255,0.9)' }} />
        <div style={{ flex: 3, background: '#C62828' }} />
      </div>

      {/* ── Drapeau du Senegal ── */}
      <div
        className="absolute z-20"
        style={{
          top: '8px', right: '10px', borderRadius: '3px', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.3)', lineHeight: 0,
        }}
      >
        <svg width="38" height="26" viewBox="0 0 42 30" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="14" height="30" fill="#00853F" />
          <rect x="14" y="0" width="14" height="30" fill="#FDEF42" />
          <polygon points="21,8.5 22.9,14 28.5,14 23.8,17.5 25.7,23 21,19.5 16.3,23 18.2,17.5 13.5,14 19.1,14" fill="#00853F" />
          <rect x="28" y="0" width="14" height="30" fill="#E31B23" />
        </svg>
      </div>

      {/* ── HEADER: logo + titre centre ── */}
      <div className="relative z-10 flex items-center" style={{ padding: '8px 56px 0 18px' }}>
        {/* Logo */}
        <div
          style={{
            width: '42px', height: '42px', borderRadius: '50%', background: 'white',
            padding: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <img
            src="/logo-asfo.png"
            alt="Logo ASFO"
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'contain' }}
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Titre centre entre logo et drapeau */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12.5px', fontWeight: 800, color: 'white',
              letterSpacing: '0.6px', lineHeight: 1.15,
              textShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
          >
            ACTION SANITAIRE POUR LE FOUTA
          </p>
          <p style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px', marginTop: '1px' }}>
            (ASFO)
          </p>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="relative z-10" style={{ margin: '3px 18px 1px 18px' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
      </div>

      {/* ── BODY: photo + infos ── */}
      <div className="relative z-10 flex" style={{ padding: '2px 18px 0 18px', gap: '10px' }}>
        {/* Photo — 30-40% bigger */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: '100px', height: '115px', borderRadius: '10px',
              border: '3px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)', overflow: 'hidden', background: 'white',
            }}
          >
            {photo ? (
              <img
                src={photo}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.style.display = 'flex';
                    parent.style.alignItems = 'center';
                    parent.style.justifyContent = 'center';
                    parent.style.background = 'linear-gradient(135deg, #1A5F7A, #5DA9C6)';
                    const span = document.createElement('span');
                    span.style.fontSize = '28px';
                    span.style.fontWeight = '700';
                    span.style.color = 'rgba(255,255,255,0.6)';
                    span.textContent = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                    parent.appendChild(span);
                  }
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%', height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1A5F7A, #5DA9C6)',
                }}
              >
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                  {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Infos membre */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nom — plus grand */}
          <p
            style={{
              fontSize: '17px', fontWeight: 700, color: 'white', lineHeight: 1.2,
              textShadow: '0 1px 2px rgba(0,0,0,0.25)', wordBreak: 'break-word',
            }}
          >
            {name}
          </p>

          {/* Role en vert */}
          <p
            style={{
              fontSize: '12px', fontWeight: 600, color: '#4ADE80', marginTop: '1px',
              textShadow: '0 1px 1px rgba(0,0,0,0.15)',
            }}
          >
            {role}
          </p>

          {/* Numero de membre — format "Numero : ASFO-MED-2026-001" */}
          <p
            style={{
              fontSize: '9.5px', fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 600, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.85)', marginTop: '2px',
            }}
          >
            Numero : {memberId}
          </p>

          {/* Contact */}
          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Telephone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone style={{ width: '11px', height: '11px', color: '#FFFFFF', flexShrink: 0 }} />
              <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#FFFFFF' }}>{phone}</span>
            </div>
            {/* Adresse complete */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <MapPin style={{ width: '11px', height: '11px', color: '#FFFFFF', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.3 }}>{city}</span>
            </div>
            {/* Email personnel */}
            {email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail style={{ width: '11px', height: '11px', color: '#FFFFFF', flexShrink: 0 }} />
                <span style={{ fontSize: '10px', fontWeight: 500, color: '#FFFFFF' }}>{email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER rouge ── */}
      <div
        className="absolute z-10"
        style={{
          bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 18px',
          background: 'linear-gradient(90deg, #C62828 0%, #B71C1C 50%, #9B1B1B 100%)',
          borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
        }}
      >
        <span
          style={{
            fontSize: '11px', fontWeight: 700, color: 'white',
            letterSpacing: '3px', textTransform: 'uppercase',
          }}
        >
          Carte Membre
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
          Validite : {expiryLabel}
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
