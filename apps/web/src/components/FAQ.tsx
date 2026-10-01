import React, { useState } from 'react';
import { Plus, Minus, MessageSquare } from 'lucide-react';

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
      answer: 'Your Starter Set comes with our weighty diamond-grip metal handle, a precision 6-blade razor cartridge, and a travel-size tube (1 oz) of our award-winning translucent Shave Butter. Free shipping is 100% included with no long-term commitment.'
    },
    {
      question: 'Can I cancel, pause, or change my frequency anytime?',
      answer: 'Zero long-term commitments or hidden cancellation fees! You can adjust your refill schedule (every 1, 2, 3, 4, or 6 months), delay an upcoming box, or cancel directly from your account page in one click—or ask our AI Advisor to do it for you.'
    },
    {
      question: 'How can I change when my subscription box ships?',
      answer: 'If you want to reschedule an upcoming order, you can manage it all from the “Next Box” tab in your Account page, or ask our 24/7 AI Grooming Advisor right in the chat to delay or accelerate your shipment schedule.',
      hasChatTrigger: true
    },
    {
      question: 'What if I don’t need an upcoming shipment?',
      answer: 'Here, you call all the shots. You can easily skip an upcoming shipment or pause a subscription by clicking the “Next Box” tab in your account, or messaging our virtual assistant.',
      hasChatTrigger: true
    },
    {
      question: 'What if I run out of something before my next box ships?',
      answer: 'You can place an on-demand order at any time. Just add the product(s) to your cart and check out, and they’ll ship straight away without waiting for your next scheduled refill date.'
    },
    {
      question: 'How do I switch razors?',
      answer: 'If you want to switch to a different razor or add electric trimmers, simply select the razors you want and update your preferred box contents in your account settings or ask our chat assistant.'
    },
    {
      question: 'What happens if I’m not happy with my first box?',
      answer: 'We’re so sure you’ll love your grooming routine that we’ll refund you in full if you don’t. We offer a 30-day 100% money-back guarantee without making you ship anything back.'
    }
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#FE5000]">
            GOT QUESTIONS? WE’VE GOT ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-medium">
            See frequently asked questions below or chat with our 24/7 AI Grooming Advisor.
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
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-base sm:text-lg text-stone-900 pr-4">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#FE5000] shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-4 bg-white">
                    <p className="font-medium">{faq.answer}</p>
                    {faq.hasChatTrigger && (
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={triggerChat}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FE5000] bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-lg border border-orange-200 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
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
