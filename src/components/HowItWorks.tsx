import React from 'react';
import { Package, CalendarCheck, Sliders, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Package,
      title: 'Choose Your Starter Kit',
      description: 'Start with our \$5 kit including our heavy metal diamond-grip handle, 4 razor cartridges, and soothing shave butter.'
    },
    {
      num: '02',
      icon: CalendarCheck,
      title: 'Set Your Delivery Cadence',
      description: 'Tell us how frequently you shave. We will send fresh replacement cartridges right when you need them—never before, never late.'
    },
    {
      num: '03',
      icon: Sliders,
      title: 'Full Control, Zero Lock-In',
      description: 'Add body wash, switch to 6-blade or 4-blade, skip a shipment, or cancel anytime with one click. No contracts or hassles.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600">
            SIMPLE &amp; TRANSPARENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            How The Club Works
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Shaving shouldn’t be complicated or expensive. We took out the middleman and passed the savings to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-8 border border-stone-200/80 relative hover:border-amber-400 hover:shadow-lg transition-all"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-300 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-stone-300 font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-black text-stone-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-8 text-center text-white max-w-4xl mx-auto shadow-xl">
          <h3 className="text-2xl font-black text-white">
            Ready to upgrade your morning routine?
          </h3>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Try the starter kit for \$5 today. If you don’t love your first shave, it’s completely on us.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#starter-set"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-extrabold bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/30 transition-all"
            >
              <span>Get Your $5 Starter Kit</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
