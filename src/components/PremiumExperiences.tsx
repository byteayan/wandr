import React from 'react';
import {
  Sparkles,
  Heart,
  Plus,
  Check,
  ShieldCheck,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { PremiumExperience } from '../types/travel';
import { PREMIUM_EXPERIENCES } from '../data/travelData';

interface PremiumExperiencesProps {
  onToggleExperience: (exp: PremiumExperience) => void;
  selectedExperienceIds: string[];
}

export const PremiumExperiences: React.FC<PremiumExperiencesProps> = ({
  onToggleExperience,
  selectedExperienceIds,
}) => {
  return (
    <section id="premium-experiences" className="py-16 sm:py-24 bg-[#FAF8F5] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Upgrades
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Make it unforgettable.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light mt-2">
            The extraordinary details that turn good trips into legendary memories. Reserved exclusively for Wandr travellers.
          </p>
        </div>

        {/* Premium Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PREMIUM_EXPERIENCES.map((exp) => {
            const isSelected = selectedExperienceIds.includes(exp.id);
            return (
              <div
                key={exp.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-lg'
                    : 'border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Image with Icon Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-lg shadow-2xs">
                        {exp.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase">
                        {exp.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-base font-serif font-bold text-stone-900 tracking-tight mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Included Checkpoints */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      {exp.includes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add Button */}
                <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                      Experience Price
                    </span>
                    <span className="text-base font-bold text-stone-900">
                      ₹{exp.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleExperience(exp)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#E05A47] text-white shadow-2xs'
                        : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Included in Trip</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Experience</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
