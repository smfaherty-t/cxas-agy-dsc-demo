import React, { useState } from 'react';
import { Sparkles, Menu, X, ShieldCheck, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerChat = () => {
    // Open chat-messenger if available
    const cm = document.querySelector('chat-messenger');
    if (cm) {
      const toggleBtn = cm.querySelector('chat-toggle-dialog-button') as HTMLElement;
      if (toggleBtn) {
        toggleBtn.click();
      } else {
        cm.setAttribute('opened', 'true');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-100 text-xs sm:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>THE $5 STARTER SET:</strong> Premium Razor, 4 Cartridges &amp; Shave Butter + Free Shipping
        </span>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 font-black text-xl tracking-tighter shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                DSC
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 leading-none">
                  DOLLAR SHAVE CLUB
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mt-0.5">
                  AI Grooming Studio
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-700">
            <a href="#starter-set" className="hover:text-amber-600 transition-colors">Starter Set</a>
            <a href="#blades" className="hover:text-amber-600 transition-colors">Blades &amp; Handles</a>
            <a href="#products" className="hover:text-amber-600 transition-colors">Shave &amp; Grooming</a>
            <a href="#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={triggerChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer"
              title="Chat with AI Grooming Advisor"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask AI Advisor</span>
            </button>
            <a
              href="#starter-set"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-sm transition-all"
            >
              Get Started for $5
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={triggerChat}
              className="p-2 text-stone-600 hover:text-amber-600"
              aria-label="Ask AI"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <a
            href="#starter-set"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-amber-600"
          >
            Starter Set
          </a>
          <a
            href="#blades"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-amber-600"
          >
            Blades &amp; Handles
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-amber-600"
          >
            Shave &amp; Grooming
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-amber-600"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-amber-600"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                triggerChat();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200"
            >
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Chat with AI Grooming Advisor
            </button>
            <a
              href="#starter-set"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-bold bg-amber-600 text-white hover:bg-amber-700"
            >
              Get Started for $5
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
