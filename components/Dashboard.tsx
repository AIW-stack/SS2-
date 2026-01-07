
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_SPEND_HISTORY } from '../constants';
import { UserPersona } from '../types';

interface DashboardProps {
  totalSpend: number;
  persona: UserPersona;
  isPremium?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalSpend, persona, isPremium }) => {
  const isSenior = persona === 'Senior';

  return (
    <div className="space-y-6">
      <div className={`bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group`}>
        {/* Animated background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 mb-2">
              <p className={`opacity-60 font-black uppercase tracking-widest ${isSenior ? 'text-lg' : 'text-[10px]'}`}>Monthly Recurring Spend</p>
              {isPremium && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20 animate-pulse">
                  🛡️ 90-Day Pro Trial Active
                </span>
              )}
            </div>
            <h2 className={`font-black tracking-tight ${isSenior ? 'text-6xl' : 'text-5xl'}`}>₹{totalSpend.toLocaleString('en-IN')}</h2>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex-1 md:min-w-[140px]">
              <p className="text-[9px] uppercase font-black opacity-40 tracking-widest mb-1">Upcoming</p>
              <p className="text-xl font-black">₹1,240</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex-1 md:min-w-[140px]">
              <p className="text-[9px] uppercase font-black opacity-40 tracking-widest mb-1">Savings Lab</p>
              <p className="text-xl font-black text-emerald-400">₹899</p>
            </div>
          </div>
        </div>
      </div>

      {!isSenior && (
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 text-lg">Spend Trajectory</h3>
            <div className="flex space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="w-2 h-2 rounded-full bg-slate-100"></span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SPEND_HISTORY}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {isSenior && (
        <div className="bg-amber-50 rounded-[3rem] p-10 border-4 border-amber-200 shadow-xl shadow-amber-100/50">
          <h3 className="text-3xl font-black text-amber-900 mb-6 flex items-center">
            <span className="mr-3">⚠️</span> Action Needed
          </h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-6 bg-white p-6 rounded-[2.5rem] shadow-md border border-amber-100">
              <span className="text-5xl">📅</span>
              <div>
                <p className="text-2xl font-black text-slate-900">Netflix Pay Alert</p>
                <p className="text-slate-500 font-bold text-lg italic mt-1">₹649 will be cut on June 15.</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 bg-white p-6 rounded-[2.5rem] shadow-md border border-amber-100">
              <span className="text-5xl">💰</span>
              <div>
                <p className="text-2xl font-black text-slate-900">Unused Hotstar</p>
                <p className="text-slate-500 font-bold text-lg italic mt-1">Save ₹899 by stopping this now.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
