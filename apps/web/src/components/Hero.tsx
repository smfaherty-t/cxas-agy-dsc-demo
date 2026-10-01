import React from 'react';
import { ArrowRight, Star, ShieldCheck, Users, Check } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToCustomizer = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('customizer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="starter-set" className="relative bg-[#F9F3EA] border-b border-stone-200 overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Showcase (Image With Text reverse) */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-lg">
              {/* Product Card Container */}
              <div className="relative rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 sm:p-8 overflow-hidden group">
                
                {/* Ribbon Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FE5000] text-white shadow-md">
                    $3.99 TRIAL
                  </span>
                </div>

                {/* Main Visual Image / Render */}
                <div className="w-full aspect-square bg-[#DBEBF5] rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden border border-blue-100">
                  <div className="absolute inset-0 bg-radial from-white/60 to-transparent pointer-events-none" />
                  
                  {/* High fidelity Razor, Handle and Butter illustration/photo */}
                  <div className="relative z-10 flex items-center justify-center gap-6 my-auto">
                    {/* Diamond Grip Razor */}
                    <div className="flex flex-col items-center filter drop-shadow-xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      {/* Razor Head 6-Blade */}
                      <div className="w-20 h-10 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 rounded-md border border-stone-600 flex flex-col items-center justify-center p-1 shadow-md">
                        <div className="w-full h-1 bg-amber-400 rounded-full mb-1"></div>
                        <div className="flex flex-col gap-0.5 w-full px-1">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-0.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-sm"></div>
                          ))}
                        </div>
                      </div>
                      {/* Razor Neck */}
                      <div className="w-4 h-5 bg-gradient-to-b from-stone-700 to-stone-800"></div>
                      {/* Heavyweight Handle */}
                      <div className="w-6 h-36 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 rounded-b-xl border border-stone-700 relative shadow-inner">
                        {/* Diamond knurling pattern */}
                        <div className="absolute inset-x-0 top-3 bottom-6 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]"></div>
                        <div className="absolute bottom-2 inset-x-0 text-center text-[7px] font-black text-stone-400 tracking-widest">DSC</div>
                      </div>
                    </div>

                    {/* Shave Butter Tube */}
                    <div className="w-24 h-44 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 rounded-t-2xl rounded-b-md shadow-xl border border-amber-400/50 flex flex-col justify-between p-3 text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      <div className="flex justify-between items-center text-[8px] font-black tracking-widest opacity-80">
                        <span>DSC</span>
                        <span>1 OZ</span>
                      </div>
                      <div className="my-auto text-center">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200">Translucent</div>
                        <div className="text-sm font-black leading-tight mt-0.5">SHAVE BUTTER</div>
                        <div className="text-[8px] text-amber-100/90 mt-1">Hydrating Glide</div>
                      </div>
                      <div className="h-3 bg-stone-900 rounded-sm mx-auto w-12 border border-stone-800"></div>
                    </div>
                  </div>

                  {/* Rating Badge Footer */}
                  <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-stone-200/60 z-10 mt-auto">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FE5000] text-[#FE5000]" />
                      ))}
                      <span className="text-xs font-black text-stone-900 ml-1">4.7 / 5.0</span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-600">No Frills Starter Set</span>
                  </div>
                </div>

                {/* Subtitle features */}
                <div className="mt-4 flex items-center justify-between text-xs text-stone-500 font-bold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Free Shipping Included
                  </span>
                  <span>100% Money-Back Guarantee</span>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Copy & Highlights */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FE5000] animate-pulse"></span>
              <span>THE ALL-IN-ONE STARTER SET</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.05] uppercase">
              A CRAZY-GOOD SHAVE FOR LESS
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Start something smooth with this starter set of shave faves. Get our heavyweight diamond-grip handle, 6-blade razor, and shave butter delivered straight to your door.
            </p>

            {/* Official 3 Highlights from PDF */}
            <div className="py-4 border-y border-stone-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-xl sm:text-2xl font-black text-[#142978]">10 Million</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-0.5">
                  Subscribers Served
                </span>
              </div>

              <div className="hidden sm:block border-l border-stone-300 pl-4">
                <span className="text-xl sm:text-2xl font-black text-[#142978]">4.7 Rating</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-0.5 block">
                  Sitewide Reviews
                </span>
              </div>
              <div className="sm:hidden flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-[#142978]">4.7 Rating</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-0.5">
                  Sitewide Reviews
                </span>
              </div>

              <div className="hidden sm:block border-l border-stone-300 pl-4">
                <span className="text-xl sm:text-2xl font-black text-[#142978]">30-Day</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-0.5 block">
                  Money-Back Guarantee
                </span>
              </div>
              <div className="sm:hidden flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-[#142978]">30-Day</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mt-0.5">
                  Money-Back Guarantee
                </span>
              </div>
            </div>

            {/* Action Button & Offer Note */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
              <a
                href="#customizer"
                onClick={scrollToCustomizer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-black uppercase tracking-wider bg-[#FE5000] text-white hover:bg-orange-600 active:scale-98 shadow-xl shadow-orange-500/25 transition-all cursor-pointer group"
              >
                <span>SELECT YOUR HANDLE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#customizer"
                onClick={scrollToCustomizer}
                className="text-sm font-bold text-stone-600 hover:text-stone-900 underline underline-offset-4"
              >
                Get Started for $5 or $3.99 with Subscription
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
