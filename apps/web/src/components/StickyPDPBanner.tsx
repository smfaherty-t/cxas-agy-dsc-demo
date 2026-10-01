import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StickyPDPBanner: React.FC = () => {
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past initial hero section
      if (window.scrollY > 550) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const handleQuickAdd = () => {
    addItem({
      productId: 'dsc-no-frills-starter-set',
      title: 'No Frills Starter Set',
      variantColor: 'Black',
      price: 3.99,
      originalPrice: 13.00,
      purchaseType: 'subscribe',
      frequency: 'Every 2 Months (Recommended)',
      quantity: 1,
      imageUrl: '#1C1917'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-300 shadow-2xl py-3 px-4 sm:px-8 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Product Thumbnail & Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#DBEBF5] border border-blue-200 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-[#142978]">DSC</span>
          </div>
          <div>
            <h4 className="text-sm font-black text-stone-900 uppercase leading-tight">
              No Frills Starter Set
            </h4>
            <div className="text-xs text-stone-500 font-bold flex items-center gap-2">
              <span>Color: Black</span>
              <span>&bull;</span>
              <span className="text-emerald-700 font-extrabold">Free Shipping</span>
            </div>
          </div>
        </div>

        {/* Right: Price & CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-stone-400 line-through font-semibold">$13.00</div>
            <div className="text-xl font-black text-stone-900">$3.99</div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="py-3 px-6 rounded-xl font-black uppercase tracking-wider text-xs sm:text-sm bg-[#FE5000] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Add to Cart</span>
            <span className="sm:hidden">&bull; $3.99</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>

      </div>
    </div>
  );
};
