import React, { useState } from 'react';
import { Sparkles, Star, Clock, MapPin, Check, Plus, Compass, ArrowRight } from 'lucide-react';
import { ActivityItem, VibeType } from '../types/travel';
import { ACTIVITIES_DATA } from '../data/travelData';

interface ActivitiesExplorerProps {
  onToggleActivity: (activity: ActivityItem) => void;
  selectedActivityIds: string[];
}

export const ActivitiesExplorer: React.FC<ActivitiesExplorerProps> = ({
  onToggleActivity,
  selectedActivityIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Adventure', 'Romantic', 'Food', 'Culture', 'Nature'];

  const filteredActivities = ACTIVITIES_DATA.filter((act) => {
    if (selectedCategory === 'All') return true;
    return act.category === selectedCategory;
  });

  return (
    <section id="activities-section" className="py-16 sm:py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Expeditions
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Make the trip memorable.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light mt-2 max-w-xl">
              Skip boring tour buses. Dive with manta rays, master secret spice recipes, and ascend
              volcanic peaks at sunrise.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-stone-50 shadow-2xs font-semibold'
                    : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.map((act) => {
            const isSelected = selectedActivityIds.includes(act.id);
            return (
              <div
                key={act.id}
                className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-md'
                    : 'border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Image with Tag Overlay */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-stone-900 shadow-2xs">
                        {act.category}
                      </span>
                    </div>

                    {act.badge && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#E05A47] text-white text-[10px] font-medium shadow-2xs">
                          {act.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs font-medium text-stone-500 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {act.duration}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-stone-900 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {act.rating.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="text-sm font-serif font-bold text-stone-900 tracking-tight mb-1 group-hover:text-[#E05A47] transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-stone-400 mb-2.5 font-light">
                      <MapPin className="w-3 h-3 text-[#E05A47]" />
                      <span className="line-clamp-1">{act.location}</span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3 font-light">
                      {act.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Add to Trip CTA */}
                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                      Price
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      ₹{act.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleActivity(act)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to trip</span>
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
