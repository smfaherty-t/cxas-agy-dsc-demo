import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Check, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    cartCount,
    subtotal,
    freeShippingThreshold,
    amountToFreeShipping
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const triggerChatWithPrompt = (prompt: string) => {
    closeCart();
    if (typeof (window as unknown as { openCxasChat?: (t: string) => void }).openCxasChat === 'function') {
      (window as unknown as { openCxasChat: (t: string) => void }).openCxasChat(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-stone-900">
                  Cart
                </h2>
                <span className="text-sm font-bold text-stone-500">
                  ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-stone-400 hover:text-stone-900 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator (From PDF) */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                {amountToFreeShipping > 0 ? (
                  <span className="text-stone-800">
                    You Are <strong className="text-[#FE5000]">${amountToFreeShipping.toFixed(2)}</strong> Away From <strong>FREE SHIPPING!</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 font-black">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> You Unlocked FREE SHIPPING!
                  </span>
                )}
                <span className="text-stone-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/60">
                <div
                  className="bg-[#FE5000] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Drawer Body / Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">
                  Your cart is empty!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Add the No Frills Starter Set or stock up on shave essentials to get started.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 rounded-xl bg-stone-900 text-white font-black text-xs uppercase tracking-wider hover:bg-[#FE5000] transition-colors"
                >
                  Shop Starter Set
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex gap-4 items-center justify-between"
                >
                  {/* Item Visual Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center border border-stone-300 shrink-0"
                    style={{ backgroundColor: item.imageUrl.startsWith('#') ? item.imageUrl : '#1c1917' }}
                  >
                    <span className="text-white text-[10px] font-black uppercase">DSC</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-stone-900 truncate uppercase">
                      {item.title}
                    </h4>
                    <div className="text-xs text-stone-500 font-bold mt-0.5">
                      Color: <span className="text-stone-800">{item.variantColor}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#142978] mt-0.5">
                      {item.purchaseType === 'subscribe' ? (
                        <span>Subscribed: {item.frequency || 'Every 2 Months'}</span>
                      ) : (
                        <span>One-Time Purchase</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-stone-900 mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-stone-100 text-stone-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-black text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-stone-100 text-stone-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-bold text-stone-600">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-black">
                    {subtotal >= freeShippingThreshold || items.some((i) => i.purchaseType === 'subscribe') ? 'FREE' : '$4.99'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-stone-900 pt-1 border-t border-stone-200">
                  <span className="uppercase">Estimated Subtotal</span>
                  <span className="text-xl">${subtotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  alert(`Thank you for choosing Dollar Shave Club! Total: $${subtotal.toFixed(2)} USD. Your order will be fulfilled.`);
                  closeCart();
                }}
                className="w-full py-4 px-6 rounded-xl font-black uppercase tracking-wider text-base bg-[#FE5000] hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Checkout &bull; ${subtotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* AI Assistant Quick Assistance Trigger */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => triggerChatWithPrompt('Can you help me review my cart and subscription cadence?')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142978] hover:text-blue-900 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#FE5000]" />
                  <span>Have questions? Ask AI Grooming Advisor</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
