
import React from 'react';
import { ExploreInsight, UserPersona } from '../types';
import { Button } from './ui/Button';

interface ExploreSectionProps {
  insights: ExploreInsight[];
  sources: { title: string; uri: string }[];
  loading: boolean;
  persona: UserPersona;
  onAction: (insight: ExploreInsight) => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ insights, sources, loading, persona, onAction }) => {
  const isSenior = persona === 'Senior';

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-teal-500">
        <div className="w-16 h-16 relative mb-6">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Current Affairs & Market Trends...</p>
      </div>
    );
  }

  const isSwiggyHikeNews = (insight: ExploreInsight) => {
    const text = (insight.title + insight.description).toLowerCase();
    return text.includes('swiggy') && (text.includes('hike') || text.includes('fee') || text.includes('price'));
  };

  const UberEatsAd = () => (
    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-10 rounded-[4rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden group animate-in slide-in-from-bottom duration-700">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] -mr-40 -mt-40 transition-transform group-hover:scale-110"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/5 blur-[60px] -ml-20 -mb-20"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
        <div className="flex items-center space-x-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl group-hover:rotate-6 transition-transform relative z-10 border-4 border-emerald-500/20">
              🍱
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Contextual Save</span>
              <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Sponsored Alternative</span>
            </div>
            <h4 className="text-white font-black text-3xl mb-2 tracking-tight">Tired of Swiggy's new platform fees?</h4>
            <p className="text-slate-400 text-base font-medium max-w-md">Switch to <span className="text-white font-black">Uber Eats</span> for your next 3 orders. Use code <span className="text-emerald-400 font-black tracking-widest">EATSZERO</span> to skip all delivery & platform fees.</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end space-y-3">
          <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[1.5rem] px-12 py-5 font-black text-sm uppercase tracking-[0.1em] whitespace-nowrap shadow-xl shadow-emerald-500/20 transform group-hover:scale-105 transition-all">
            Switch to Uber Eats
          </Button>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Valid for new switchers only</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Actionable Insights Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {insights.length > 0 ? (
          insights.flatMap((insight) => {
            const elements = [
              <div 
                key={insight.id} 
                className={`
                  bg-white p-8 rounded-[3.5rem] border shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group
                  ${insight.actionType === 'Unsubscribe' ? 'border-rose-100 hover:border-rose-200' : 
                    insight.actionType === 'Subscribe' ? 'border-emerald-100 hover:border-emerald-200' : 'border-teal-50 hover:border-teal-200'}
                `}
              >
                {/* Context Tag */}
                <div className="flex items-center space-x-2 mb-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    insight.type === 'Price Hike' ? 'bg-rose-50 text-rose-500' : 
                    insight.type === 'Current Affair' ? 'bg-amber-50 text-amber-600' :
                    insight.type === 'New Deal' ? 'bg-emerald-50 text-emerald-600' : 'bg-teal-50 text-teal-600'
                  }`}>
                    {insight.type}
                  </span>
                  {insight.actionType !== 'None' && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 rounded-full">
                      Action: {insight.actionType}
                    </span>
                  )}
                </div>

                <div className="absolute top-0 right-0 p-8 text-6xl opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.07] transition-all duration-700 pointer-events-none">
                  {insight.icon || (insight.type === 'Price Hike' ? '📈' : insight.type === 'Current Affair' ? '🗞️' : '✨')}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <h4 className={`font-black text-slate-900 leading-tight mb-3 ${isSenior ? 'text-3xl' : 'text-2xl'}`}>
                    {insight.title}
                  </h4>
                  
                  <div className="bg-slate-50/50 rounded-2xl p-4 mb-6 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center">
                      <span className="mr-2">💡</span> The "Why"
                    </p>
                    <p className="text-slate-700 text-xs font-bold leading-relaxed">
                      {insight.relevance}
                    </p>
                  </div>
                  
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Verified via</p>
                      <p className="text-[10px] font-black text-slate-600 truncate">{insight.sourceLabel}</p>
                    </div>
                    
                    <Button 
                      onClick={() => onAction(insight)}
                      size={isSenior ? 'lg' : 'md'}
                      className={`
                        rounded-2xl px-8 font-black text-[11px] uppercase tracking-wider
                        ${insight.actionType === 'Unsubscribe' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 
                          insight.actionType === 'Subscribe' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 
                          'bg-teal-600 hover:bg-teal-700 shadow-teal-100'}
                      `}
                    >
                      {insight.ctaLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ];

            if (isSwiggyHikeNews(insight)) {
              elements.push(<UberEatsAd key={`uber-eats-ad-${insight.id}`} />);
            }

            return elements;
          })
        ) : (
          <div className="md:col-span-2 text-center py-24 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <div className="text-6xl mb-6">🔭</div>
            <h3 className="text-slate-900 font-black text-xl mb-2">Searching the Digital Horizon</h3>
            <p className="text-slate-400 font-bold text-sm tracking-tight px-10">We're checking news, sport schedules, and tech launches to find your next smart move.</p>
          </div>
        )}
      </div>

      {/* Grounding Source Listing */}
      {sources.length > 0 && (
        <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex items-center space-x-4 mb-8 relative z-10">
            <div className="bg-teal-500/20 p-3 rounded-2xl">
              <span className="text-2xl">🔗</span>
            </div>
            <div>
              <h5 className="text-[11px] font-black text-teal-300 uppercase tracking-[0.2em]">Source Grounding</h5>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Verified market data used for these suggestions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {sources.map((s, idx) => (
              <a 
                key={`source-${idx}`} 
                href={s.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-4 group bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
              >
                <div className="bg-teal-800/40 w-10 h-10 flex items-center justify-center rounded-xl text-lg group-hover:scale-110 transition-transform">🌐</div>
                <div className="min-w-0">
                  <span className="text-xs font-black block truncate text-slate-200">{s.title}</span>
                  <span className="text-[9px] opacity-40 font-mono truncate block text-teal-200 mt-1">{s.uri}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
