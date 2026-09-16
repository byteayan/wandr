import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'WHO',
      icon: '👯',
      desc: 'Solo, couple, friends or family dynamics mapped first.',
    },
    {
      num: '02',
      title: 'VIBE',
      icon: '✨',
      desc: 'Romantic, high-energy adrenaline, culinary or slow rest.',
    },
    {
      num: '03',
      title: 'BUDGET',
      icon: '💰',
      desc: 'Honest tier calculation. Zero hidden surprise markups.',
    },
    {
      num: '04',
      title: 'DESTINATION',
      icon: '🗺️',
      desc: 'We score matching world locations with 95%+ compatibility.',
    },
    {
      num: '05',
      title: 'ITINERARY',
      icon: '📅',
      desc: 'Hour-by-hour dynamic plan crafted around your exact rhythm.',
    },
    {
      num: '06',
      title: 'CUSTOMIZE',
      icon: '🎛️',
      desc: 'Swap stays, add private shoots, or shift the vibe anytime.',
    },
    {
      num: '07',
      title: 'BOOK',
      icon: '🔒',
      desc: 'Single checkout locks flights, villas, driver & experiences.',
    },
    {
      num: '08',
      title: 'EXPERIENCE',
      icon: '🌴',
      desc: 'Live on-trip companion with proactive radar rescheduling.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FDFCFB] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Wandr Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            How Wandr Designs Your Journey
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light mt-2">
            A seamless linear journey from your initial daydream to your on-ground live adventure.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="bg-white p-4 rounded-2xl border border-stone-200/90 flex flex-col justify-between group hover:border-[#E05A47]/50 transition-all shadow-2xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-stone-400 tracking-widest">
                    {step.num}
                  </span>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <h3 className="text-xs font-serif font-bold text-stone-900 tracking-wider mb-1 group-hover:text-[#E05A47] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] text-stone-500 font-light leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex justify-end pt-3 text-stone-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
