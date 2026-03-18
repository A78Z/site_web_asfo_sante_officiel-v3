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
      {/* ── Background: premium ASFO gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #134E5E 40%, #1E3A5F 100%)',
        }}
      />

      {/* ── Diagonal lines pattern overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,1) 12px, rgba(255,255,255,1) 13px)',
        }}
      />

      {/* ── Decorative wave curve ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 428 270"
        preserveAspectRatio="none"
      >
        <path
          d="M0,180 C100,220 200,140 428,190 L428,270 L0,270 Z"
          fill="rgba(255,255,255,0.04)"
        />
        <path
          d="M0,200 C150,240 280,170 428,210 L428,270 L0,270 Z"
          fill="rgba(255,255,255,0.03)"
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
          background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)',
        }}
      />

      {/* ── Top tricolore bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex" style={{ height: '3px' }}>
        <div className="flex-[2] bg-[#0F766E]" />
        <div className="w-12 bg-white/90" />
        <div className="flex-[3] bg-[#DC2626]" />
      </div>

      {/* ── Drapeau du Sénégal 🇸🇳 ── */}
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
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            padding: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
            style={{ fontSize: '13px', letterSpacing: '1.5px' }}
          >
            ASFO
          </h2>
          <p
            className="font-medium"
            style={{ fontSize: '7px', letterSpacing: '0.5px', color: 'rgba(167,243,208,0.85)' }}
          >
            Action Sanitaire pour le Fouta
          </p>
        </div>
      </div>

      {/* ── "CARTE MEMBRE" title ── */}
      <div className="relative z-10 mx-5 mt-0.5 mb-1">
        <div
          className="h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
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
        {/* Photo */}
        <div className="shrink-0">
          <div className="relative">
            <div
              className="overflow-hidden"
              style={{
                width: '68px',
                height: '82px',
                borderRadius: '10px',
                border: '3px solid rgba(255,255,255,0.8)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
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
                      parent.style.background = 'linear-gradient(135deg, #0F766E, #1E3A5F)';
                      const span = document.createElement('span');
                      span.className = 'text-xl font-bold';
                      span.style.color = 'rgba(255,255,255,0.6)';
                      span.textContent = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0F766E, #1E3A5F)' }}
                >
                  <span className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #134E5E',
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
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
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
              color: 'rgba(167,243,208,0.9)',
              textShadow: '0 1px 1px rgba(0,0,0,0.15)',
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
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            {memberId}
          </p>

          {/* Contact info */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone className="h-2.5 w-2.5" style={{ color: 'rgba(167,243,208,0.5)' }} />
              <span
                style={{
                  fontSize: '9px',
                  color: 'rgba(229,231,235,0.9)',
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }}
              >
                {phone}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-2.5 w-2.5" style={{ color: 'rgba(167,243,208,0.5)' }} />
              <span
                style={{
                  fontSize: '9px',
                  color: 'rgba(229,231,235,0.9)',
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                }}
              >
                {formatCity(city)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-2.5 w-2.5" style={{ color: 'rgba(167,243,208,0.5)' }} />
              <span style={{ fontSize: '9px', color: 'rgba(110,231,183,0.7)' }}>
                www.asfosante.org
              </span>
            </div>
          </div>
        </div>

        {/* QR Code — glass panel */}
        <div
          className="shrink-0 flex flex-col items-center justify-center"
          style={{
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '8px',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '6px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <QRCodeSVG
              value={qrUrl}
              size={70}
              level="H"
              bgColor="#ffffff"
              fgColor="#0D9488"
            />
          </div>
          <span
            style={{
              fontSize: '6px',
              marginTop: '3px',
              color: 'rgba(110,231,183,0.45)',
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
          className="flex items-center justify-between px-5"
          style={{
            padding: '7px 20px',
            background: 'linear-gradient(90deg, #DC2626 0%, #b91c1c 50%, #991b1b 100%)',
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
            Validité : {validity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
