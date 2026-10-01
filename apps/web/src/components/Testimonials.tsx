import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Marcus T.',
      role: 'Member since 2021',
      rating: 5,
      headline: 'Best razor I’ve ever touched.',
      quote: 'The weight of the diamond grip handle alone makes drugstore razors feel like hollow plastic toys. Zero irritation, clean lines, and shave butter makes razor burn a thing of the past.'
    },
    {
      name: 'David L.',
      role: 'Member since 2022',
      rating: 5,
      headline: 'The Shave Butter changed everything.',
      quote: 'I used to get horrible razor burn along my neck with traditional aerosol foams. Shave Butter is translucent so I can see what I’m trimming and it washes out easily.'
    },
    {
      name: 'Brian K.',
      role: 'Member since 2023',
      rating: 5,
      headline: 'Massive savings every single month.',
      quote: 'Was spending upwards of $30 on 4 cartridges at retail. Now I get superior 6-blade cartridges delivered on my schedule with free shipping. Total no-brainer.'
    }
  ];

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#F9F3EA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#FE5000]">
            OVER 10,000,000 SUBSCRIBERS SERVED
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
            HEAR FROM SATISFIED CLUB MEMBERS
          </h2>
          <p className="text-stone-700 font-bold text-sm sm:text-base uppercase tracking-wider">
            We think our blades are f*cking great. Plenty of others do, too.
          </p>
          <div className="flex items-center justify-center gap-1 text-[#FE5000] pt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FE5000]" />
            ))}
            <span className="text-stone-900 font-black ml-2 text-sm">4.7 out of 5.0 Sitewide Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex text-[#FE5000] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FE5000]" />
                  ))}
                </div>
                <h4 className="font-black text-stone-900 text-lg mb-2">
                  &ldquo;{rev.headline}&rdquo;
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed font-medium">
                  {rev.quote}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-stone-900 text-sm">{rev.name}</div>
                  <div className="text-xs text-stone-400">{rev.role}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
