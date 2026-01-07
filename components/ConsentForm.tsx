
import React, { useState } from 'react';
import { Button } from './ui/Button';

interface ConsentFormProps {
  onComplete: () => void;
}

export const ConsentForm: React.FC<ConsentFormProps> = ({ onComplete }) => {
  const [view, setView] = useState<'main' | 'sms_detail'>('main');
  const [permissions, setPermissions] = useState({
    sms: false,
    email: false
  });

  const handleConnect = (type: 'sms' | 'email') => {
    if (type === 'sms' && !permissions.sms) {
      setView('sms_detail');
    } else {
      setPermissions(prev => ({ ...prev, [type]: true }));
    }
  };

  const handleSMSDetailConfirm = () => {
    setPermissions(prev => ({ ...prev, sms: true }));
    setView('main');
  };

  const allConnected = permissions.sms && permissions.email;

  if (view === 'sms_detail') {
    return (
      <div className="fixed inset-0 z-[250] bg-[#f8faff] flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto font-sans animate-in fade-in duration-300">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">What we'll detect from SMS:</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-50 transition-all">
                <div className="w-12 h-12 bg-[#eef4ff] text-2xl flex items-center justify-center rounded-xl">💳</div>
                <div>
                  <p className="font-bold text-slate-900">Transaction alerts</p>
                  <p className="text-sm text-slate-500">Recurring charges from banks and payment apps</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-50 transition-all">
                <div className="w-12 h-12 bg-[#fff7ed] text-2xl flex items-center justify-center rounded-xl">🔔</div>
                <div>
                  <p className="font-bold text-slate-900">Renewal reminders</p>
                  <p className="text-sm text-slate-500">Upcoming subscription renewals</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-50 transition-all">
                <div className="w-12 h-12 bg-[#fff7ed] text-2xl flex items-center justify-center rounded-xl">⚡</div>
                <div>
                  <p className="font-bold text-slate-900">Trial endings</p>
                  <p className="text-sm text-slate-500">Free trials converting to paid</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-slate-700 font-bold">
              <span className="text-xl">🛡️</span>
              <p>Your privacy matters</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li>• We only read financial transaction messages</li>
              <li>• Personal messages are never accessed</li>
              <li>• All data is encrypted and stays on your device</li>
              <li>• You can revoke access anytime</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-indigo-900 font-bold text-sm">Example SMS we'll read:</h3>
            <div className="bg-white p-6 rounded-2xl border border-indigo-50 font-mono text-xs leading-relaxed text-slate-600 shadow-sm">
              <p className="text-slate-400 mb-1">HDFC Bank</p>
              <p>Your A/c XX1234 debited with Rs.649.00 for Netflix Premium on 20-Dec-25. Avl bal: Rs.12,345.67</p>
            </div>
          </div>

          <button 
            onClick={handleSMSDetailConfirm} 
            className="w-full rounded-2xl py-4 bg-slate-950 text-white font-bold text-base shadow-xl hover:bg-slate-900 active:scale-[0.98] transition-all"
          >
            Allow SMS Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-[#f8faff] flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2 mb-4">
          <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-lg mx-auto">
            We need access to detect your subscriptions automatically. All data is encrypted and never shared.
          </p>
        </div>

        <div className="space-y-4">
          <ConsentItem 
            icon="💬" 
            title="SMS Access" 
            desc="Read transaction & renewal messages" 
            connected={permissions.sms}
            onConnect={() => handleConnect('sms')}
            showPreview
          />
          <ConsentItem 
            icon="✉️" 
            title="Email Access" 
            desc="Scan receipts & subscription confirmations" 
            connected={permissions.email}
            onConnect={() => handleConnect('email')}
          />
        </div>

        <div className="bg-[#eff6ff] border border-[#dbeafe] p-8 rounded-[2.5rem] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <h4 className="flex items-center text-[#1e40af] font-bold text-base relative z-10">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#60a5fa] mr-3"></span>
            Why we need this
          </h4>
          <p className="text-[#1d4ed8] text-sm leading-relaxed font-medium relative z-10">
            We analyze your transactions, messages, and emails to automatically detect recurring payments, trials ending soon, and price changes. We never access your passwords or make any changes without your permission.
          </p>
        </div>

        {allConnected && (
          <button 
            onClick={onComplete} 
            className="w-full rounded-2xl py-5 bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 animate-in zoom-in-95 hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Proceed to Dashboard →
          </button>
        )}
      </div>
    </div>
  );
};

const ConsentItem: React.FC<{ 
  icon: string, 
  title: string, 
  desc: string, 
  connected: boolean, 
  onConnect: () => void,
  showPreview?: boolean 
}> = ({ icon, title, desc, connected, onConnect, showPreview }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-50 transition-all hover:shadow-md hover:border-slate-100">
    <div className="flex items-center space-x-5">
      <div className="w-14 h-14 bg-[#eef4ff] text-2xl flex items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-105">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-lg leading-tight">{title}</h4>
        <p className="text-sm text-slate-500 font-medium mt-1">{desc}</p>
      </div>
    </div>
    <div className="flex flex-col items-center ml-4">
      <button 
        disabled={connected}
        onClick={onConnect}
        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm min-w-[100px] ${
          connected 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-slate-950 text-white hover:bg-slate-900 active:scale-[0.95]'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
      {showPreview && !connected && (
        <span className="mt-1.5 bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tight">Preview</span>
      )}
    </div>
  </div>
);
