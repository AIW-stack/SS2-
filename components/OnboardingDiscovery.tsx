
import React, { useState, useEffect } from 'react';
import { MascotFin } from './MascotFin';
import { Button } from './ui/Button';
import { PaymentIntegration, Subscription } from '../types';

interface OnboardingDiscoveryProps {
  mobileNumber: string;
  countryCode: string;
  onComplete: (sources?: PaymentIntegration[], subs?: Subscription[]) => void;
  onManual: () => void;
}

const DISCOVERY_STEPS = [
  { message: "Scanning SMS for transaction patterns...", delay: 1000 },
  { message: "Connecting to Account Aggregator framework...", delay: 1200 },
  { message: "Analyzing active UPI mandates...", delay: 1000 },
  { message: "Cross-referencing App Store receipts...", delay: 1000 },
];

const CATEGORIES = ['OTT', 'Food', 'Gaming', 'Fitness', 'Utilities', 'Cloud', 'Other'];
const FREQUENCIES = ['Monthly', 'Yearly', 'Quarterly'];

type OnboardingPhase = 
  | 'sub_choice' 
  | 'sub_scanning' 
  | 'sub_manual' 
  | 'sub_results' 
  | 'pay_choice' 
  | 'pay_scanning' 
  | 'pay_manual' 
  | 'pay_results';

