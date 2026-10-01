import React from 'react';
import { Award, ShieldAlert, SlidersHorizontal } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Award,
      title: 'Start Strong',
      description: 'Try these hand-selected fan favorites and bestsellers we think you’ll love. High-carbon steel blades engineered for effortless precision.'
    },
    {
      icon: ShieldAlert,
      title: 'Feel The Difference',
      description: 'Put this shave to the test. If you don’t love it, there’s a 30-day money-back guarantee with no return shipping required.'
    },
    {
      icon: SlidersHorizontal,
      title: 'Total Flexibility',
      description: 'Get fresh blades delivered on your schedule. Pause, modify, delay, or cancel anytime directly in your account or with our AI Advisor. Really.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#FE5000]">
            SMOOTH. SIMPLE. FLEXIBLE.
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
            WHAT MAKES THIS SET A NO-BRAINER?
          </h2>
          <p className="text-stone-600 font-medium text-base">
            Engineered to turn shaving from a chore into the highlight of your morning routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#DBEBF5]/40 rounded-3xl p-8 border border-blue-100 flex flex-col justify-between hover:bg-[#DBEBF5]/70 transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#142978] text-white flex items-center justify-center mb-6 shadow-md">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900 mb-3 uppercase tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-medium">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
