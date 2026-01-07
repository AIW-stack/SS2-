
import React from 'react';
import { Advertisement } from '../types';
import { Button } from './ui/Button';

interface WinbackSectionProps {
  ads: Advertisement[];
  onClaim: (ad: Advertisement) => void;
  onDismiss: (id: string) => void;
}

export const WinbackSection: React.FC<WinbackSectionProps> = ({ ads, onClaim, onDismiss }) => {
  if (ads.length === 0) return null;

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-900 flex items-center text-lg">
          <span className="mr-2 text-rose-500">💝</span> Miss These Services?
        </h3>
        <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-50 px-3 py-1 rounded-full tracking-wider">
          Exclusive Win-back Deals
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className="group relative bg-white p-5 rounded-[2rem] border border-rose-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-125 transition-transform"></div>
            
            <div className="flex items-center space-x-5 relative z-10">
              <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform shadow-inner">
                {ad.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg leading-tight">{ad.brand}</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 max-w-[180px] md:max-w-xs">{ad.offer}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 relative z-10">
              <button 
                onClick={() => onDismiss(ad.id)}
                className="text-[10px] font-black text-slate-300 uppercase hover:text-slate-400 transition-colors px-4"
              >
                Dismiss
              </button>
              <Button 
                onClick={() => onClaim(ad)}
                variant="danger" 
                size="sm" 
                className="rounded-2xl px-6 py-3 whitespace-nowrap font-black tracking-tight shadow-rose-200"
              >
                {ad.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
