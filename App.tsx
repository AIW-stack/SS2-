
import React, { useState, useEffect, useCallback } from 'react';
import { UserPersona, Subscription, Recommendation, Advertisement, ExploreInsight, PaymentIntegration, WalletData } from './types';
import { MOCK_SUBSCRIPTIONS, MOCK_ADS, MOCK_WINBACK_ADS, MOCK_PAYMENT_SOURCES, MOCK_WALLET } from './constants';
import { Dashboard } from './components/Dashboard';
import { SubscriptionCard } from './components/SubscriptionCard';
import { getSmartRecommendations, getExploreInsights } from './services/geminiService';
import { Button } from './components/ui/Button';
import { Login } from './components/Login';
import { MascotFin } from './components/MascotFin';
import { WinbackSection } from './components/WinbackSection';
import { MonthlyExpenses } from './components/MonthlyExpenses';
import { OnboardingDiscovery } from './components/OnboardingDiscovery';
import { Logo } from './components/ui/Logo';
import { ExploreSection } from './components/ExploreSection';
import { PaymentSources } from './components/PaymentSources';
import { ReferralSection } from './components/ReferralSection';
import { PersonaQuestionnaire } from './components/PersonaQuestionnaire';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'discovery' | 'persona'>('discovery');
  const [isNewUser, setIsNewUser] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [currency, setCurrency] = useState('₹');
  const [isPremium, setIsPremium] = useState(false);
  const [persona, setPersona] = useState<UserPersona>('Riser');
  const [activeTab, setActiveTab] = useState<'home' | 'subscriptions' | 'savings-lab' | 'explore' | 'payments' | 'refer'>('home');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [paymentSources, setPaymentSources] = useState<PaymentIntegration[]>(MOCK_PAYMENT_SOURCES);
  const [wallet, setWallet] = useState<WalletData>(MOCK_WALLET);
  const [winbackAds, setWinbackAds] = useState<Advertisement[]>(MOCK_WINBACK_ADS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [exploreInsights, setExploreInsights] = useState<ExploreInsight[]>([]);
  const [referralCredits, setReferralCredits] = useState(0);
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
      case '+33': return 'Bonjour';
      case '+49': return 'Hallo';
      case '+34': return 'Hola';
      case '+39': return 'Ciao';
      default: return 'Hello';
    }
  };

  const regionalGreeting = getGreeting(countryCode);

  const determineCurrency = (code: string) => {
    if (code === '+91') return '₹';
    if (code === '+1') return '$';
    if (code === '+44') return '£';
    if (['+33', '+49', '+34', '+39', '+31'].includes(code)) return '€';
    return '₹';
  };

  const totalMonthlySpend = subscriptions
    .filter(s => s.status !== 'Paused')
    .filter(s => s.frequency === 'Monthly')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const fetchInsights = useCallback(async () => {
    if (!isPremium) return;
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
  }, [subscriptions, persona, isPremium]);

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
    if (activeTab === 'savings-lab') {
      fetchInsights();
    } else if (activeTab === 'explore') {
      fetchExplore();
    }
  }, [persona, fetchInsights, fetchExplore, isPremium, activeTab]);

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
      setOnboardingStep('discovery'); // First page is now Discovery (Subs)
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleOnboardingNext = (data?: { subs?: Subscription[], sources?: PaymentIntegration[] }) => {
    if (data?.subs) setSubscriptions(prev => [...data.subs!, ...prev]);
    if (data?.sources) setPaymentSources(data.sources);
    
    // After discovery (Subs & Payments), ask for Persona
    setOnboardingStep('persona');
  };

  const handlePersonaSelect = (p: UserPersona) => {
    setPersona(p);
    setIsRegistering(false);
    setIsLoggedIn(true);
    setActiveTab('payments'); // Redirect to payments as requested after setup
  };

  const handleLinkNewSource = (type: string) => {
    alert(`Initiating manual linking flow for ${type}...`);
  };

  const handleReferralSuccess = (credits: number) => {
    setReferralCredits(prev => prev + credits);
  };

  const handleExploreAction = (insight: ExploreInsight) => {
    if (insight.actionType === 'None') return;

    if (insight.actionType === 'Subscribe') {
      const alreadySubbed = subscriptions.some(s => s.name.toLowerCase() === insight.targetService.toLowerCase());
      if (alreadySubbed) {
        alert(`${insight.targetService} is already in your stack!`);
        return;
      }

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
    } else if (insight.actionType === 'Unsubscribe' || insight.actionType === 'Pause') {
      const sub = subscriptions.find(s => s.name.toLowerCase() === insight.targetService.toLowerCase());
      if (sub) {
        handleStatusChange(sub.id, insight.actionType === 'Unsubscribe' ? 'Expiring Soon' : 'Paused');
        setActiveTab('subscriptions');
      } else {
        alert(`We couldn't find an active subscription for ${insight.targetService} to ${insight.actionType.toLowerCase()}.`);
      }
    }
  };

  const handleClaimWinback = (ad: Advertisement) => {
    if (subscriptions.some(s => s.name === ad.brand)) {
      alert("You already have an active subscription for " + ad.brand);
      return;
    }

    const newSub: Subscription = {
      id: `active-${Date.now()}`,
      name: ad.brand,
      amount: ad.brand === 'Spotify Premium' ? 59 : ad.brand === 'YouTube Premium' ? 129 : 499,
      currency: currency,
      frequency: 'Monthly',
      category: ad.brand === 'Spotify Premium' || ad.brand === 'SonyLIV' || ad.brand === 'YouTube Premium' ? 'OTT' : 'Other',
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentMethod: 'UPI Autopay',
      status: 'Active',
      usageLevel: 'High',
      usageMinutes: 0,
      icon: ad.icon
    };

    setSubscriptions(prev => [newSub, ...prev]);
    setWinbackAds(prev => prev.filter(item => item.id !== ad.id));
    setActiveTab('subscriptions');
  };

  const isSenior = persona === 'Senior';

  if (!isLoggedIn && !isRegistering) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (isRegistering) {
    if (onboardingStep === 'discovery') {
      return (
        <OnboardingDiscovery 
          mobileNumber={userMobile} 
          countryCode={countryCode} 
          onComplete={(sources) => handleOnboardingNext({ sources })} 
          onManual={() => handleOnboardingNext()} 
        />
      );
    }
    if (onboardingStep === 'persona') {
      return <PersonaQuestionnaire onSelect={handlePersonaSelect} />;
    }
  }

  return (
    <div className={`min-h-screen bg-[#f9fafb] flex flex-col md:flex-row transition-all duration-300 ${isSenior ? 'text-lg' : 'text-sm'}`}>
      <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Logo size="sm" countryCode={countryCode} />
          <span className="font-bold text-xl tracking-tight">SpendShield</span>
        </div>
        <div className="flex items-center space-x-3">
          {referralCredits > 0 && (
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100 flex items-center">
              🪙 {referralCredits}
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2" aria-label="Toggle Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </header>

      <nav className={`fixed inset-0 z-[60] md:relative md:flex md:w-72 bg-white border-r transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="hidden md:flex items-center space-x-3 mb-12">
            <Logo size="md" countryCode={countryCode} />
            <span className="font-black text-2xl tracking-tighter text-slate-900">SpendShield</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Dashboard" isSenior={isSenior} />
            <NavItem active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon="📋" label="Subscriptions" isSenior={isSenior} />
            <NavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon="💳" label="Payment Sources" isSenior={isSenior} />
            <NavItem active={activeTab === 'refer'} onClick={() => setActiveTab('refer')} icon="🤝" label="Refer & Earn" isSenior={isSenior} />
            <NavItem active={activeTab === 'savings-lab'} onClick={() => setActiveTab('savings-lab')} icon="💡" label="Savings Lab" isSenior={isSenior} />
            <NavItem active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon="🧭" label="Explore" isSenior={isSenior} />
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100">
             {referralCredits > 0 && (
              <div className="mb-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Referral Wallet</p>
                  <p className="text-xl font-black text-emerald-600">🪙 {referralCredits}</p>
                </div>
                <div className="text-right">
                  <span className="text-[18px]">🎁</span>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Experience</p>
              <div className="grid grid-cols-2 gap-3">
                {(['Student', 'Riser', 'Senior', 'Family man'] as UserPersona[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePersona(p)}
                    className={`px-3 py-2.5 rounded-2xl text-[10px] font-black transition-all ${persona === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            {!isPremium && (
              <button 
                onClick={() => setIsPremium(true)} 
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-black uppercase py-3 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95 animate-pulse"
              >
                Get SpendShield Pro ⭐
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto pb-24 md:pb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div className="space-y-1">
              <h1 className={`font-black text-slate-900 tracking-tight ${isSenior ? 'text-5xl' : 'text-3xl'}`}>
                {activeTab === 'home' && `${regionalGreeting}, ${persona}!`}
                {activeTab === 'subscriptions' && 'Subscriptions & Safety'}
                {activeTab === 'payments' && 'Vault & Payment Sources'}
                {activeTab === 'refer' && 'Refer & Earn Credits'}
                {activeTab === 'savings-lab' && 'Savings Lab'}
                {activeTab === 'explore' && 'Market Explorer'}
              </h1>
              <p className={`text-slate-500 font-semibold tracking-tight ${isSenior ? 'text-xl' : 'text-sm'}`}>
                {activeTab === 'home' && (isNewUser ? `Welcome to your first SpendShield report!` : `Welcome back to your financial hygiene report.`)}
                {activeTab === 'subscriptions' && `Managing ${subscriptions.length} payments with high-security mandates.`}
                {activeTab === 'payments' && `Managing your central wallet and ${paymentSources.length} linked sources.`}
                {activeTab === 'refer' && 'Invite your circle and earn credits redeemable for Pro features.'}
                {activeTab === 'savings-lab' && 'AI-Powered Insights & Monthly Outlook.'}
                {activeTab === 'explore' && 'Real-time market trends, price alerts, and smarter deals.'}
              </p>
            </div>
            <div className="mt-6 md:mt-0">
               {activeTab === 'refer' ? (
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-indigo-100 shadow-sm">
                    <span className="text-xl">🏆</span>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Your Rank</p>
                      <p className="text-sm font-black text-indigo-600">Shield Pro Scout</p>
                    </div>
                  </div>
               ) : (
                <Button size={isSenior ? 'lg' : 'md'} className="bg-indigo-600 rounded-2xl px-8 font-black">
                  <span className="mr-2">➕</span> {activeTab === 'payments' ? 'LINK SOURCE' : 'ADD NEW'}
                </Button>
               )}
            </div>
          </div>

          {activeTab === 'home' && (
            <div className="flex flex-col space-y-10">
              <MascotFin 
                isSenior={isSenior} 
                countryCode={countryCode}
                message={isPremium 
                  ? `${regionalGreeting}! I've analyzed your upcoming payments. You've got some smart savings bundles waiting below!` 
                  : `${regionalGreeting}! I'm Mr. Shield. I've found some silent leaks. Let's fix that together!`} 
              />
              <Dashboard totalSpend={totalMonthlySpend} persona={persona} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                    <h3 className="font-black text-slate-900 text-xl flex items-center">
                      <span className="mr-3 text-indigo-600 bg-indigo-50 p-2 rounded-xl text-lg">📅</span>
                      Upcoming
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {subscriptions.filter(s => s.status !== 'Paused').slice(0, 3).map(sub => (
                      <div key={sub.id} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                        <div className="text-2xl w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          {sub.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 leading-none text-sm truncate">{sub.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wide">
                            {new Date(sub.nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-sm">{currency}{sub.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                  <div>
                    <h3 className="text-2xl font-black mb-2">Invite your Circle</h3>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed">Refer friends to SpendShield and get 10 credits per active signup. Redeem credits for Pro features!</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Wallet Balance</p>
                      <p className="text-lg font-black">🪙 {referralCredits}</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('refer')}
                      className="rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase px-6"
                    >
                      Refer Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center space-x-3">
                  <h3 className="font-black text-slate-900 text-xl">✨ Smart Recommendations</h3>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_ADS.map(ad => (
                    <div key={ad.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 p-10 text-6xl opacity-10 group-hover:scale-125 transition-transform">{ad.icon}</div>
                      <p className="text-[10px] font-black uppercase text-indigo-500 mb-3 tracking-widest bg-indigo-50/50 inline-block px-3 py-1 rounded-full">Recommended Bundle</p>
                      <h4 className="font-black text-2xl mb-2 text-slate-900">{ad.brand}</h4>
                      <p className="text-sm text-slate-500 mb-8 h-12 overflow-hidden line-clamp-2 leading-relaxed font-medium">{ad.offer}</p>
                      <Button size="md" variant="secondary" className="border-indigo-100 text-indigo-600 font-black rounded-2xl px-8">
                        {ad.cta}
                      </Button>
                    </div>
                  ))}
                </div>
                <WinbackSection 
                  ads={winbackAds} 
                  onClaim={handleClaimWinback} 
                  onDismiss={(id) => setWinbackAds(prev => prev.filter(a => a.id !== id))}
                />
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="flex flex-col space-y-8">
              <div className="bg-indigo-950 rounded-[3rem] p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                <div className="relative z-10">
                  <h4 className="font-black text-3xl mb-2 tracking-tight">Payment Security Vault</h4>
                  <p className="text-sm opacity-60 font-medium">Industry-standard Token Management for all active mandates.</p>
                </div>
                <div className="text-6xl relative z-10">🛡️</div>
              </div>
              <MascotFin isSenior={isSenior} countryCode={countryCode} message="Every cent counts! Use the Pause button to halt a mandate, or Revoke (🚫) to stop it forever safely." />
              <div className="grid grid-cols-1 gap-6">
                {subscriptions.map(sub => (
                  <SubscriptionCard 
                    key={sub.id} 
                    subscription={{...sub, currency: currency}} 
                    persona={persona} 
                    isPremium={isPremium} 
                    onStatusChange={handleStatusChange} 
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
               <MascotFin isSenior={isSenior} countryCode={countryCode} message="This is your Payment Hub. I've secured your Mr. Shield Vault as your primary source. You can manually link apps or banks here anytime." />
               <PaymentSources 
                  sources={paymentSources} 
                  wallet={wallet} 
                  persona={persona} 
                  onLinkNew={handleLinkNewSource} 
               />
            </div>
          )}

          {activeTab === 'refer' && (
            <div className="space-y-6">
               <MascotFin isSenior={isSenior} countryCode={countryCode} message="Grow your circle and earn credits! I've prepared a contact explorer for you. Invite your friends to the SpendShield family." />
               <ReferralSection 
                  credits={referralCredits} 
                  persona={persona} 
                  onReferralSuccess={handleReferralSuccess} 
               />
            </div>
          )}

          {activeTab === 'savings-lab' && (
            <div className="space-y-6">
              <MascotFin isSenior={isSenior} countryCode={countryCode} message={isPremium ? "Your unified Savings Lab is ready. I've analyzed your essentials and flexible spending to maximize your savings." : "Unlock the Savings Lab to see your full expense breakdown and AI-powered optimizations!"} />
              <MonthlyExpenses 
                persona={persona} 
                isPremium={isPremium} 
                recommendations={recommendations}
                loading={loadingInsights}
                sources={sources}
                onUpgrade={() => setIsPremium(true)}
              />
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              <MascotFin isSenior={isSenior} countryCode={countryCode} message="Market Explorer is here! I'm constantly searching for new deals, price hike alerts, and better alternatives for you based on what's happening in the world today." />
              <ExploreSection 
                insights={exploreInsights} 
                sources={exploreSources} 
                loading={loadingExplore} 
                persona={persona}
                onAction={handleExploreAction}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t flex items-center justify-around p-4 z-50">
        <MobileNavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Home" />
        <MobileNavItem active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} icon="📋" label="Subs" />
        <MobileNavItem active={activeTab === 'refer'} onClick={() => setActiveTab('refer'} icon="🤝" label="Refer" />
        <MobileNavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon="💳" label="Vault" />
        <MobileNavItem active={activeTab === 'savings-lab'} onClick={() => setActiveTab('savings-lab')} icon="💡" label="Savings" />
      </footer>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; isSenior?: boolean }> = ({ active, onClick, icon, label, isSenior }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-none' : 'text-slate-500 hover:bg-slate-50'} ${isSenior ? 'p-6' : ''}`}
    aria-current={active ? 'page' : undefined}
  >
    <span className={isSenior ? 'text-3xl' : 'text-xl'}>{icon}</span>
    <span className={`font-black ${isSenior ? 'text-2xl' : 'text-sm'}`}>{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center flex-1">
    <span className={`text-2xl transition-transform ${active ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>{icon}</span>
    <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default App;
