import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, MapPin, Globe } from 'lucide-react';

export interface MemberCardProps {
  name: string;
  role: string;
  phone: string;
  city: string;
  memberId: string;
  photo?: string;
  validity?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  name,
  role,
  phone,
  city,
  memberId,
  photo,
  validity = '2026',
}) => {
  const formatCity = (address: string) => {
    if (!address) return '';
    const lower = address.toLowerCase();
    if (lower.includes('rufisque')) return 'Rufisque';
    if (lower.includes('dakar')) return 'Dakar';
    if (lower.includes('diamniadio')) return 'Diamniadio';
    return address.length > 14 ? address.slice(0, 14) + '...' : address;
  };

  const qrUrl = `https://asfosante.org/verify/${memberId}`;

  return (
    <div
      id="member-card"
      className="relative mx-auto overflow-hidden"
      style={{
        width: '428px',
        height: '270px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* ── Background: ASFO blue gradient (inspired by old card) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1F6F8B 0%, #2A8BA8 35%, #5DA9C6 70%, #1F6F8B 100%)',
        }}
      />

      {/* ── Checkered pattern overlay (like old card) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '0',
          left: '0',
          width: '55%',
          height: '100%',
          opacity: 0.08,
          backgroundImage:
            'repeating-conic-gradient(rgba(255,255,255,0.6) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px',
        }}
      />

      {/* ── Decorative diagonal red stripe (like old card) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 428 270"
        preserveAspectRatio="none"
      >
        <path
          d="M0,215 Q100,200 200,210 Q300,220 428,205 L428,212 Q300,227 200,217 Q100,207 0,222 Z"
          fill="#D62828"
          opacity="0.25"
        />
        <path
          d="M0,230 C100,250 250,210 428,240 L428,270 L0,270 Z"
          fill="rgba(255,255,255,0.06)"
        />
      </svg>

      {/* ── Light glow orb ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(93,169,198,0.3) 0%, transparent 70%)',
        }}
      />

      {/* ── Top tricolore bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex" style={{ height: '3px' }}>
        <div className="flex-[2]" style={{ background: '#1F6F8B' }} />
        <div className="w-12 bg-white/90" />
        <div className="flex-[3]" style={{ background: '#D62828' }} />
      </div>

      {/* ── Drapeau du Senegal ── */}
      <div
        className="absolute z-20"
        style={{
          top: '8px',
          right: '10px',
          borderRadius: '3px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)',
          lineHeight: 0,
        }}
      >
        <svg width="40" height="28" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="13.33" height="28" fill="#00853F" />
          <rect x="13.33" y="0" width="13.33" height="28" fill="#FDEF42" />
          <polygon points="20,8 21.8,13.5 27.5,13.5 22.8,17 24.6,22.5 20,19 15.4,22.5 17.2,17 12.5,13.5 18.2,13.5" fill="#00853F" />
          <rect x="26.66" y="0" width="13.34" height="28" fill="#E31B23" />
        </svg>
      </div>

      {/* ── HEADER — logo + ASFO ── */}
      <div className="relative z-10 flex items-center gap-2.5 px-5 pt-3 pb-0.5">
        {/* Logo with white circular background */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'white',
            padding: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255,255,255,0.8)',
          }}
        >
          <img
            src="/logo-asfo.png"
            alt="Logo ASFO"
            className="rounded-full object-contain"
            style={{ width: '30px', height: '30px' }}
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1">
          <h2
            className="font-extrabold text-white"
            style={{ fontSize: '14px', letterSpacing: '1.5px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            ACTION SANITAIRE POUR LE FOUTA
          </h2>
          <p
            className="font-bold"
            style={{ fontSize: '8px', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.75)' }}
          >
            (ASFO)
          </p>
        </div>
      </div>

      {/* ── "CARTE MEMBRE" title ── */}
      <div className="relative z-10 mx-5 mt-0.5 mb-1">
        <div
          className="h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          }}
        />
        <p
          className="text-center uppercase text-white"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            marginTop: '3px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Carte Membre
        </p>
      </div>

      {/* ── BODY ── */}
      <div className="relative z-10 flex gap-3 px-5 pt-1">
        {/* Photo — bigger (+20%) */}
        <div className="shrink-0">
          <div className="relative">
            <div
              className="overflow-hidden"
              style={{
                width: '80px',
                height: '96px',
                borderRadius: '10px',
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      parent.style.background = 'linear-gradient(135deg, #1F6F8B, #5DA9C6)';
                      const span = document.createElement('span');
                      span.className = 'text-2xl font-bold';
                      span.style.color = 'rgba(255,255,255,0.6)';
                      span.textContent = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1F6F8B, #5DA9C6)' }}
                >
                  <span className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            {/* Status dot */}
            <div
              className="absolute"
              style={{
                bottom: '-3px',
                right: '-3px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                border: '2px solid #1F6F8B',
                backgroundColor: '#34d399',
                boxShadow: '0 0 4px rgba(52,211,153,0.5)',
              }}
            />
          </div>
        </div>

        {/* Info — glass panel */}
        <div
          className="flex-1 px-3 py-2"
          style={{
            minWidth: '0',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <h2
            className="font-bold text-white whitespace-nowrap"
            style={{
              fontSize: '16px',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              overflow: 'visible',
            }}
          >
            {name}
          </h2>
          <p
            className="font-semibold"
            style={{
              fontSize: '10px',
              marginTop: '2px',
              color: '#FDEF42',
              textShadow: '0 1px 1px rgba(0,0,0,0.2)',
            }}
          >
            {role}
          </p>
          <p
            style={{
              fontSize: '8px',
              marginTop: '2px',
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {memberId}
          </p>

          {/* Contact info */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone className="h-2.5 w-2.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span
                style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.85)',
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }}
              >
                {phone}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-2.5 w-2.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span
                style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.85)',
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }}
              >
                {formatCity(city)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-2.5 w-2.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize: '9px', color: 'rgba(93,169,198,0.9)' }}>
                www.asfosante.org
              </span>
            </div>
          </div>
        </div>

        {/* QR Code — glass panel (kept on recto, also on verso) */}
        <div
          className="shrink-0 flex flex-col items-center justify-center"
          style={{
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '8px',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '5px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <QRCodeSVG
              value={qrUrl}
              size={68}
              level="H"
              bgColor="#ffffff"
              fgColor="#1F6F8B"
            />
          </div>
          <span
            style={{
              fontSize: '6px',
              marginTop: '3px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.5px',
            }}
          >
            Scanner
          </span>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div
          className="flex items-center justify-between"
          style={{
            padding: '7px 20px',
            background: 'linear-gradient(90deg, #D62828 0%, #b91c1c 50%, #991b1b 100%)',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        >
          <span
            className="font-bold uppercase text-white"
            style={{ fontSize: '8px', letterSpacing: '2px' }}
          >
            Carte Professionnelle
          </span>
          <span
            className="font-semibold"
            style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)' }}
          >
            Validite : {validity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
