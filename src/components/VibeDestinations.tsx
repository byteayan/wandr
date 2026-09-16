import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Compass, Calendar, Wallet, Star, Check } from 'lucide-react';
import { Destination, VibeType } from '../types/travel';
import { DESTINATIONS } from '../data/travelData';

interface VibeDestinationsProps {
  onSelectDestination: (dest: Destination) => void;
  savedDestinationIds: string[];
  onToggleSaveDestination: (id: string) => void;
}

export const VibeDestinations: React.FC<VibeDestinationsProps> = ({
  onSelectDestination,
  savedDestinationIds,
  onToggleSaveDestination,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Romantic',
    'Adventure',
    'Food',
    'Culture',
    'Relaxing',
    'Nature',
    'Luxury',
  ];

  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.vibeTags.includes(selectedCategory as VibeType);
  });

  return (
    <section id="vibe-destinations" className="py-16 sm:py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Escapes
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Made for your vibe
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light mt-2 max-w-xl">
              Immersive destinations scored by energy, romance, cuisine, and adventure. Zero generic
              tourist traps.
            </p>
          </div>

          {/* Vibe Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-stone-50 shadow-2xs font-semibold'
                      : 'bg-white text-stone-600 border border-stone-200/80 hover:border-stone-300 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Immersive Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => {
            const isSaved = savedDestinationIds.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Large Image Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-stone-900 shadow-2xs">
                      {dest.country}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveDestination(dest.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-[#E05A47] text-white shadow-sm'
                          : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#E05A47]'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Destination'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-serif font-bold tracking-tight drop-shadow-sm">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-stone-200 font-light line-clamp-1">{dest.tagline}</p>
                  </div>
                </div>

                {/* Card Content & Vibe Breakdown */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Vibe Score Badges */}
                    <div className="grid grid-cols-2 gap-2 mb-4 bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/60">
                      {dest.vibeScores.slice(0, 2).map((vs, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-base">{vs.icon}</span>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                              {vs.label}
                            </span>
                            <span className="text-xs font-bold text-stone-900">{vs.score}/10</span>
                          </div>
                        </div>
                      ))}
                      <div className="col-span-2 pt-2 mt-1 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-stone-500">Budget Vibe:</span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                          {dest.budgetFit}
                        </span>
                      </div>
                    </div>

                    {/* Vibe Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dest.vibeTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-stone-100/80 text-stone-700 text-[11px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2 mb-4">
                      {dest.description}
                    </p>
                  </div>

                  {/* Card Footer: Metadata & CTA */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                        Est. Budget
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {dest.estimatedBudget}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
