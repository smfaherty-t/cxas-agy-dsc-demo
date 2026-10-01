import React, { useState } from 'react';
import { ShieldCheck, Sparkles, MessageCircle, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const triggerChat = () => {
    if (typeof (window as unknown as { openCxasChat?: () => void }).openCxasChat === 'function') {
      (window as unknown as { openCxasChat: () => void }).openCxasChat();
    } else {
      const cm = document.querySelector('chat-messenger');
      if (cm) {
        cm.classList.remove('dsc-chat-closed');
        const toggleBtn = cm.querySelector('chat-toggle-dialog-button') as HTMLElement;
        if (toggleBtn) {
          toggleBtn.click();
        } else {
          cm.setAttribute('opened', 'true');
        }
      }
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#121212] text-stone-300 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Newsletter Signup (From PDF) */}
        <div className="bg-stone-900/90 rounded-3xl p-8 lg:p-12 border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              WANT 25% OFF?
            </h3>
            <p className="text-stone-400 text-sm font-medium">
              Get the latest news, offers, and fresh drops. New customers get 25% off their first order.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FE5000] focus:border-transparent font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-[#FE5000] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Main Footer Links Columns (From PDF) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & AI Support Col */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-auto" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="160" height="48" rx="8" fill="#FE5000" />
                <text x="12" y="24" fill="#FFFFFF" fontFamily="Impact, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.05em">DOLLAR</text>
                <text x="12" y="40" fill="#FFFFFF" fontFamily="Impact, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.05em">SHAVE CLUB</text>
              </svg>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-medium">
              Top-shelf grooming essentials without the pharmacy markup. Everything you need to look, feel, and shave your best delivered right to your door.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={triggerChat}
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:text-white hover:border-[#FE5000] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#FE5000]" />
                <span>Need help? Chat with AI Advisor</span>
              </button>
            </div>

            {/* Country Selector (From PDF) */}
            <div className="pt-2">
              <label htmlFor="country-selector" className="sr-only">Country / Region</label>
              <select
                id="country-selector"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs font-bold text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#FE5000]"
              >
                <option value="US">🇺🇸 United States (USD $)</option>
                <option value="AU">🇦🇺 Australia (AUD $)</option>
                <option value="CA-EN">🇨🇦 Canada (English CAD $)</option>
                <option value="CA-FR">🇨🇦 Canada (Français CAD $)</option>
                <option value="UK">🇬🇧 United Kingdom (GBP £)</option>
              </select>
            </div>
          </div>

          {/* Explore Col */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#starter-set" className="hover:text-[#FE5000] transition-colors">No Frills Starter Set</a></li>
              <li><a href="#customizer" className="hover:text-[#FE5000] transition-colors">6-Blade &amp; 4-Blade Razors</a></li>
              <li><a href="#products" className="hover:text-[#FE5000] transition-colors">Translucent Shave Butter</a></li>
              <li><a href="#products" className="hover:text-[#FE5000] transition-colors">Post Shave Dew</a></li>
              <li><a href="#how-it-works" className="hover:text-[#FE5000] transition-colors">Club Chronicles</a></li>
              <li><a href="#starter-set" className="hover:text-[#FE5000] transition-colors">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Customer Service Col */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#faq" className="hover:text-[#FE5000] transition-colors">Help Center &amp; FAQ</a></li>
              <li>
                <button
                  onClick={triggerChat}
                  className="hover:text-[#FE5000] transition-colors text-left font-medium"
                >
                  Track In-Transit Order
                </button>
              </li>
              <li>
                <button
                  onClick={triggerChat}
                  className="hover:text-[#FE5000] transition-colors text-left font-medium"
                >
                  Change Shipping Address
                </button>
              </li>
              <li>
                <button
                  onClick={triggerChat}
                  className="hover:text-[#FE5000] transition-colors text-left font-medium"
                >
                  Delay Next Restock Box
                </button>
              </li>
              <li><a href="#starter-set" className="hover:text-[#FE5000] transition-colors">Gift Cards &amp; Offers</a></li>
              <li><a href="#starter-set" className="hover:text-[#FE5000] transition-colors">30-Day Money-Back Guarantee</a></li>
            </ul>
          </div>

          {/* Architecture & AI Cloud */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              AI Architecture
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="flex items-center gap-1.5 text-stone-200 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#FE5000]" />
                <span>Google CX Agent Studio</span>
              </p>
              <p className="text-[11px] font-mono text-stone-500">
                Gemini 3.1 Flash Live (CES)
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Unapproved Sessions</span>
              </div>
              <div className="pt-2">
                <a
                  href={import.meta.env.VITE_DASHBOARD_URL || 'https://cxas-dsc-dashboard-z66d5k5ioa-uc.a.run.app'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-400 hover:text-amber-300"
                >
                  <span>Operations DB Monitor ↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Links & Copyright (From PDF) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
          <p>&copy; 2026, Dollar Shave Club. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#faq" className="hover:text-stone-300 transition-colors">Refund Policy</a>
            <a href="#faq" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-stone-300 transition-colors">Terms of Service</a>
            <a href="#faq" className="hover:text-stone-300 transition-colors">Discounts &amp; Promotions</a>
            <a href="#faq" className="hover:text-stone-300 transition-colors">Do Not Sell My Info</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