export const OnboardingDiscovery: React.FC<OnboardingDiscoveryProps> = ({ mobileNumber, countryCode, onComplete }) => {
  const [phase, setPhase] = useState<OnboardingPhase>('sub_choice');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data States
  const [manualSubs, setManualSubs] = useState<Subscription[]>([]);
  const [manualSources, setManualSources] = useState<PaymentIntegration[]>([]);
  const [discoveredSources, setDiscoveredSources] = useState<PaymentIntegration[]>([]);
  
  // Input Forms
  const [newSub, setNewSub] = useState<Partial<Subscription>>({ name: '', amount: 0, frequency: 'Monthly', category: 'OTT' });
  const [newSource, setNewSource] = useState<{ type: 'UPI' | 'Card'; name: string }>({ type: 'UPI', name: '' });

  // Auto-scanning logic
  useEffect(() => {
    if (phase !== 'sub_scanning' && phase !== 'pay_scanning') return;

    let stepIndex = 0;
    const runSteps = async () => {
      for (const step of DISCOVERY_STEPS) {
        setCurrentStep(stepIndex);
        await new Promise(resolve => setTimeout(resolve, step.delay));
        stepIndex++;
        setProgress((stepIndex / DISCOVERY_STEPS.length) * 100);
      }
      
      if (phase === 'sub_scanning') {
        setPhase('sub_results');
      } else {
        const sources: PaymentIntegration[] = [
          { id: 'i1', name: 'PhonePe', type: 'UPI', provider: 'NPCI', status: 'Detected', icon: '🟣', count: 4 },
          { id: 'i2', name: 'Google Pay', type: 'UPI', provider: 'NPCI', status: 'Detected', icon: '🟢', count: 2 },
          { id: 'i3', name: 'HDFC Bank Card', type: 'Card', provider: 'Visa', status: 'Detected', icon: '💳', count: 3 },
        ];
        setDiscoveredSources(sources);
        setPhase('pay_results');
      }
    };

    runSteps();
  }, [phase]);

  // Handlers
  const addManualSub = () => {
    if (!newSub.name || !newSub.amount) return;
    const sub: Subscription = {
      ...newSub,
      id: `manual-sub-${Date.now()}`,
      currency: countryCode === '+91' ? '₹' : '$',
      status: 'Active',
      usageLevel: 'Medium',
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentMethod: 'UPI Autopay',
      icon: '✨'
    } as Subscription;
    setManualSubs([...manualSubs, sub]);
    setNewSub({ name: '', amount: 0, frequency: 'Monthly', category: 'OTT' });
  };

  const addManualSource = () => {
    if (!newSource.name) return;
    const source: PaymentIntegration = {
      id: `manual-src-${Date.now()}`,
      name: newSource.name,
      type: newSource.type,
      provider: 'Manual',
      status: 'Linked',
      icon: newSource.type === 'UPI' ? '🟣' : '💳',
      count: 0
    };
    setManualSources([...manualSources, source]);
    setNewSource({ type: 'UPI', name: '' });
  };

  const finishPhase1 = () => setPhase('pay_choice');
  const finishPhase2 = () => onComplete(discoveredSources.length > 0 ? discoveredSources : manualSources, manualSubs);

  // UI Components
  if (phase === 'sub_choice') {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <MascotFin countryCode={countryCode} message="Welcome! Let's start by finding your subscriptions. How would you like to add them?" />
          <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Add Subscriptions</h2>
            <div className="flex flex-col space-y-4">
              <Button onClick={() => { setPhase('sub_scanning'); setProgress(0); }} fullWidth size="lg" className="rounded-2xl py-5 font-black bg-indigo-600 shadow-xl shadow-indigo-100">I Accept — Auto Scan All</Button>
              <Button onClick={() => setPhase('sub_manual')} variant="secondary" fullWidth size="lg" className="rounded-2xl py-5 font-black text-slate-400 border-slate-200">I Deny — Add Manually</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'sub_manual') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#f9fafb] flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">📝</div>
            <h2 className="text-4xl font-black text-slate-900">Manual Entry</h2>
            <p className="text-slate-500 font-bold mt-2">Enter your subscriptions one by one</p>
          </div>
          <div className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
            <input type="text" placeholder="Service Name (Netflix, Gym...)" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-black text-sm outline-none" />
            <input type="number" placeholder="Amount" value={newSub.amount || ''} onChange={e => setNewSub({...newSub, amount: parseFloat(e.target.value)})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-black text-sm outline-none" />
            <Button onClick={addManualSub} fullWidth className="rounded-2xl py-4 bg-slate-900 text-white font-black" disabled={!newSub.name || !newSub.amount}>Add To Stack +</Button>
          </div>
          {manualSubs.length > 0 && (
             <div className="mb-8 max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
               {manualSubs.map(s => (
                 <div key={s.id} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                   <span className="font-black text-slate-900">{s.name}</span>
                   <span className="font-bold text-indigo-600">₹{s.amount}</span>
                 </div>
               ))}
             </div>
          )}
          <Button onClick={finishPhase1} fullWidth size="lg" className="rounded-[2rem] py-5 font-black bg-indigo-600 shadow-xl">Next: Setup Payments →</Button>
        </div>
      </div>
    );
  }

  if (phase === 'sub_results' || phase === 'sub_scanning') {
     return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8">
           <div className="w-full max-w-lg space-y-12">
              <MascotFin countryCode={countryCode} message={phase === 'sub_scanning' ? DISCOVERY_STEPS[currentStep]?.message : "Scan complete! Found your recurring patterns."} />
              <div className="space-y-4">
                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                 </div>
                 {phase === 'sub_results' && (
                    <Button onClick={finishPhase1} fullWidth size="lg" className="rounded-[2rem] py-5 font-black bg-indigo-600 shadow-xl">Next: Setup Payments →</Button>
                 )}
              </div>
           </div>
        </div>
     );
  }

  if (phase === 'pay_choice') {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <MascotFin countryCode={countryCode} message="Great! Now let's link your payment sources to track renewals automatically." />
          <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Setup Payments</h2>
            <div className="flex flex-col space-y-4">
              <Button onClick={() => { setPhase('pay_scanning'); setProgress(0); }} fullWidth size="lg" className="rounded-2xl py-5 font-black bg-indigo-600 shadow-xl shadow-indigo-100">I Accept — Auto Scan Sources</Button>
              <Button onClick={() => setPhase('pay_manual')} variant="secondary" fullWidth size="lg" className="rounded-2xl py-5 font-black text-slate-400 border-slate-200">I Deny — Add Manually</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'pay_manual') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#f9fafb] flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 mb-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">💳</div>
            <h2 className="text-4xl font-black text-slate-900">Payment Sources</h2>
            <p className="text-slate-500 font-bold mt-2">Add your UPI Apps or Cards</p>
          </div>
          <div className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
            <div className="flex space-x-2 p-1 bg-white rounded-xl">
               <button onClick={() => setNewSource({...newSource, type: 'UPI'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${newSource.type === 'UPI' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>UPI</button>
               <button onClick={() => setNewSource({...newSource, type: 'Card'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${newSource.type === 'Card' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Card</button>
            </div>
            <input type="text" placeholder="App Name (GPay, PhonePe...)" value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-black text-sm outline-none" />
            <Button onClick={addManualSource} fullWidth className="rounded-2xl py-4 bg-slate-900 text-white font-black" disabled={!newSource.name}>Link Source +</Button>
          </div>
          {manualSources.length > 0 && (
             <div className="mb-8 max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
               {manualSources.map(s => (
                 <div key={s.id} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                   <span className="font-black text-slate-900">{s.icon} {s.name}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase">{s.type}</span>
                 </div>
               ))}
             </div>
          )}
          <Button onClick={finishPhase2} fullWidth size="lg" className="rounded-[2rem] py-5 font-black bg-indigo-600 shadow-xl">Complete Setup →</Button>
        </div>
      </div>
    );
  }

  if (phase === 'pay_results' || phase === 'pay_scanning') {
     return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8">
           <div className="w-full max-w-lg space-y-12">
              <MascotFin countryCode={countryCode} message={phase === 'pay_scanning' ? "Scanning for mandates & card statements..." : "Discovery complete! We found your payment hooks."} />
              <div className="space-y-4">
                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                 </div>
                 {phase === 'pay_results' && (
                    <Button onClick={finishPhase2} fullWidth size="lg" className="rounded-[2rem] py-5 font-black bg-indigo-600 shadow-xl">Complete Setup →</Button>
                 )}
              </div>
           </div>
        </div>
     );
  }

  return null;
};

const DiscoveryBadge: React.FC<{ label: string; active: boolean; done: boolean }> = ({ label, active, done }) => (
  <div className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all duration-300 ${done ? 'bg-emerald-50 border-emerald-100' : active ? 'bg-indigo-50 border-indigo-200 shadow-lg' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
    <div className={`w-2 h-2 rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-indigo-600 animate-ping' : 'bg-slate-300'}`} />
    <span className={`text-[9px] font-black uppercase tracking-wider ${done ? 'text-emerald-700' : active ? 'text-indigo-900' : 'text-slate-400'}`}>{label}</span>
    {done && <span className="text-emerald-500 text-xs ml-auto">✓</span>}
  </div>
);
