
import React, { useState } from 'react';
import { Subscription, UserPersona } from '../types';
import { Button } from './ui/Button';

interface SubscriptionCardProps {
  subscription: Subscription;
  persona: UserPersona;
  isPremium?: boolean;
  onStatusChange: (id: string, newStatus: Subscription['status']) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, persona, isPremium, onStatusChange }) => {
  const isSenior = persona === 'Senior';
  const isStudent = persona === 'Student';
  const isFamily = persona === 'Family man';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<Subscription['status']>(subscription.status);

  const isPaused = localStatus === 'Paused';

  const handleAction = (type: 'cancel' | 'renew' | 'pause' | 'resume') => {
    setIsProcessing(true);
    setIsCancelModalOpen(false);
    
    // Simulate API call to bank/aggregator
    setTimeout(() => {
      setIsProcessing(false);
      let nextStatus: Subscription['status'] = localStatus;

      if (type === 'cancel') {
        nextStatus = 'Expiring Soon';
      } else if (type === 'pause') {
        nextStatus = 'Paused';
      } else if (type === 'resume') {
        nextStatus = 'Active';
      } else if (type === 'renew') {
        nextStatus = 'Active';
      }

      setLocalStatus(nextStatus);
      onStatusChange(subscription.id, nextStatus);
    }, 1500);
  };

  const getPersonaAdvice = () => {
    switch (persona) {
      case 'Senior':
        return {
          title: "Want to stop this payment?",
          desc: `Namaste! Stopping this means your bank won't send ${subscription.currency}${subscription.amount} to ${subscription.name} anymore.`,
          implications: [
            "You won't be able to watch/use this service",
            "No more monthly deductions from your bank",
            "Safe to stop - we handle the bank paperwork"
          ],
          cta: "Yes, Stop it Now"
        };
      case 'Student':
        return {
          title: "Save your pocket money!",
          desc: `You're spending ${subscription.currency}${subscription.amount} monthly. That's about 3 extra meals!`,
          implications: [
            "Your student discount might expire if you cancel",
            "Ads will return to your experience",
            "Offline downloads will be deleted"
          ],
          cta: "Save my Money"
        };
      case 'Family man':
        return {
          title: "Household spending check",
          desc: `This ${subscription.category} service will stop working for everyone in the house.`,
          implications: [
            "Your kids/spouse will lose access immediately",
            "Shared watch history and profiles will be lost",
            "Cheaper individual plans might be better than cancelling"
          ],
          cta: "Confirm for Family"
        };
      case 'Riser':
      default:
        return {
          title: "Optimize your cash flow",
          desc: `Your current usage is ${subscription.usageLevel.toLowerCase()}. Cancelling reduces your annual burn by ${subscription.currency}${subscription.amount * 12}.`,
          implications: [
            "Revokes the UPI/Card mandate immediately",
            "Removes this from your financial hygiene report",
            "Loss of ad-free productivity/entertainment"
          ],
          cta: "Initiate Revoke"
        };
    }
  };

  const advice = getPersonaAdvice();

  // Senior Layout: Simplified, ultra-high-visibility, and vertical/stacked
  if (isSenior) {
    return (
      <>
        <div 
          role="region" 
          aria-label={`${subscription.name} subscription details`}
          className={`
            relative flex flex-col p-10 rounded-[4rem] border-8 transition-all duration-300
            ${isPaused 
              ? 'bg-slate-50 border-slate-200 border-dashed opacity-90' 
              : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'
            }
          `}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[4rem]">
              <div className="w-24 h-24 border-[10px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-2xl font-black text-indigo-900 uppercase tracking-widest">Updating...</p>
            </div>
          )}

          <div className="flex items-center space-x-8 mb-10">
            <div className={`
              w-32 h-32 flex items-center justify-center rounded-[2.5rem] text-7xl shrink-0 shadow-inner
              ${isPaused ? 'bg-slate-200 grayscale' : 'bg-indigo-50'}
            `}>
              {subscription.icon}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-5xl leading-tight mb-3">
                {subscription.name}
              </h3>
              <div className="flex items-center space-x-4">
                <span className="bg-slate-100 text-slate-600 text-lg font-black px-6 py-2 rounded-full uppercase tracking-widest">
                  {subscription.category}
                </span>
                {isPaused && (
                  <span className="bg-slate-900 text-white text-lg font-black px-6 py-2 rounded-full uppercase tracking-widest">
                    Stopped
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-10 mb-10 border-4 border-slate-100">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-slate-400 font-black text-xl uppercase tracking-widest">Monthly Cost</p>
                <p className="text-7xl font-black text-slate-900">{subscription.currency}{subscription.amount}</p>
              </div>
              <div className="h-1 bg-slate-200 w-full rounded-full"></div>
              <div className="flex justify-between items-center">
                <p className="text-slate-400 font-black text-xl uppercase tracking-widest">Next Pay Date</p>
                <p className={`text-4xl font-black ${isPaused ? 'text-slate-400 italic' : 'text-indigo-600'}`}>
                  {isPaused ? 'NONE' : new Date(subscription.nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {isPaused ? (
              <Button 
                onClick={() => handleAction('resume')}
                className="py-10 rounded-[2.5rem] text-3xl font-black bg-emerald-600 shadow-xl shadow-emerald-100"
              >
                ▶ RESTART PAYMENT
              </Button>
            ) : (
              <Button 
                onClick={() => handleAction('pause')}
                className="py-10 rounded-[2.5rem] text-3xl font-black bg-amber-500 text-white shadow-xl shadow-amber-100 border-none"
              >
                ⏸ STOP PAYMENT
              </Button>
            )}
            <Button 
              onClick={() => setIsCancelModalOpen(true)}
              variant="danger"
              className="py-8 rounded-[2.5rem] text-2xl font-black shadow-xl shadow-rose-100"
            >
              🚫 CANCEL FOREVER
            </Button>
          </div>
        </div>

        <CancellationModal 
          isOpen={isCancelModalOpen} 
          onClose={() => setIsCancelModalOpen(false)} 
          onConfirm={() => handleAction('cancel')}
          onPause={() => handleAction('pause')}
          advice={advice}
          isSenior={isSenior}
          isPaused={isPaused}
          subscription={subscription}
        />
      </>
    );
  }

  // Student/Riser/Family Layout: Focus on savings and Pocket Leak alerts for students
  return (
    <>
      <div 
        role="article"
        aria-label={`${subscription.name} - ${subscription.currency}${subscription.amount}`}
        className={`
          relative overflow-hidden flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 rounded-[2.5rem] border transition-all duration-300
          ${isPaused 
            ? 'bg-slate-50 border-slate-200 border-dashed opacity-90' 
            : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-xl'
          }
          ${isStudent && (subscription.usageLevel === 'Low' || subscription.usageLevel === 'Zero') ? 'border-amber-200 bg-amber-50/20' : ''}
        `}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center animate-in fade-in duration-200 rounded-[2.5rem]">
            <div className="w-10 h-10 border-[4px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-[10px] font-black uppercase text-indigo-700 tracking-widest animate-pulse">Syncing...</p>
          </div>
        )}

        {(subscription.usageLevel === 'Low' || subscription.usageLevel === 'Zero') && (
          <div className="absolute top-0 right-10">
            <div className={`text-white text-[8px] font-black px-4 py-1.5 rounded-b-xl uppercase shadow-lg animate-bounce ${isStudent ? 'bg-orange-500 shadow-orange-100' : 'bg-amber-400 shadow-amber-100'}`}>
              {isStudent ? '🔥 Pocket Leak!' : '💸 Money Leak!'}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-5 flex-1">
          <div className={`
            w-16 h-16 flex items-center justify-center rounded-3xl text-3xl shrink-0 transition-all duration-500 shadow-sm
            ${isPaused ? 'bg-slate-200 grayscale scale-95' : 'bg-slate-50 text-indigo-600'}
            ${isStudent && !isPaused ? 'bg-indigo-100 ring-2 ring-indigo-50' : ''}
          `}>
            {subscription.icon}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className={`font-black text-slate-900 truncate tracking-tight ${isStudent ? 'text-2xl' : 'text-xl'}`}>
                {subscription.name}
              </h3>
              {isPaused && (
                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase tracking-widest">
                  Paused
                </span>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider ${isStudent ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{subscription.category}</span>
              {isPremium && subscription.usageMinutes !== undefined && (
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase ${subscription.usageMinutes < 30 ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'}`}>
                  ⏱️ {subscription.usageMinutes}m used
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col justify-between md:items-end md:min-w-[140px] px-2">
          <div className="text-left md:text-right">
            <p className={`font-black text-slate-900 leading-none ${isStudent ? 'text-3xl' : 'text-2xl'}`}>
              {subscription.currency}{subscription.amount}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{subscription.frequency}</p>
          </div>
          <div className="text-right mt-0 md:mt-3">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
              {isPaused ? 'Mandate Status' : 'Next Auto-pay'}
            </p>
            <p className={`font-bold mt-0.5 text-sm ${isPaused ? 'text-slate-400 italic' : 'text-indigo-600'}`}>
              {isPaused ? 'Paused' : new Date(subscription.nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 md:w-auto w-full pt-2 md:pt-0">
          <button 
            onClick={() => handleAction(isPaused ? 'resume' : 'pause')}
            aria-label={isPaused ? 'Resume subscription' : 'Pause subscription'}
            className={`flex-1 md:w-32 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm ${
              isPaused 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAction('renew')}
              aria-label="Renew now"
              className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all flex items-center justify-center"
            >
              <span className="text-lg">🔄</span>
            </button>
            <button 
              onClick={() => setIsCancelModalOpen(true)}
              aria-label="Cancel subscription"
              className="p-4 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all flex items-center justify-center"
            >
              <span className="text-lg">🚫</span>
            </button>
          </div>
        </div>
      </div>

      <CancellationModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={() => handleAction('cancel')}
        onPause={() => handleAction('pause')}
        advice={advice}
        isSenior={isSenior}
        isPaused={isPaused}
        subscription={subscription}
      />
    </>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onPause: () => void;
  advice: any;
  isSenior: boolean;
  isPaused: boolean;
  subscription: Subscription;
}

const CancellationModal: React.FC<ModalProps> = ({ 
  isOpen, onClose, onConfirm, onPause, advice, isSenior, isPaused, subscription 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
          ${isSenior ? 'p-12' : 'p-8'}
        `}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce ${isSenior ? 'w-24 h-24 text-6xl' : 'w-20 h-20'}`}>
            🚫
          </div>
          
          <div className="space-y-2">
            <h2 id="modal-title" className={`font-black text-slate-900 tracking-tight ${isSenior ? 'text-5xl' : 'text-2xl'}`}>
              {advice.title}
            </h2>
            <p className={`text-slate-500 leading-relaxed font-medium ${isSenior ? 'text-2xl' : 'text-sm'}`}>
              {advice.desc}
            </p>
          </div>

          <div className="w-full bg-rose-50/50 border border-rose-100 rounded-2xl text-left p-6">
            <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-3 flex items-center">
              <span className="mr-2">⚠️</span> Important Implications
            </p>
            <ul className="space-y-2">
              {advice.implications.map((imp: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-500 text-xs mt-1">•</span>
                  <span className={`text-slate-700 font-semibold leading-relaxed ${isSenior ? 'text-xl' : 'text-xs'}`}>
                    {imp}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col w-full space-y-3 pt-4">
            <Button 
              onClick={onConfirm} 
              variant="danger" 
              size={isSenior ? 'lg' : 'md'} 
              fullWidth 
              className={`rounded-2xl font-black shadow-rose-100 ${isSenior ? 'py-8 text-3xl' : 'py-4'}`}
            >
              {advice.cta}
            </Button>
            
            {!isPaused && (
              <Button 
                onClick={onPause} 
                variant="secondary" 
                size={isSenior ? 'lg' : 'md'} 
                fullWidth 
                className={`rounded-2xl font-black text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 ${isSenior ? 'py-8 text-2xl' : 'py-4'}`}
              >
                Wait, Just Pause for a Month
              </Button>
            )}

            <Button 
              onClick={onClose} 
              variant="ghost" 
              size={isSenior ? 'lg' : 'md'} 
              fullWidth 
              className={`rounded-2xl font-black text-slate-400 ${isSenior ? 'py-6 text-xl' : 'py-3'}`}
            >
              Cancel, go back
            </Button>
          </div>
          
          <p className={`text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-slate-50 w-full ${isSenior ? 'text-lg' : 'text-[9px]'}`}>
            🔒 Safe & Secure via {subscription.paymentMethod}
          </p>
        </div>
      </div>
    </div>
  );
};
