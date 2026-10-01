import React from 'react';
import { ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
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

  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black text-lg">
                DSC
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                DOLLAR SHAVE CLUB
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Premium grooming essentials crafted for real life. Exceptional quality without the bloated retail price tag.
            </p>
            <div className="pt-2">
              <button
                onClick={triggerChat}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 hover:text-white hover:border-amber-500 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Need help? Chat with AI Advisor</span>
              </button>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#starter-set" className="hover:text-amber-400 transition-colors">$5 Starter Set</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">6-Blade Razor Refills</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">4-Blade Razor Refills</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Shave Butter</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Post Shave Dew</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Body Wash &amp; Hair Care</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              The Club
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ &amp; Help Center</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Manage Subscription</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Gift Memberships</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Our Story</a></li>
            </ul>
          </div>

          {/* Architecture / Demo Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Architecture &amp; Cloud
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="flex items-center gap-1.5 text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Google CX Agent Studio</span>
              </p>
              <p className="text-[11px] font-mono text-stone-400 break-all">
                sa-training-466722 / Cloud Run
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Unapproved Sessions Rule Active</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} Dollar Shave Club Demonstration. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
            <a href="#" className="hover:text-stone-300">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
