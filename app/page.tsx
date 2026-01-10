
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserPersona, Subscription, Recommendation, Advertisement, ExploreInsight, PaymentIntegration, WalletData } from '../types';
import { MOCK_SUBSCRIPTIONS, MOCK_ADS, MOCK_WINBACK_ADS, MOCK_PAYMENT_SOURCES, MOCK_WALLET } from '../constants';
import { Dashboard } from '../components/Dashboard';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { getSmartRecommendations, getExploreInsights } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { Login } from '../components/Login';
import { MascotFin } from '../components/MascotFin';
import { WinbackSection } from '../components/WinbackSection';
import { MonthlyExpenses } from '../components/MonthlyExpenses';
import { OnboardingDiscovery } from '../components/OnboardingDiscovery';
import { Logo } from '../components/ui/Logo';
import { ExploreSection } from '../components/ExploreSection';
import { PaymentSources } from '../components/PaymentSources';
import { ReferralSection } from '../components/ReferralSection';
import { PersonaQuestionnaire } from '../components/PersonaQuestionnaire';
import { ConsentForm } from '../components/ConsentForm';
import { FreemiumOffer } from '../components/FreemiumOffer';

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'consent' | 'discovery' | 'persona' | 'freemium-offer'>('consent');
  const [isNewUser, setIsNewUser] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [currency, setCurrency] = useState('₹');
  const [isPremium, setIsPremium] = useState(false);
  const [persona, setPersona] = useState<UserPersona>('Riser');
  const [activeTab, setActiveTab] = useState<'home' | 'subscriptions' | 'payments' | 'refer'>('home');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [paymentSources, setPaymentSources] = useState<PaymentIntegration[]>(MOCK_PAYMENT_SOURCES);
  const [wallet, setWallet] = useState<WalletData>(MOCK_WALLET);
  const [winbackAds, setWinbackAds] = useState<Advertisement[]>(MOCK_WINBACK_ADS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [exploreInsights, setExploreInsights] = useState<ExploreInsight[]>([]);
  const [referralDays, setReferralDays] = useState(0);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [exploreSources, setExploreSources] = useState<{ title: string; uri: string }[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getGreeting = (code: string) => {
    switch (code) {
      case '+91': return 'Namaste';
      case '+1': return 'Hello';
      case '+44': return 'Cheers';
      default: return 'Hello';
    }
  };

  const regionalGreeting = getGreeting(countryCode);

  const determineCurrency = (code: string) => {
    if (code === '+91') return '₹';
    if (code === '+1') return '$';
    if (code === '+44') return '£';
    return '₹';
  };

  const totalMonthlySpend = subscriptions
    .filter(s => s.status !== 'Paused')
    .filter(s => s.frequency === 'Monthly')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true);
    try {
      const result = await getSmartRecommendations(subscriptions, persona);
      setRecommendations(result.recommendations);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  }, [subscriptions, persona]);

  const fetchExplore = useCallback(async () => {
    setLoadingExplore(true);
    try {
      const result = await getExploreInsights(subscriptions);
      setExploreInsights(result.insights);
      setExploreSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplore(false);
    }
  }, [subscriptions]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchInsights();
      fetchExplore();
    }
  }, [isLoggedIn, persona, fetchInsights, fetchExplore]);

  const togglePersona = (p: UserPersona) => {
    setPersona(p);
    setIsSidebarOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: Subscription['status']) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleLoginSuccess = (mobile: string, isNew: boolean, code: string) => {
    setUserMobile(mobile);
    setIsNewUser(isNew);
    setCountryCode(code);
    setCurrency(determineCurrency(code));
    if (isNew) {
      setIsRegistering(true);
      setOnboardingStep('consent');
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleConsentComplete = () => {
    setOnboardingStep('discovery');
  };

  const handleOnboardingNext = (data?: { subs?: Subscription[], sources?: PaymentIntegration[] }) => {
    if (data?.subs) setSubscriptions(prev => [...data.subs!, ...prev]);
    if (data?.sources) setPaymentSources(data.sources);
    setOnboardingStep('persona');
  };

  const handlePersonaSelect = (p: UserPersona) => {
    setPersona(p);
    setOnboardingStep('freemium-offer');
  };

  const handleClaimFreemium = () => {
    setIsPremium(true);
    setIsRegistering(false);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLinkNewSource = (type: string) => {
    alert(`Initiating manual linking flow for ${type}...`);
  };

  const handleReferralSuccess = (daysGained: number) => {
    setReferralDays(prev => prev + daysGained);
  };

  const handleExploreAction = (insight: ExploreInsight) => {
    if (insight.actionType === 'None') return;
    if (insight.actionType === 'Subscribe') {
      const alreadySubbed = subscriptions.some(s => s.name.toLowerCase() === insight.targetService.toLowerCase());
      if (alreadySubbed) return;

      const newSub: Subscription = {
        id: `exp-${Date.now()}`,
        name: insight.targetService,
        amount: 299,
        currency: currency,
        frequency: 'Monthly',
        category: 'Other',
        nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'UPI Autopay',
        status: 'Active',
        usageLevel: 'Medium',
        usageMinutes: 0,
        icon: insight.icon || '✨'
      };
      setSubscriptions(prev => [newSub, ...prev]);
      setActiveTab('subscriptions');
    }
  };

  const isSenior = persona === 'Senior';

  if (!isLoggedIn && !isRegistering) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (isRegistering) {
    if (onboardingStep === 'consent') {
      return <ConsentForm onComplete={handleConsentComplete} />;
    }
    if (onboardingStep === 'discovery') {
      return (
        <OnboardingDiscovery 
          mobileNumber={userMobile} 
          countryCode={countryCode} 
          onComplete={(sources, subs) => handleOnboardingNext({ sources, subs })} 
          onManual={() => handleOnboardingNext()} 
        />
      );
    }
    if (onboardingStep === 'persona') {
      return <PersonaQuestionnaire onSelect={handlePersonaSelect} />;
    }
    if (onboardingStep === 'freemium-offer') {
      return <FreemiumOffer onClaim={handleClaimFreemium} />;
    }
  }

  return (
    <div className={`min-h-screen bg-[#f9fafb] flex flex-col md:flex-row transition-all duration-300 ${isSenior ? 'text-lg' : 'text-sm'}`}>
      <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Logo size="sm" countryCode={countryCode} />
          <span className="font-bold text-xl tracking-tight">SpendShield</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2" aria-label="Toggle Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </header>

      <nav className={`fixed inset-0 z-[60] md:relative md:flex md:w-72 bg-white border-r transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="hidden md:flex items-center space-x-3 mb-12">
            <Logo size="md" countryCode={countryCode} />
            <span className="font-black text-2xl tracking-tighter text-slate-900">SpendShield</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Command Center" isSenior={isSenior} />
            <NavItem active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon="📋" label="Manage Stack" isSenior={isSenior} />
            <NavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon="💳" label="Secure Vault" isSenior={isSenior} />
            <NavItem active={activeTab === 'refer'} onClick={() => setActiveTab('refer')} icon="🤝" label="Refer & Earn" isSenior={isSenior} />
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100">
             {referralDays > 0 && (
              <div className="mb-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Extension Earned</p>
                  <p className="text-xl font-black text-emerald-600">🕒 {referralDays} Days</p>
                </div>
                <div className="text-right text-xl">🎁</div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Experience</p>
              <div className="grid grid-cols-2 gap-3">
                {(['Student', 'Riser', 'Senior', 'Family man'] as UserPersona[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePersona(p)}
                    className={`px-3 py-2.5 rounded-2xl text-[10px] font-black transition-all ${persona === p ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {!isPremium && (
              <button 
                onClick={() => setIsPremium(true)} 
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-black uppercase py-3 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
              >
                Get SpendShield Pro ⭐
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
        <div className="max-w-6xl mx-auto pb-24 md:pb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="space-y-1">
              <h1 className={`font-black text-slate-900 tracking-tight ${isSenior ? 'text-5xl' : 'text-3xl'}`}>
                {activeTab === 'home' && `${regionalGreeting}, ${persona}!`}
                {activeTab === 'subscriptions' && 'Manage Your Stack'}
                {activeTab === 'payments' && 'Vault & Payment Sources'}
                {activeTab === 'refer' && 'Refer & Earn Extension'}
              </h1>
              <p className="text-slate-500 font-bold">
                {activeTab === 'home' && 'Your unified financial hygiene and market pulse report.'}
              </p>
            </div>
          </div>

          {activeTab === 'home' && (
            <div className="flex flex-col space-y-10">
              <MascotFin isSenior={isSenior} countryCode={countryCode} message={`Welcome back. Your 90-day Pro trial is active. I've integrated your Savings Lab and Market Explorer below.`} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dashboard Summary Column */}
                <div className="lg:col-span-2 space-y-10">
                  <Dashboard totalSpend={totalMonthlySpend} persona={persona} isPremium={isPremium} />
                  
                  {/* Integrated Savings Lab Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 px-2">
                       <span className="bg-indigo-600 text-white p-2 rounded-xl text-lg">💡</span>
                       <h3 className="font-black text-slate-900 text-xl">Integrated Savings Lab</h3>
                    </div>
                    <MonthlyExpenses 
                      persona={persona} 
                      isPremium={isPremium} 
                      recommendations={recommendations} 
                      loading={loadingInsights} 
                      sources={sources} 
                      onUpgrade={() => setIsPremium(true)} 
                    />
                  </div>
                </div>

                {/* Explorer & Action Column */}
                <div className="space-y-10">
                   {/* Upcoming Payments Mini-List */}
                   <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center">
                        <span className="mr-2">📅</span> Next Auto-pays
                      </h3>
                      <div className="space-y-4">
                        {subscriptions.filter(s => s.status !== 'Paused').slice(0, 3).map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{sub.icon}</span>
                              <div>
                                <p className="font-black text-slate-900 text-xs">{sub.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(sub.nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                              </div>
                            </div>
                            <p className="font-black text-slate-900 text-sm">₹{sub.amount}</p>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => setActiveTab('subscriptions')} variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">Manage All →</Button>
                   </div>

                   {/* Integrated Market Explorer Section */}
                   <div className="space-y-6">
                     <div className="flex items-center space-x-3 px-2">
                        <span className="bg-teal-600 text-white p-2 rounded-xl text-lg">🧭</span>
                        <h3 className="font-black text-slate-900 text-xl">Market Pulse</h3>
                     </div>
                     <ExploreSection 
                       insights={exploreInsights} 
                       sources={exploreSources} 
                       loading={loadingExplore} 
                       persona={persona} 
                       onAction={handleExploreAction} 
                     />
                   </div>

                   {/* Winback Section */}
                   <WinbackSection 
                    ads={winbackAds} 
                    onClaim={(ad) => alert(`Claiming ${ad.brand} offer...`)} 
                    onDismiss={(id) => setWinbackAds(prev => prev.filter(a => a.id !== id))}
                   />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map(sub => (
                  <SubscriptionCard key={sub.id} subscription={{...sub, currency}} persona={persona} onStatusChange={handleStatusChange} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <PaymentSources sources={paymentSources} wallet={wallet} persona={persona} onLinkNew={handleLinkNewSource} />
          )}

          {activeTab === 'refer' && (
            <ReferralSection days={referralDays} persona={persona} onReferralSuccess={handleReferralSuccess} />
          )}
        </div>
      </main>

      <footer className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t flex items-center justify-around p-4 z-50">
        <MobileNavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Home" />
        <MobileNavItem active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon="📋" label="Subs" />
        <MobileNavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon="💳" label="Vault" />
      </footer>
    </div>
  );
}

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; isSenior?: boolean }> = ({ active, onClick, icon, label, isSenior }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className={isSenior ? 'text-3xl' : 'text-xl'}>{icon}</span>
    <span className={`font-black ${isSenior ? 'text-2xl' : 'text-sm'}`}>{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center flex-1">
    <span className={`text-2xl ${active ? 'text-indigo-600' : 'text-slate-300'}`}>{icon}</span>
    <span className={`text-[10px] font-black mt-1 uppercase ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);
