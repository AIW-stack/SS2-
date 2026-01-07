
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

interface LoginProps {
  onLogin: (mobile: string, isNewUser: boolean, countryCode: string) => void;
}

type LoginStep = 'choice' | 'mobile' | 'otp';

const COUNTRY_CODES = [
  { code: '+91', label: 'India', flag: '🇮🇳' },
  { code: '+1', label: 'USA', flag: '🇺🇸' },
  { code: '+44', label: 'UK', flag: '🇬🇧' },
  { code: '+49', label: 'Germany', flag: '🇩🇪' },
  { code: '+33', label: 'France', flag: '🇫🇷' },
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('choice');
  const [userType, setUserType] = useState<'new' | 'existing' | null>(null);
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');

  const handleChoice = (type: 'new' | 'existing') => {
    setUserType(type);
    setStep('mobile');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'mobile') {
      if (mobile.length >= 8) setStep('otp');
    } else if (step === 'otp') {
      if (otp.length === 4) {
        onLogin(mobile, userType === 'new', countryCode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 transition-all duration-500">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center animate-in fade-in zoom-in duration-700">
          <div className="mx-auto flex justify-center mb-8">
            <Logo size="xl" countryCode={countryCode} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">SpendShield</h1>
          <p className="text-slate-500 mt-2 font-bold italic tracking-wide">Know. Control. Save.</p>
        </div>

        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          {step === 'choice' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-xl font-black text-slate-900">Get Started</h2>
                <p className="text-xs text-slate-500 font-medium">Choose how you'd like to continue</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleChoice('new')}
                  className="group flex items-center p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-emerald-600 hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">✨</div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900 text-lg">I'm New Here</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">First time registration</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-600 transition-colors">→</span>
                </button>

                <button
                  onClick={() => handleChoice('existing')}
                  className="group flex items-center p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-emerald-600 hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">👋</div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900 text-lg">Welcome Back</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Existing User Login</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-600 transition-colors">→</span>
                </button>
              </div>
            </div>
          )}

          {step !== 'choice' && (
            <form onSubmit={handleNext} className="space-y-6">
              {step === 'mobile' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center space-x-2 mb-4">
                    <button type="button" onClick={() => setStep('choice')} className="text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest">← Back</button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                    <div className="flex group">
                      <select 
                        className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-200 bg-white text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                      </select>
                      <input
                        type="tel"
                        maxLength={12}
                        autoFocus
                        className="flex-1 block w-full px-4 py-4 rounded-none rounded-r-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-xl tracking-wider"
                        placeholder="Phone number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" fullWidth size="lg" className="rounded-2xl py-5 shadow-emerald-100 shadow-xl" disabled={mobile.length < 8}>
                    Send OTP
                  </Button>
                </div>
              )}

              {step === 'otp' && (
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center space-x-2 mb-4 text-left">
                    <button type="button" onClick={() => setStep('mobile')} className="text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest">← Change Number</button>
                  </div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Verify OTP sent to {countryCode} {mobile}</label>
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    className="block w-full px-4 py-5 text-center text-4xl tracking-[1.2em] rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-black text-emerald-600"
                    placeholder="0000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RESEND IN 00:24</div>
                  <Button type="submit" fullWidth size="lg" className="rounded-2xl py-5 shadow-emerald-100 shadow-xl" disabled={otp.length !== 4}>
                    {userType === 'new' ? 'Continue' : 'Log In Now'}
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4 px-8 pt-4">
           <div className="flex items-center space-x-3 grayscale opacity-40">
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Trusted By</span>
             <div className="font-black text-slate-900 text-[10px] border px-2 py-0.5 rounded-lg bg-slate-50">SHIELD-SEC</div>
             <div className="font-black text-slate-900 text-[10px] border px-2 py-0.5 rounded-lg bg-slate-50">RBI-AA</div>
           </div>
           <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] leading-relaxed">
            Safe. Secure. Privacy First.<br/>Personal Finance Excellence.
          </p>
        </div>
      </div>
    </div>
  );
};
