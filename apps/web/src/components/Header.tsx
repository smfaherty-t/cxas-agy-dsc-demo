import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, MessageSquare, Database, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AnnouncementBar } from './AnnouncementBar';

export const Header: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);

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

  const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || 'https://cxas-dsc-dashboard-z66d5k5ioa-uc.a.run.app';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-3 group">
              {/* Official DSC Orange Stacked Badge Logo */}
              <div className="flex items-center">
                <svg className="h-10 w-auto" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dollar Shave Club">
                  <rect width="160" height="48" rx="8" fill="#FE5000" />
                  <text x="12" y="24" fill="#FFFFFF" fontFamily="Impact, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.05em">DOLLAR</text>
                  <text x="12" y="40" fill="#FFFFFF" fontFamily="Impact, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.05em">SHAVE CLUB</text>
                  <path d="M128 12L144 24L128 36V12Z" fill="#FFFFFF" opacity="0.9" />
                </svg>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-stone-800">
              <a href="#starter-set" className="hover:text-[#FE5000] transition-colors py-2">
                Starter Set
              </a>
              <a href="#customizer" className="hover:text-[#FE5000] transition-colors py-2">
                Razors &amp; Shave
              </a>
              <a href="#how-it-works" className="hover:text-[#FE5000] transition-colors py-2">
                How It Works
              </a>
              <a href="#products" className="hover:text-[#FE5000] transition-colors py-2">
                Skin &amp; Body
              </a>
              <a href="#reviews" className="hover:text-[#FE5000] transition-colors py-2">
                Reviews
              </a>
              <a href="#faq" className="hover:text-[#FE5000] transition-colors py-2">
                FAQ
              </a>

              {/* Featured Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setFeaturedOpen(true)}
                onMouseLeave={() => setFeaturedOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#FE5000] transition-colors py-2 uppercase"
                  aria-expanded={featuredOpen}
                >
                  <span>Featured</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {featuredOpen && (
                  <div className="absolute top-full left-0 w-48 bg-white border border-stone-200 shadow-xl rounded-xl py-2 z-50">
                    <a href="#products" className="block px-4 py-2 text-xs font-bold uppercase text-stone-700 hover:bg-stone-50 hover:text-[#FE5000]">
                      Electrics (50% Off)
                    </a>
                    <a href="#how-it-works" className="block px-4 py-2 text-xs font-bold uppercase text-stone-700 hover:bg-stone-50 hover:text-[#FE5000]">
                      Club Chronicles
                    </a>
                    <a href="#customizer" className="block px-4 py-2 text-xs font-bold uppercase text-stone-700 hover:bg-stone-50 hover:text-[#FE5000]">
                      Military &amp; Student
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Icons & Demo Access */}
          <div className="flex items-center gap-3">
            {/* Live DB Monitor Link for dual-screen demo */}
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#142978] text-white hover:bg-blue-900 transition-all shadow-sm"
              title="Open Operations Dashboard & Real-Time Member DB"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live DB Monitor ↗</span>
            </a>

            {/* AI Advisor Trigger Button */}
            <button
              onClick={triggerChat}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              title="Chat with AI Grooming Advisor"
              aria-label="Ask AI Advisor"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FE5000]" />
              <span className="hidden sm:inline">Ask AI Advisor</span>
            </button>

            {/* Search Icon */}
            <button
              type="button"
              onClick={triggerChat}
              className="p-2 text-stone-700 hover:text-[#FE5000] transition-colors"
              aria-label="Search"
              title="Search products with AI Advisor"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <a
              href="#customizer"
              className="p-2 text-stone-700 hover:text-[#FE5000] transition-colors"
              aria-label="Sign In"
              title="Sign In / Account"
            >
              <User className="w-5 h-5" />
            </a>

            {/* Cart Button with Counter */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-stone-900 hover:text-[#FE5000] transition-colors cursor-pointer"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FE5000] text-white text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 hover:text-[#FE5000]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 font-bold uppercase tracking-wide text-sm text-stone-800">
            <a
              href="#starter-set"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              Starter Set
            </a>
            <a
              href="#customizer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              Razors &amp; Shave
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              How It Works
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              Skin &amp; Body
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              Reviews
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#FE5000]"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerChat();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-amber-50 text-amber-950 border border-amber-300"
              aria-label="Ask AI Advisor"
            >
              <MessageSquare className="w-4 h-4 text-[#FE5000]" />
              <span>Ask AI Grooming Advisor</span>
            </button>

            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#142978] text-white"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Live DB Monitor ↗</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
