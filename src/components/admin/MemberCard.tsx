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

      {/* ── Multi-layer wave zone (exact match to PVC card) ── */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: 0, right: 0, bottom: 0, width: '100%', height: '120px', zIndex: 4 }}
        viewBox="0 0 428 120"
        preserveAspectRatio="none"
      >
        {/* Layer 1: dark blue subtle wave (background depth) */}
        <path
          d="M0,30 C60,15 120,45 200,25 C280,5 360,35 428,18 L428,120 L0,120 Z"
          fill="#1A5F7A"
          opacity="0.15"
        />
        {/* Layer 2: medium blue wave */}
        <path
          d="M0,42 C70,28 150,55 230,35 C310,15 380,42 428,30 L428,120 L0,120 Z"
          fill="#2A8BA8"
          opacity="0.2"
        />
        {/* Layer 3: light blue wave */}
        <path
          d="M0,52 C80,38 170,62 260,42 C340,25 400,50 428,40 L428,120 L0,120 Z"
          fill="#5DA9C6"
          opacity="0.25"
        />
        {/* Layer 4: red accent stripe (thin, like original) */}
        <path
          d="M0,56 C90,42 180,65 270,48 C350,34 410,52 428,44 L428,49 C410,57 350,39 270,53 C180,70 90,47 0,61 Z"
          fill="#C62828"
          opacity="0.5"
        />
        {/* Layer 5: white/cream wave — the slogan zone */}
        <path
          d="M0,62 C90,48 180,70 270,54 C350,40 410,58 428,50 L428,90 L0,90 Z"
          fill="#F0F6FA"
        />
        {/* Layer 6: pure white overlay for brightness */}
        <path
          d="M0,68 C100,55 200,72 300,58 C370,48 420,60 428,55 L428,90 L0,90 Z"
          fill="#FFFFFF"
          opacity="0.7"
        />
      </svg>

      {/* ── Slogan "Au service du Fouta" with location pin ── */}
      <div
        className="absolute"
        style={{
          bottom: '28px',
          left: 0,
          right: 0,
          zIndex: 6,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        {/* Location pin icon */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="#2A8BA8"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p
          style={{
            fontSize: '15px',
            fontStyle: 'italic',
            fontWeight: 700,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: '#1A3A4F',
            letterSpacing: '0.3px',
          }}
        >
          Au service du Fouta
        </p>
      </div>

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
