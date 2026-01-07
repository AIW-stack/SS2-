
import React, { useState } from 'react';
import { PaymentIntegration, WalletData, UserPersona } from '../types';
import { Button } from './ui/Button';

interface PaymentSourcesProps {
  sources: PaymentIntegration[];
  wallet: WalletData;
  persona: UserPersona;
  onLinkNew: (type: string) => void;
}

export const PaymentSources: React.FC<PaymentSourcesProps> = ({ sources, wallet, persona, onLinkNew }) => {
  const isSenior = persona === 'Senior';
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const upiSources = sources.filter(s => s.type === 'UPI');
  const cardSources = sources.filter(s => s.type === 'Card');
  const bankSources = sources.filter(s => s.type === 'Bank');

  const manualOptions = [
    { id: 'upi', name: 'UPI', icon: '🟣', desc: 'Link GPay, PhonePe, or BHIM' },
    { id: 'credit', name: 'Credit Card', icon: '💳', desc: 'Add Visa, Master, or Amex' },
    { id: 'debit', name: 'Debit Card', icon: '🏦', desc: 'Connect Bank Debit Cards' },
    { id: 'wallet', name: 'Shield Wallet', icon: '🛡️', desc: 'Setup your secure Vault' },
  ];

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500">
      {/* Mr. Shield's Global Vault (Wallet) */}
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-600 rounded-[3.5rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="relative bg-slate-950 rounded-[3.5rem] p-8 md:p-12 text-white overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full -mr-40 -mt-40"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 space-y-8 md:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Shield Primary</span>
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  {wallet.status}
                </span>
              </div>
              <h3 className={`font-black tracking-tight ${isSenior ? 'text-4xl' : 'text-3xl'}`}>Shield Global Wallet</h3>
              <p className="text-slate-400 text-sm mt-1 font-medium">Vault ID: {wallet.vaultId}</p>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total Limit Protected</p>
              <h2 className={`font-black ${isSenior ? 'text-5xl' : 'text-5xl'}`}>{wallet.currency}{wallet.balance.toLocaleString('en-IN')}</h2>
              <button className="mt-4 text-[10px] font-black text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all uppercase tracking-widest">
                Configure Vault Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Add Options - Explicitly requested section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
          <h4 className={`font-black text-slate-900 ${isSenior ? 'text-3xl' : 'text-xl'}`}>Manual Setup Options</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {manualOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onLinkNew(opt.name)}
              className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-3 hover:shadow-xl hover:border-indigo-100 transition-all active:scale-95"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <div>
                <p className="font-black text-slate-900 text-lg leading-tight">{opt.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100 mx-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* UPI Apps Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className={`font-black text-slate-900 ${isSenior ? 'text-3xl' : 'text-xl'}`}>Linked UPI</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase">{upiSources.length} Linked</span>
          </div>
          <div className="space-y-4">
            {upiSources.length > 0 ? upiSources.map(s => <PaymentSourceRow key={s.id} source={s} isSenior={isSenior} />) : <EmptyState type="UPI App" />}
          </div>
        </div>

        {/* Cards Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className={`font-black text-slate-900 ${isSenior ? 'text-3xl' : 'text-xl'}`}>Active Cards</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase">{cardSources.length} Linked</span>
          </div>
          <div className="space-y-4">
            {cardSources.length > 0 ? cardSources.map(s => <PaymentSourceRow key={s.id} source={s} isSenior={isSenior} />) : <EmptyState type="Card" />}
          </div>
        </div>
      </div>

      {/* Connected Banks Display */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h4 className={`font-black text-slate-900 ${isSenior ? 'text-3xl' : 'text-xl'}`}>Connected Banks</h4>
          <span className="text-[10px] font-black text-slate-400 uppercase">{bankSources.length} Linked</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bankSources.length > 0 ? bankSources.map(s => <BankSourceCard key={s.id} source={s} isSenior={isSenior} />) : <EmptyState type="Bank" />}
        </div>
      </div>
      
      {/* Security Footer */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center space-x-6">
        <div className="text-3xl">🛡️</div>
        <div className="flex-1">
          <p className="text-xs font-black text-slate-900">End-to-End Vault Encryption</p>
          <p className="text-[10px] text-slate-500 font-medium">All manually added sources are protected by Mr. Shield's multi-sig security protocols. Your raw data never leaves this device.</p>
        </div>
      </div>
    </div>
  );
};

const PaymentSourceRow: React.FC<{ source: PaymentIntegration, isSenior: boolean }> = ({ source, isSenior }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-indigo-600">
    <div className="flex items-center space-x-5">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
        {source.icon}
      </div>
      <div>
        <h5 className={`font-black text-slate-900 ${isSenior ? 'text-2xl' : 'text-lg'}`}>{source.name}</h5>
        <div className="flex items-center space-x-3 mt-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{source.provider}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <span className={`text-[8px] font-black uppercase tracking-wider ${source.status === 'Linked' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {source.status}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="font-black text-slate-900 text-xl">{source.count}</p>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mandates</p>
    </div>
  </div>
);

const BankSourceCard: React.FC<{ source: PaymentIntegration, isSenior: boolean }> = ({ source, isSenior }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-4 group hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
      {source.icon}
    </div>
    <div>
      <h5 className={`font-black text-slate-900 ${isSenior ? 'text-xl' : 'text-base'}`}>{source.name}</h5>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Linked via AA</p>
    </div>
    <Button variant="ghost" size="sm" className="font-black text-[9px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-6 rounded-full">View Vault</Button>
  </div>
);

const EmptyState: React.FC<{ type: string }> = ({ type }) => (
  <div className="py-12 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
    <div className="text-2xl mb-2 opacity-20">☁️</div>
    <p className="text-slate-400 font-bold text-sm tracking-tight">No {type} sources linked.</p>
    <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Tap an option above to link manually</p>
  </div>
);
