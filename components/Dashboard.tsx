
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_SPEND_HISTORY } from '../constants';
import { UserPersona } from '../types';

interface DashboardProps {
  totalSpend: number;
  persona: UserPersona;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalSpend, persona }) => {
  const isSenior = persona === 'Senior';

  return (
    <div className="space-y-6">
      <div className={`bg-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden ${isSenior ? 'p-10' : ''}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
        <div className="relative z-10">
          <p className={`opacity-80 font-medium ${isSenior ? 'text-xl' : 'text-sm'}`}>Monthly Recurring Spend</p>
          <h2 className={`font-bold mt-1 ${isSenior ? 'text-5xl' : 'text-4xl'}`}>₹{totalSpend.toLocaleString('en-IN')}</h2>
          
          <div className="flex items-center space-x-4 mt-6">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/10 flex-1">
              <p className="text-[10px] uppercase font-bold opacity-70">Upcoming (7 days)</p>
              <p className="text-lg font-bold">₹1,240</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/10 flex-1">
              <p className="text-[10px] uppercase font-bold opacity-70">Potential Savings</p>
              <p className="text-lg font-bold text-emerald-300">₹899</p>
            </div>
          </div>
        </div>
      </div>

      {!isSenior && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Subscription Spend Trend</h3>
            <select className="text-xs font-semibold bg-gray-50 border-none rounded-lg p-1 px-2 focus:ring-0">
              <option>Last 6 Months</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SPEND_HISTORY}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {isSenior && (
        <div className="bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Important Alerts</h3>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-4xl">🔔</span>
              <div>
                <p className="text-xl font-bold">Netflix will cut ₹649 on June 15</p>
                <p className="text-gray-600">Want to stop this payment?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm">
              <span className="text-4xl">🔔</span>
              <div>
                <p className="text-xl font-bold">Hotstar not used in 30 days</p>
                <p className="text-gray-600">You can save ₹899 today.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
