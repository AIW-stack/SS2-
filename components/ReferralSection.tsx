
import React, { useState } from 'react';
import { Contact, UserPersona } from '../types';
import { MOCK_CONTACTS } from '../constants';
import { Button } from './ui/Button';

interface ReferralSectionProps {
  credits: number;
  persona: UserPersona;
  onReferralSuccess: (creditsGained: number) => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ credits, persona, onReferralSuccess }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [isRequesting, setIsRequesting] = useState(false);
  const isSenior = persona === 'Senior';

  const requestContactPermission = async () => {
    setIsRequesting(true);
    // Simulate system permission dialog delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasPermission(true);
    setIsRequesting(false);
  };

  const handleRefer = (phone: string) => {
    setContacts(prev => prev.map(c => c.phone === phone ? { ...c, referred: true } : c));
    // Simulate an "active referral" - in real app would wait for they to sign up
    // For demo, we grant credits immediately
    onReferralSuccess(10);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Credit Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className={`font-black tracking-tight mb-2 ${isSenior ? 'text-4xl' : 'text-3xl'}`}>Refer & Earn Credits</h3>
            <p className="text-indigo-100 font-medium max-w-sm">Help your friends stop money leaks and get rewarded for every active signup!</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 text-center min-w-[200px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-200">Total Credits</p>
            <h2 className="text-6xl font-black">{credits}</h2>
            <p className="text-[10px] font-black uppercase mt-2 text-emerald-300">₹{credits} Value</p>
          </div>
        </div>
      </div>

      {!hasPermission ? (
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm text-center space-y-8">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner">
            👥
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Sync Your Contacts</h4>
            <p className="text-slate-500 font-medium">Allow SpendShield to access your contact list to easily refer friends and family members. You'll get 10 credits for every active referral.</p>
          </div>
          <Button 
            onClick={requestContactPermission}
            disabled={isRequesting}
            className="rounded-2xl px-12 py-5 font-black bg-indigo-600 shadow-xl shadow-indigo-100"
          >
            {isRequesting ? 'Requesting Permission...' : 'Grant Access to Contacts'}
          </Button>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            🛡️ Your contacts are encrypted & never stored on our servers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className={`font-black text-slate-900 ${isSenior ? 'text-3xl' : 'text-xl'}`}>Suggested Contacts</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">Earn 10 Credits / Friend</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div 
                key={contact.phone} 
                className={`
                  bg-white p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center text-center space-y-4
                  ${contact.referred ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 hover:shadow-xl hover:border-indigo-100'}
                `}
              >
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black
                  ${contact.referred ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}
                `}>
                  {contact.referred ? '✓' : contact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg leading-tight">{contact.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{contact.phone}</p>
                </div>
                {contact.referred ? (
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">Referral Sent</span>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleRefer(contact.phone)}
                    className="rounded-full px-8 font-black text-[10px] uppercase tracking-widest"
                  >
                    Refer Now
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-sm">Don't see your friend? Use their phone number directly.</p>
            <div className="mt-4 flex max-w-sm mx-auto">
              <input 
                type="tel" 
                placeholder="Enter Phone Number" 
                className="flex-1 px-4 py-3 rounded-l-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-r-2xl font-black text-[10px] uppercase tracking-widest">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
