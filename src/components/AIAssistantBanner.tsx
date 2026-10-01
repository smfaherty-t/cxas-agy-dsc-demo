import React from 'react';
import { Bot, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';

export const AIAssistantBanner: React.FC = () => {
  const openChatWithPrompt = (_promptText: string) => {
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

  const samplePrompts = [
    "What's the difference between 4-blade and 6-blade?",
    "What products are best for sensitive skin?",
    "How does the flexible monthly subscription work?",
    "Can you recommend a starter routine for shaving?"
  ];

  return (
    <section className="bg-stone-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-y border-stone-800 relative overflow-hidden">
      {/* Decorative gradient aura */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Bot className="w-3.5 h-3.5" />
              <span>POWERED BY GOOGLE CX AGENT STUDIO</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Meet Your 24/7 Personal Grooming Advisor
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Not sure which blade fits your beard density or sensitive skin? Have questions about your delivery frequency? Click the chat button in the bottom right corner anytime to converse with our conversational AI agent.
            </p>
          </div>

          {/* Quick interactive sample prompts */}
          <div className="w-full lg:w-auto flex flex-col gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 text-center lg:text-left">
              Try asking our agent:
            </span>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => openChatWithPrompt(prompt)}
                  className="flex items-center justify-between gap-3 text-left text-xs sm:text-sm px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-stone-200 hover:text-white transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>&ldquo;{prompt}&rdquo;</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
