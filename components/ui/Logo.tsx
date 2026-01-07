
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  countryCode?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', countryCode = '+91' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  const getCurrencySymbol = (code: string) => {
    if (code === '+91') return '₹';
    if (code === '+1') return '$';
    if (code === '+44') return '£';
    if (['+33', '+49', '+34', '+39', '+31'].includes(code)) return '€';
    return '₹';
  };

  const symbol = getCurrencySymbol(countryCode);

  return (
    <div className={`
      ${sizeClasses[size]} 
      relative flex items-center justify-center 
      transition-transform duration-300 hover:scale-110 active:scale-95
      ${className}
    `}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-20 scale-150"></div>

      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="coinEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <filter id="shine" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Bottom Coin (Shadow/Base) */}
        <ellipse cx="50" cy="75" rx="35" ry="12" fill="#78350f" opacity="0.2" />

        {/* Stacked Coins */}
        {/* Coin 3 (Bottom-most) */}
        <path d="M15 65 Q 15 55 50 55 Q 85 55 85 65 L 85 75 Q 85 85 50 85 Q 15 85 15 75 Z" fill="url(#coinEdge)" />
        <ellipse cx="50" cy="65" rx="35" ry="12" fill="url(#goldGradient)" stroke="#92400e" strokeWidth="0.5" />

        {/* Coin 2 (Middle) */}
        <path d="M15 50 Q 15 40 50 40 Q 85 40 85 50 L 85 60 Q 85 70 50 70 Q 15 70 15 60 Z" fill="url(#coinEdge)" />
        <ellipse cx="50" cy="50" rx="35" ry="12" fill="url(#goldGradient)" stroke="#92400e" strokeWidth="0.5" />

        {/* Coin 1 (Top) */}
        <path d="M15 35 Q 15 25 50 25 Q 85 25 85 35 L 85 45 Q 85 55 50 55 Q 15 55 15 45 Z" fill="url(#coinEdge)" />
        <ellipse cx="50" cy="35" rx="35" ry="12" fill="url(#goldGradient)" stroke="#92400e" strokeWidth="1" />
        
        {/* Top Coin Detail - Inner Ring */}
        <ellipse cx="50" cy="35" rx="28" ry="9" fill="none" stroke="#fef3c7" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />

        {/* Currency Symbol on Top Coin */}
        <text 
          x="50" 
          y="38" 
          fontSize="24" 
          fontWeight="900" 
          fill="#78350f" 
          textAnchor="middle" 
          className="select-none font-sans"
          style={{ filter: 'drop-shadow(0px 1px 1px rgba(255,255,255,0.4))' }}
        >
          {symbol}
        </text>

        {/* Sparkles */}
        <g className="animate-pulse">
          <path d="M80 15 L 82 20 L 87 22 L 82 24 L 80 29 L 78 24 L 73 22 L 78 20 Z" fill="white" opacity="0.8" />
          <path d="M20 20 L 21 23 L 24 24 L 21 25 L 20 28 L 19 25 L 16 24 L 19 23 Z" fill="white" opacity="0.6" />
        </g>
      </svg>
      
      {/* Small floating indicator for 'Premium' feel if it's the large version */}
      {size === 'xl' && (
        <div className="absolute -top-2 -right-2 bg-white px-2 py-0.5 rounded-full shadow-lg border border-amber-100 flex items-center space-x-1">
          <span className="text-[8px] font-black text-amber-600 tracking-widest uppercase">Shielded</span>
        </div>
      )}
    </div>
  );
};
