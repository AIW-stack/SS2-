
import React from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

interface FreemiumOfferProps {
  onClaim: () => void;
}

export const FreemiumOffer: React.FC<FreemiumOfferProps> = ({ onClaim }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto font-sans">
      <div className="w-full max-w-xl space-y-10 animate-in fade-in zoom-in-95 duration-700 text-center">
        
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-20 scale-150 animate-pulse"></div>
          <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner relative z-10 mx-auto">
            🛡️
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Setup Complete!</h2>
          <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">
            You have successfully entered our <span className="text-indigo-600">90-day Freemium period</span>. Enjoy full Pro protection.
          </p>
        </div>

        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm text-left space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Freemium Benefits Active</h4>
          
          <div className="space-y-4">
            <FeatureRow icon="🤖" title="AI Savings Lab" desc="Automated leak detection & monthly optimizations" />
            <FeatureRow icon="🧭" title="Market Explorer Pro" desc="Real-time price hiking alerts & smarter alternatives" />
            <FeatureRow icon="💳" title="Vault Priority" desc="Multi-sig encryption for all your recurring mandates" />
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onClaim} 
            fullWidth 
            size="lg" 
            className="rounded-[2rem] py-6 font-black bg-indigo-600 text-white shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
          >
            ENTER THE DASHBOARD
          </Button>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Automatic access. Reverts to basic plan after 90 days.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-4">
          <Logo size="sm" />
          <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">Verified Shield Protection</span>
        </div>
      </div>
    </div>
  );
};

const FeatureRow: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start space-x-4">
    <div className="text-2xl mt-1">{icon}</div>
    <div>
      <p className="font-black text-slate-900 leading-none">{title}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{desc}</p>
    </div>
  </div>
);
