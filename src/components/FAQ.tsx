import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  hasChatTrigger?: boolean;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  const faqs: FAQItem[] = [
    {
      question: 'What is included in the $5 Starter Set?',
      answer: 'Your Starter Set comes with our weighty diamond-grip metal handle, a 4-pack of precision stainless steel 6-blade cartridges, and a travel-size tube (1 oz) of our award-winning translucent Shave Butter. Shipping is 100% free.'
    },
    {
      question: 'Can I cancel, pause, or change my frequency anytime?',
      answer: 'Yes! There are zero long-term commitments or hidden cancellation fees. You can adjust your refill schedule (every 2, 3, or 4 months), skip an upcoming box, or cancel directly from your account page in one click.'
    },
    {
      question: 'What is the difference between 4-blade and 6-blade cartridges?',
      answer: 'The 6-blade cartridge offers our closest, smoothest shave with an integrated precision trimmer on the back for sideburns and under the nose. The 4-blade cartridge has slightly wider blade spacing, making it ideal for sensitive skin and coarse, curly, or thicker facial hair.',
      hasChatTrigger: true
    },
    {
      question: 'How do I speak with support or get grooming recommendations?',
      answer: 'You can chat instantly with our 24/7 AI Grooming Advisor (built on Google Cloud CX Agent Studio) right here on the website! Just tap the chat bubble in the lower-left corner to ask questions about blade choices, order status, or skincare tips.',
      hasChatTrigger: true
    },
    {
      question: 'What is the 100% Club Guarantee?',
      answer: 'If you’re not completely satisfied with your razor or grooming products, let us know within 30 days and we will issue a full refund without making you ship anything back.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Everything you need to know about the club, delivery schedules, and our products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-stone-50/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                >
                  <span className="font-extrabold text-base sm:text-lg text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-4 bg-white">
                    <p>{faq.answer}</p>
                    {faq.hasChatTrigger && (
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <button
                          onClick={triggerChat}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ask AI Grooming Advisor now</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
