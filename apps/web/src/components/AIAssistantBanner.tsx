import React from 'react';
import { Bot, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';

export const AIAssistantBanner: React.FC = () => {
  const openChatWithPrompt = (promptText: string) => {
    if (typeof (window as unknown as { openCxasChat?: (t: string) => void }).openCxasChat === 'function') {
      (window as unknown as { openCxasChat: (t: string) => void }).openCxasChat(promptText);
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

  const samplePrompts = [
    {
      label: "Order Status",
      badge: "COMMON INQUIRY",
      text: "Can you track my order DSC-8832 for alex@example.com?"
    },
    {
      label: "Change Address",
      badge: "COMMON INQUIRY",
      text: "I need to update my shipping address to 123 Main St, Austin TX 78701."
    },
    {
      label: "Order Arrived at Wrong Address",
      badge: "COMMON INQUIRY",
      text: "My order arrived at the wrong address! Can you help reship it?"
    },
    {
      label: "Cancel Retention & Cadence",
      badge: "FLEXIBLE MEMBERSHIP",
      text: "I want to cancel my subscription. Can I delay my next box or change delivery frequency instead?"
    },
    {
      label: "Report Damaged Product",
      badge: "AI VISION PHOTO INSPECTION",
      text: "My Shave Butter exploded in transit. Here is a picture for replacement.",
      action: () => {
        if (typeof (window as unknown as { openDamageReportModal?: () => void }).openDamageReportModal === 'function') {
          (window as unknown as { openDamageReportModal: () => void }).openDamageReportModal();
        } else {
          openChatWithPrompt("My Shave Butter exploded in transit. I want to upload a picture for replacement.");
        }
      }
    }
  ];

  return (
    <section className="bg-[#121212] text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-stone-800 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FE5000]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider border border-orange-500/30">
              <Bot className="w-4 h-4" />
              <span>POWERED BY GOOGLE CX AGENT STUDIO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Meet Your 24/7 Personal Grooming Advisor
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
              Have questions about which razor handle fits your routine? Need to track an in-transit order, delay your upcoming Restock Box, or update your delivery address? Click the chat bubble in the lower-left corner anytime to converse live with our conversational AI agent.
            </p>

            <div className="pt-1 text-xs text-stone-400 font-bold flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini Live session connected &bull; Real-time database mutations enabled</span>
            </div>
          </div>

          {/* Quick interactive sample prompts */}
          <div className="w-full lg:w-auto flex flex-col gap-2 shrink-0 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-stone-400 text-center lg:text-left">
              Try asking our agent directly:
            </span>
            <div className="flex flex-col gap-2.5">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => item.action ? item.action() : openChatWithPrompt(item.text)}
                  className="flex items-center justify-between gap-3 text-left text-xs sm:text-sm px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 hover:text-white transition-all cursor-pointer group shadow-sm hover:border-orange-500/60"
                  aria-label={item.text}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-[#FE5000] group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-orange-400">
                        {item.label}
                      </span>
                      <span className="font-semibold text-stone-200 group-hover:text-white">
                        &ldquo;{item.text}&rdquo;
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#FE5000] transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
