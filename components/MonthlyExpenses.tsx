
import React from 'react';
import { Expense, UserPersona, Recommendation } from '../types';
import { MOCK_EXPENSES } from '../constants';
import { Button } from './ui/Button';

interface MonthlyExpensesProps {
  persona: UserPersona;
  isPremium: boolean;
  recommendations: Recommendation[];
  loading: boolean;
  sources: { title: string; uri: string }[];
  onUpgrade: () => void;
}

export const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({ 
  persona, 
  isPremium, 
  recommendations, 
  loading,
  sources,
  onUpgrade 
}) => {
  const isSenior = persona === 'Senior';
  const lifeExpenses = MOCK_EXPENSES.filter(e => e.group === 'Life');
  const flexibleExpenses = MOCK_EXPENSES.filter(e => e.group === 'Flexible');

  const ExpenseSection = ({ title, expenses, color }: { title: string, expenses: Expense[], color: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`font-black text-slate-900 flex items-center ${isSenior ? 'text-3xl' : 'text-xl'}`}>
          <span className={`w-2 h-8 ${color} rounded-full mr-3`}></span>
          {title}
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{expenses.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((exp) => (
          <div key={exp.id} className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group`}>
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {exp.icon}
              </div>
              <div>
                <h4 className={`font-black text-slate-900 ${isSenior ? 'text-xl' : 'text-base'}`}>{exp.name}</h4>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{exp.category}</span>
                  <span className={`w-1 h-1 rounded-full bg-slate-300`}></span>
                  <span className={`text-[9px] font-black uppercase ${exp.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>
                    {exp.status === 'Paid' ? '✓ Paid' : '⚡ Due'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black text-slate-900 ${isSenior ? 'text-2xl' : 'text-xl'}`}>₹{exp.amount}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Due {new Date(exp.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-10">
      {/* AI SAVINGS LAB SECTION (PREMIUM GATED) */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black text-slate-900 flex items-center ${isSenior ? 'text-3xl' : 'text-2xl'}`}>
            <span className="mr-3 bg-indigo-600 text-white p-2 rounded-2xl text-xl">🤖</span>
            AI Optimization Lab
          </h3>
          {!isPremium && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Premium Only</span>
          )}
        </div>

        {!isPremium ? (
          <div className="relative overflow-hidden rounded-[3rem] border-2 border-dashed border-indigo-200 p-8 bg-indigo-50/30">
            {/* Masked Content Teaser */}
            <div className="space-y-6 opacity-30 select-none pointer-events-none filter blur-[2px]">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-6 rounded-3xl flex space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upgrade Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/40 backdrop-blur-md">
              <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-3xl mb-4 animate-bounce">🔒</div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Unlock 12+ Smart Savings</h4>
              <p className="text-sm text-slate-600 mb-6 max-w-xs mx-auto font-medium">Mr. Shield has found ₹1,450 in monthly leaks. Upgrade to Pro to see and fix them!</p>
              <Button onClick={onUpgrade} className="px-10 py-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 font-black">GET PRO ACCESS</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-indigo-400">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black text-[10px] uppercase tracking-[0.2em]">Shield is analyzing your spend pattern...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white p-6 rounded-[2.5rem] border border-indigo-50 flex items-start space-x-5 shadow-sm hover:border-indigo-300 transition-all group">
                        <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${rec.type === 'Cancel' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {rec.type === 'Cancel' ? '🚫' : '💡'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-slate-900 text-lg leading-tight">{rec.title}</h4>
                            <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full whitespace-nowrap ml-4">₹{rec.potentialSavings} Savings</span>
                          </div>
                          <p className="text-slate-500 text-sm mb-4 leading-relaxed font-medium">{rec.description}</p>
                          <Button variant={rec.type === 'Cancel' ? 'danger' : 'primary'} size="sm" className="rounded-xl px-6 font-black tracking-tight">{rec.actionLabel}</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No optimization needed right now!</p>
                    </div>
                  )}
                </div>

                {sources.length > 0 && (
                  <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                    <h5 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Market Verification Sources</h5>
                    <div className="space-y-3">
                      {sources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group opacity-70 hover:opacity-100 transition-opacity">
                          <span className="bg-white/10 p-1.5 rounded-lg text-xs">🌐</span>
                          <span className="text-xs font-bold truncate">{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* MONTHLY EXPENSES BREAKDOWN */}
      <ExpenseSection title="Life Essentials" expenses={lifeExpenses} color="bg-indigo-500" />
      <div className="h-px bg-slate-100 mx-4"></div>
      <ExpenseSection title="Flexible Choices" expenses={flexibleExpenses} color="bg-amber-500" />
      
      {/* Quick Summary Card */}
      <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-32 -mt-32 opacity-10 group-hover:scale-110 transition-transform"></div>
        <div className="mb-6 md:mb-0 text-center md:text-left relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">Total Monthly Liability</p>
          <h4 className="text-3xl font-black">₹{MOCK_EXPENSES.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}</h4>
          <p className="text-xs opacity-50 mt-1 font-medium italic">Including automated and manual bills</p>
        </div>
        <div className="flex space-x-3 relative z-10">
          <Button variant="secondary" className="rounded-2xl border-none bg-white/10 text-white hover:bg-white/20 px-8 font-black text-[11px] uppercase tracking-widest">Download PDF</Button>
          <Button className="rounded-2xl px-8 font-black text-[11px] uppercase tracking-widest bg-indigo-500 hover:bg-indigo-400">Add Bill</Button>
        </div>
      </div>
    </div>
  );
};
