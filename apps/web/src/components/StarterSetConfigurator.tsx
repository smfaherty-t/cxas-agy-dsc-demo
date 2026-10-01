import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, RefreshCw, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface HandleOption {
  color: string;
  name: string;
  hex: string;
  accentClass: string;
}

const HANDLE_COLORS: HandleOption[] = [
  { color: 'Black', name: 'Black', hex: '#1C1917', accentClass: 'bg-stone-900' },
  { color: 'Green', name: 'Green', hex: '#05AA3D', accentClass: 'bg-[#05AA3D]' },
  { color: 'Blue', name: 'Blue', hex: '#005BD3', accentClass: 'bg-[#005BD3]' }
];

const FREQUENCIES = [
  'Every 1 Month',
  'Every 2 Months (Recommended)',
  'Every 3 Months',
  'Every 4 Months',
  'Every 6 Months'
];

export const StarterSetConfigurator: React.FC = () => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<HandleOption>(HANDLE_COLORS[0]);
  const [purchaseType, setPurchaseType] = useState<'subscribe' | 'onetime'>('subscribe');
  const [frequency, setFrequency] = useState('Every 2 Months (Recommended)');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const price = purchaseType === 'subscribe' ? 3.99 : 13.00;
  const originalPrice = 13.00;

  const handleAddToCart = () => {
    addItem({
      productId: 'dsc-no-frills-starter-set',
      title: 'No Frills Starter Set',
      variantColor: selectedColor.name,
      price: price,
      originalPrice: originalPrice,
      purchaseType: purchaseType,
      frequency: purchaseType === 'subscribe' ? frequency : undefined,
      quantity: quantity,
      imageUrl: selectedColor.hex
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <section id="customizer" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Product View with Swatch Switching */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#DBEBF5] rounded-3xl p-8 border border-blue-200/60 shadow-lg relative flex flex-col items-center justify-center min-h-[440px] overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#142978] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#FE5000]" />
                  <span>STARTER KIT BUNDLE</span>
                </span>
              </div>

              {/* Dynamic Render of Selected Razor Handle Color */}
              <div className="my-auto py-8 flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-6">
                  {/* Razor illustration with selected handle color */}
                  <div className="flex flex-col items-center filter drop-shadow-2xl transition-all duration-300">
                    <div className="w-24 h-11 bg-stone-900 rounded-md border border-stone-700 flex flex-col items-center justify-center p-1 shadow-md">
                      <div className="w-full h-1 bg-amber-400 rounded-full mb-1"></div>
                      <div className="flex flex-col gap-0.5 w-full px-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-0.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-sm"></div>
                        ))}
                      </div>
                    </div>
                    <div className="w-5 h-6 bg-stone-800"></div>
                    {/* Color-changing handle */}
                    <div
                      className="w-7 h-44 rounded-b-2xl border-2 border-stone-800 relative shadow-inner transition-colors duration-300"
                      style={{ backgroundColor: selectedColor.hex }}
                    >
                      <div className="absolute inset-x-0 top-3 bottom-6 opacity-35 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]"></div>
                      <div className="absolute bottom-2 inset-x-0 text-center text-[8px] font-black text-white/90 tracking-widest">DSC</div>
                    </div>
                  </div>

                  {/* Shave Butter Tube */}
                  <div className="w-24 h-44 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 rounded-t-2xl rounded-b-md shadow-xl border border-amber-400/50 flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-between items-center text-[8px] font-black tracking-widest opacity-80">
                      <span>DSC</span>
                      <span>1 OZ</span>
                    </div>
                    <div className="my-auto text-center">
                      <div className="text-[9px] uppercase font-bold text-amber-200">Translucent</div>
                      <div className="text-xs font-black leading-tight mt-0.5">SHAVE BUTTER</div>
                    </div>
                    <div className="h-3 bg-stone-900 rounded-sm mx-auto w-12 border border-stone-800"></div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs font-black uppercase tracking-widest text-[#142978]">
                    Selected Color: {selectedColor.name} Handle
                  </span>
                </div>
              </div>

              {/* What's In The Set Micro-Grid */}
              <div className="w-full grid grid-cols-3 gap-3 border-t border-blue-200/80 pt-4 text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Cartridge</div>
                  <div className="text-xs font-black text-stone-900 mt-0.5">6-Blade Razor</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Handle</div>
                  <div className="text-xs font-black text-stone-900 mt-0.5">Diamond Grip</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 border border-stone-200/70">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Prep</div>
                  <div className="text-xs font-black text-stone-900 mt-0.5">Shave Butter (1oz)</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Customizer Options & Buy Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header with Dynamic Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
                  All This For ${price.toFixed(2)}
                </h2>
                {purchaseType === 'subscribe' && (
                  <span className="text-lg text-stone-400 line-through font-bold">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-stone-600 font-medium text-base">
                Everything you need for a great shave, for less than half the price of lunch.
              </p>
            </div>

            {/* Handle Color Swatches */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-black uppercase tracking-wider text-stone-800">
                Pick Your Color: <span className="text-[#FE5000]">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-4">
                {HANDLE_COLORS.map((handle) => {
                  const isSelected = selectedColor.color === handle.color;
                  return (
                    <button
                      key={handle.color}
                      type="button"
                      onClick={() => setSelectedColor(handle)}
                      aria-label={`Select ${handle.name} handle`}
                      className={`relative w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'border-[#FE5000] scale-110 shadow-md ring-2 ring-orange-300'
                          : 'border-stone-300 hover:border-stone-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: handle.hex }}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 text-white stroke-[3] filter drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purchase Options: Subscribe vs One-Time */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-black uppercase tracking-wider text-stone-500">
                Choose Purchase Option:
              </span>

              {/* Option 1: Subscribe (Recommended) */}
              <div
                onClick={() => setPurchaseType('subscribe')}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer ${
                  purchaseType === 'subscribe'
                    ? 'border-[#FE5000] bg-orange-50/40 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        purchaseType === 'subscribe'
                          ? 'border-[#FE5000] bg-[#FE5000]'
                          : 'border-stone-400'
                      }`}
                    >
                      {purchaseType === 'subscribe' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm uppercase tracking-wide text-stone-900">
                          Subscribe
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Save 70%
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 font-medium">
                        Just $3.99 + free shipping on all starter sets
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through font-semibold mr-1.5">$13.00</span>
                    <span className="text-lg font-black text-stone-900">$3.99</span>
                  </div>
                </div>

                {/* Subscription Benefits */}
                <div className="mt-3 pl-8 text-xs text-stone-600 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free shipping included | Skip, edit, or cancel anytime</span>
                  </div>
                </div>

                {/* Delivery Cadence Selector */}
                {purchaseType === 'subscribe' && (
                  <div className="mt-4 pt-3 border-t border-orange-200/60 pl-8">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1.5">
                      Delivered &amp; Billed Every:
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#FE5000] focus:border-transparent cursor-pointer"
                    >
                      {FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Option 2: One-Time Purchase */}
              <div
                onClick={() => setPurchaseType('onetime')}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer ${
                  purchaseType === 'onetime'
                    ? 'border-[#FE5000] bg-orange-50/40 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        purchaseType === 'onetime'
                          ? 'border-[#FE5000] bg-[#FE5000]'
                          : 'border-stone-400'
                      }`}
                    >
                      {purchaseType === 'onetime' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="font-black text-sm uppercase tracking-wide text-stone-900">
                        One-Time Purchase
                      </span>
                      <p className="text-xs text-stone-600 mt-0.5 font-medium">
                        Ships immediately and separate from subscriptions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900">$13.00</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quantity and Add to Cart Action */}
            <div className="pt-2 flex items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border-2 border-stone-300 rounded-xl bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-black text-base text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl font-black uppercase tracking-wider text-base bg-[#FE5000] hover:bg-orange-600 active:scale-98 text-white shadow-xl shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <span>Add to Cart &mdash; ${(price * quantity).toFixed(2)}</span>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 30-Day Money-Back Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-blue-600" /> Cancel Anytime In 1 Click
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
