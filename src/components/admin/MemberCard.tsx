import React from 'react';
import { Phone, MapPin, Globe } from 'lucide-react';

export interface MemberCardProps {
  name: string;
  role: string;
  phone: string;
  city: string;
  memberId: string;
  photo?: string;
  validity?: string;
  createdAt?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  name,
  role,
  phone,
  city,
  memberId,
  photo,
  validity,
  createdAt,
}) => {
  // Validite dynamique : 1 an apres la date de creation
  const creationDate = createdAt ? new Date(createdAt) : new Date();
  const expiryDate = new Date(creationDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const expiryYear = validity || String(expiryDate.getFullYear());
  const formatCity = (address: string) => {
    if (!address) return '';
    const lower = address.toLowerCase();
    if (lower.includes('rufisque')) return 'Rufisque';
    if (lower.includes('dakar')) return 'Dakar';
    if (lower.includes('diamniadio')) return 'Diamniadio';
    return address.length > 16 ? address.slice(0, 16) + '...' : address;
  };

  return (
    <div
      id="member-card"
      className="relative mx-auto overflow-hidden"
      style={{
        width: '428px',
        height: '270px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* ── Background: bleu ASFO degrade ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1A5F7A 0%, #2A8BA8 30%, #5DA9C6 65%, #3B8DB5 100%)',
        }}
      />

      {/* ── Checkered pattern (like old PVC card) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          backgroundImage:
            'repeating-conic-gradient(rgba(255,255,255,0.7) 0% 25%, transparent 0% 50%) 0 0 / 18px 18px',
        }}
      />

      {/* ── Decorative waves + red stripe (like old card) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 428 270"
        preserveAspectRatio="none"
      >
        {/* Red diagonal stripe */}
        <path
          d="M0,208 Q80,195 160,205 Q260,218 340,200 Q400,192 428,198 L428,206 Q400,200 340,208 Q260,226 160,213 Q80,203 0,216 Z"
          fill="#C62828"
          opacity="0.35"
        />
        {/* White wave bottom */}
        <path
          d="M0,225 C60,240 140,218 220,230 C300,242 380,222 428,235 L428,270 L0,270 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M0,240 C80,252 200,228 300,245 C370,255 420,240 428,248 L428,270 L0,270 Z"
          fill="rgba(255,255,255,0.05)"
        />
      </svg>

      {/* ── Top bar: bleu / blanc / rouge ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex" style={{ height: '3px' }}>
        <div style={{ flex: 2, background: '#1A5F7A' }} />
        <div style={{ width: '48px', background: 'rgba(255,255,255,0.9)' }} />
        <div style={{ flex: 3, background: '#C62828' }} />
      </div>

      {/* ── Drapeau du Senegal (SVG inline, stable a l'export) ── */}
      <div
        className="absolute z-20"
        style={{
          top: '8px',
          right: '10px',
          borderRadius: '3px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)',
          lineHeight: 0,
        }}
      >
        <svg width="38" height="26" viewBox="0 0 42 30" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="14" height="30" fill="#00853F" />
          <rect x="14" y="0" width="14" height="30" fill="#FDEF42" />
          <polygon points="21,8.5 22.9,14 28.5,14 23.8,17.5 25.7,23 21,19.5 16.3,23 18.2,17.5 13.5,14 19.1,14" fill="#00853F" />
          <rect x="28" y="0" width="14" height="30" fill="#E31B23" />
        </svg>
      </div>

      {/* ── HEADER: logo + titre ── */}
      <div className="relative z-10 flex items-center gap-2.5" style={{ padding: '10px 18px 0 18px' }}>
        {/* Logo rond fond blanc */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            padding: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-asfo.png"
            alt="Logo ASFO"
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '0.8px',
              lineHeight: 1.2,
              textShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
          >
            ACTION SANITAIRE POUR LE FOUTA
          </p>
          <p
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.5px',
              marginTop: '1px',
            }}
          >
            (ASFO)
          </p>
        </div>
      </div>

      {/* ── Titre "CARTE MEMBRE" ── */}
      <div className="relative z-10" style={{ margin: '4px 18px 2px 18px' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
        <p
          style={{
            textAlign: 'center',
            fontSize: '9px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '3px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Carte Membre
        </p>
      </div>

      {/* ── BODY: photo + infos ── */}
      <div className="relative z-10 flex" style={{ padding: '4px 18px 0 18px', gap: '12px' }}>
        {/* Photo avec cadre blanc */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '82px',
                height: '98px',
                borderRadius: '10px',
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                background: 'white',
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.style.display = 'flex';
                      parent.style.alignItems = 'center';
                      parent.style.justifyContent = 'center';
                      parent.style.background = 'linear-gradient(135deg, #1A5F7A, #5DA9C6)';
                      const span = document.createElement('span');
                      span.style.fontSize = '24px';
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
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1A5F7A, #5DA9C6)',
                  }}
                >
                  <span style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Infos membre */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nom — wraps properly for long names */}
          <p
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.25,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              wordBreak: 'break-word',
            }}
          >
            {name}
          </p>

          {/* Role en jaune */}
          <p
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#FDEF42',
              marginTop: '2px',
              textShadow: '0 1px 1px rgba(0,0,0,0.15)',
            }}
          >
            {role}
          </p>

          {/* ID membre */}
          <p
            style={{
              fontSize: '7.5px',
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.45)',
              marginTop: '2px',
            }}
          >
            {memberId}
          </p>

          {/* Contact */}
          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)' }}>{phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)' }}>{formatCity(city)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe style={{ width: '10px', height: '10px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              <span style={{ fontSize: '9px', color: 'rgba(93,169,198,1)' }}>www.asfosante.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slogan "Au service du Fouta" ── */}
      <div
        className="relative z-10"
        style={{
          textAlign: 'center',
          marginTop: '3px',
          paddingBottom: '0',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#1A3A4F',
            textShadow: '0 1px 2px rgba(255,255,255,0.15)',
            letterSpacing: '0.3px',
          }}
        >
          Au service du Fouta
        </p>
      </div>

      {/* ── FOOTER rouge ── */}
      <div
        className="absolute z-10"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 18px',
          background: 'linear-gradient(90deg, #C62828 0%, #B71C1C 50%, #9B1B1B 100%)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Carte Professionnelle
        </span>
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          Validite : {expiryYear}
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
