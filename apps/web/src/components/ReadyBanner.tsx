import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ReadyBanner: React.FC = () => {
  const scrollToCustomizer = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('customizer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#142978] text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>UPGRADE YOUR MORNING</span>
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight">
          READY TO RAISE YOUR SHAVE GAME?
        </h2>

        <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto font-medium">
          Get the complete No Frills Starter Set delivered with free shipping. Join over 10 million satisfied club members today.
        </p>

        <div className="pt-4">
          <a
            href="#customizer"
            onClick={scrollToCustomizer}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-base font-black uppercase tracking-wider bg-[#FE5000] text-white hover:bg-orange-600 active:scale-98 shadow-2xl shadow-orange-500/40 transition-all cursor-pointer group"
          >
            <span>LET&apos;S DO THIS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
