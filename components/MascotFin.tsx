
import React from 'react';

interface MascotFinProps {
  message: string;
  isSenior?: boolean;
  countryCode?: string;
}

export const MascotFin: React.FC<MascotFinProps> = ({ message, isSenior, countryCode = '+91' }) => {
  const getCurrencySymbol = (code: string) => {
    if (code === '+91') return '₹';
    if (code === '+1') return '$';
    if (code === '+44') return '£';
    if (['+33', '+49', '+34', '+39', '+31'].includes(code)) return '€';
    return '₹';
  };

  const symbol = getCurrencySymbol(countryCode);

  return (
    <div className={`relative flex items-center space-x-4 mb-10 group animate-in fade-in slide-in-from-left duration-500`}>
      {/* Mr. Shield - The Currency Note Character */}
      <div className="relative flex-shrink-0">
        <div className={`
          ${isSenior ? 'w-36 h-36' : 'w-28 h-28'} 
          relative transition-transform duration-300 group-hover:scale-105
        `}>
          <style>
            {`
              @keyframes float-note {
                0%, 100% { transform: translateY(0px) rotate(2deg); }
                50% { transform: translateY(-12px) rotate(-2deg); }
              }
              .mascot-note-animation {
                animation: float-note 4s ease-in-out infinite;
              }
            `}
          </style>

          <div className="mascot-note-animation w-full h-full relative">
            <svg viewBox="0 0 140 100" className="w-full h-full drop-shadow-2xl overflow-visible">
              {/* Note Base Layer (Greenish Banknote Paper) */}
              <rect x="10" y="20" width="120" height="70" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              
              {/* Guilloche / Intricate Border Pattern */}
              <rect x="14" y="24" width="112" height="62" rx="2" fill="none" stroke="#d1fae5" strokeWidth="4" strokeDasharray="1 2" />
              
              {/* Corner Symbols (Denomination) */}
              <text x="18" y="38" fontSize="10" fontWeight="900" fill="#059669" className="select-none font-sans">{symbol}</text>
              <text x="112" y="38" fontSize="10" fontWeight="900" fill="#059669" className="select-none font-sans">{symbol}</text>
              <text x="18" y="82" fontSize="10" fontWeight="900" fill="#059669" className="select-none font-sans">{symbol}</text>
              <text x="112" y="82" fontSize="10" fontWeight="900" fill="#059669" className="select-none font-sans">{symbol}</text>
              
              {/* Central Medallion (Face Area) */}
              <ellipse cx="70" cy="55" rx="25" ry="30" fill="white" stroke="#10b981" strokeWidth="0.5" />
              
              {/* Serial Number */}
              <text x="90" y="80" fontSize="5" fontWeight="bold" fill="#065f46" className="select-none font-mono opacity-60">SHIELD-2025-001</text>
              
              {/* Watermark effect */}
              <circle cx="25" cy="55" r="8" fill="#f0fdf4" stroke="#d1fae5" strokeWidth="0.5" />

              {/* The Face */}
              <g className="mascot-face">
                <circle cx="63" cy="50" r="3.5" fill="#1e293b" />
                <circle cx="77" cy="50" r="3.5" fill="#1e293b" />
                <path d="M60 68 Q 70 76 80 68" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Cheeks */}
                <circle cx="58" cy="62" r="2" fill="#fecaca" opacity="0.4" />
                <circle cx="82" cy="62" r="2" fill="#fecaca" opacity="0.4" />
              </g>
              
              {/* Arms (Coming from the sides of the note) */}
              <path d="M10 55 Q 0 55 -5 40" stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M130 55 Q 140 55 145 70" stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />
              
              {/* Legs (Coming from the bottom) */}
              <path d="M45 90 Q 45 105 35 110" stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M95 90 Q 95 105 105 110" stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />
              
              {/* Shoes/Hands (Simple Rounded Caps) */}
              <circle cx="-5" cy="40" r="6" fill="white" stroke="#475569" strokeWidth="1" />
              <circle cx="145" cy="70" r="6" fill="white" stroke="#475569" strokeWidth="1" />
              <rect x="25" y="108" width="15" height="8" rx="4" fill="#334155" />
              <rect x="100" y="108" width="15" height="8" rx="4" fill="#334155" />
            </svg>
            
            {/* Soft Shadow underneath the Note */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black/10 blur-lg rounded-[100%]"></div>
          </div>
          
          {/* Active Status Ring */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg z-20"></div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="relative flex-1">
        <div className={`
          bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] rounded-tl-none border border-emerald-50 shadow-2xl 
          relative hover:translate-y-[-2px] transition-all duration-300
        `}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Mr. Shield</span>
            {isSenior && <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">Easy Guide</span>}
          </div>
          <p className={`
            text-slate-800 leading-snug font-bold tracking-tight
            ${isSenior ? 'text-2xl' : 'text-base'}
          `}>
            "{message}"
          </p>
          <div className="absolute -left-3 top-0 w-6 h-6 bg-white border-l border-t border-emerald-50 transform -rotate-45 -translate-y-1/2 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};
