import React from 'react';
import { Package, Calendar, Check, ArrowRight } from 'lucide-react';

export const CadenceComparison: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#F5ECDF] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#FE5000]">
            TRANSPARENT VALUE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
            NO SURPRISES. HERE’S HOW IT WORKS.
          </h2>
          <p className="text-stone-600 font-medium text-base">
            We send you the complete starter trial first. Then you get full-size refills right when you need them.
          </p>
        </div>

        {/* 2-Card Cadence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Box 1: This Starter Set */}
          <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 shadow-sm flex flex-col justify-between relative hover:border-[#FE5000] transition-colors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-[#FE5000]">
                  BOX 01 &bull; SHIPS TODAY
                </span>
                <span className="text-2xl font-black text-stone-900">$3.99</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
                  THIS STARTER SET
                </h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  Everything you need to experience the legendary Club shave.
                </p>
              </div>

              <ul className="space-y-3 text-sm font-bold text-stone-800">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Heavyweight Diamond Grip Metal Handle (Choice of Color)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Signature 6-Blade Precision Razor Cartridge (1 ct)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Translucent Hydrating Shave Butter (1 oz Trial Size)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Free U.S. Standard Shipping Included</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-bold">
              <span>Billed once upon trial checkout</span>
              <span className="text-emerald-700">Ships in 24 Hours</span>
            </div>
          </div>

          {/* Box 2: Future Restock Boxes */}
          <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 shadow-sm flex flex-col justify-between relative hover:border-[#142978] transition-colors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-[#142978]">
                  BOX 02 &amp; BEYOND
                </span>
                <span className="text-2xl font-black text-stone-900">$10 &ndash; $18</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
                  FUTURE RESTOCK BOXES
                </h3>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  Full-size replacements delivered on your chosen schedule.
                </p>
              </div>

              <ul className="space-y-3 text-sm font-bold text-stone-800">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Signature 6-Blade Razor Refill Pack (4 Cartridges)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Full-Size Translucent Shave Butter (3 oz Tube)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>First Restock Box ships in 2 weeks (never run out of blades)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Delivered every 1, 2, or 3 months &bull; Delay or cancel anytime</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-bold">
              <span>Automatic reminder 3 days prior</span>
              <span className="text-[#142978]">Zero Cancellation Fees</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
