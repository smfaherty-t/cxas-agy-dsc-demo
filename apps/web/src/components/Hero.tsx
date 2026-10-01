import React from 'react';
import { Check, Star, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="starter-set" className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-stone-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              THE ALL-IN-ONE STARTER SET
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              A legendary shave. <br className="hidden sm:inline" />
              <span className="text-amber-600">For five bucks.</span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl font-normal leading-relaxed">
              Stop paying \$25+ in the drugstore shaving aisle. Get our heavyweight diamond-grip metal handle, 4 precision 6-blade cartridges, and member-favorite shave butter delivered to your doorstep.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-stone-700 font-semibold max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Heavyweight Diamond-Grip Handle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>4x Stainless 6-Blade Cartridges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Travel Shave Butter (1 oz)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Free Shipping &amp; Cancel Anytime</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <a
                href="#blades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.99] shadow-lg shadow-amber-600/25 transition-all group"
              >
                <span>Get Started for $5</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-bold bg-white text-stone-800 border-2 border-stone-300 hover:border-stone-400 hover:bg-stone-50 transition-all"
              >
                How The Club Works
              </a>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-stone-400" /> Free U.S. Shipping
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-stone-400" /> 100% Risk-Free Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-stone-400" /> No Commitments, Cancel Anytime
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Card Container */}
              <div className="rounded-2xl bg-white border border-stone-200/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
                {/* Badge ribbon */}
                <div className="absolute -top-1 -right-1">
                  <div className="bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-md">
                    80% Off Retail
                  </div>
                </div>

                {/* Simulated product visual graphic */}
                <div className="w-full aspect-square bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 rounded-xl p-6 flex flex-col justify-between text-white relative shadow-inner overflow-hidden border border-stone-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">STARTER BUNDLE</span>
                      <h3 className="text-2xl font-black tracking-tight text-white mt-0.5">The 6-Blade Club Kit</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-400 line-through font-semibold">$24.00</div>
                      <div className="text-3xl font-black text-amber-400">$5.00</div>
                    </div>
                  </div>

                  {/* Visual Illustration */}
                  <div className="my-auto py-6 flex items-center justify-center gap-4">
                    <div className="w-16 h-36 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-600 rounded-lg shadow-lg border border-stone-400/40 flex flex-col items-center justify-between py-2 text-stone-800 font-bold text-[9px] uppercase tracking-wider">
                      <div className="w-12 h-6 bg-stone-300 rounded border border-stone-400 flex items-center justify-center font-black">6X</div>
                      <div className="h-16 w-2 bg-stone-800/20 rounded"></div>
                      <div>METAL</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="w-24 h-10 bg-amber-500/20 border border-amber-400/40 rounded-lg p-2 flex items-center gap-2 text-amber-200 text-xs font-semibold">
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-[9px]">4</div>
                        <span>Blades</span>
                      </div>
                      <div className="w-24 h-10 bg-amber-500/20 border border-amber-400/40 rounded-lg p-2 flex items-center gap-2 text-amber-200 text-xs font-semibold">
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-[9px]">1</div>
                        <span>Butter</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating footer */}
                  <div className="flex items-center justify-between border-t border-stone-800 pt-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-white ml-1.5">4.9 / 5.0</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">120,400+ Reviews</span>
                  </div>
                </div>

                {/* Subtext info */}
                <div className="mt-5 space-y-2 text-center text-xs text-stone-500">
                  <p>Includes ongoing cartridge delivery every 2, 3, or 4 months.</p>
                  <p className="font-semibold text-stone-700">Change, pause, or cancel anytime in 1 click.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
