
import React from 'react';
import { UserPersona } from '../types';

interface PersonaQuestionnaireProps {
  onSelect: (persona: UserPersona) => void;
}

const PERSONA_OPTIONS: { id: UserPersona; title: string; desc: string; icon: string; color: string }[] = [
  {
    id: 'Student',
    title: 'Student',
    desc: 'Managing pocket money & campus subs',
    icon: '🎓',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 'Riser',
    title: 'Riser',
    desc: 'Optimizing work & lifestyle cash flow',
    icon: '💼',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    id: 'Family man',
    title: 'Family man',
    desc: 'Managing group plans & shared bills',
    icon: '🏠',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    id: 'Senior',
    title: 'Senior Citizen',
    desc: 'Safe, simple tracking for fixed income',
    icon: '👴',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
];

export const PersonaQuestionnaire: React.FC<PersonaQuestionnaireProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tailor Your Shield</h2>
          <p className="text-slate-500 font-medium">
            Select your lifestyle profile to personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
          {PERSONA_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`
                group p-8 rounded-[3rem] border-2 text-left transition-all duration-300 hover:shadow-2xl active:scale-95
                ${opt.color} border-transparent hover:border-current
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{opt.icon}</span>
                <span className="text-slate-300 group-hover:text-current transition-colors">→</span>
              </div>
              <h3 className="text-2xl font-black mb-1">{opt.title}</h3>
              <p className="text-sm opacity-70 font-bold">{opt.desc}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Shield-Sec Privacy Encryption Active 🛡️
        </p>
      </div>
    </div>
  );
};
