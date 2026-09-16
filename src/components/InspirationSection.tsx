import React from 'react';
import { Sparkles, ArrowRight, Compass, Clock, Heart } from 'lucide-react';
import { Destination } from '../types/travel';
import { DESTINATIONS } from '../data/travelData';

interface InspirationSectionProps {
  onSelectInspiration: (dest: Destination) => void;
}

export const InspirationSection: React.FC<InspirationSectionProps> = ({
  onSelectInspiration,
}) => {
  const stories = [
    {
      id: 'story-1',
      title: '7 Days of Italian Coastal Dreams: Pastas, Cliffs & Riva Boats',
      destId: 'amalfi',
      readTime: '4 min read',
      tag: 'Editorial',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      summary: 'Why Positano and Capri are best experienced without rigid itineraries — and how to rent a private wooden gozzo boat.',
    },
    {
      id: 'story-2',
      title: 'The Slow Soul of Kyoto: Hidden Machiya Tea Houses & Morning Monks',
      destId: 'kyoto',
      readTime: '5 min read',
      tag: 'Culture Vibe',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      summary: 'Waking up at 5 AM in Arashiyama, riverside bamboo meditation, and where to taste seasonal ceremonial matcha.',
    },
    {
      id: 'story-3',
      title: 'Kashmir in Blossom: Houseboats, Saffron Kahwa & Alpine Glades',
      destId: 'kashmir',
      readTime: '3 min read',
      tag: 'Nature Escape',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      summary: 'A slow cedarwood houseboat journey across Dal Lake surrounded by snow-capped Zabarwan peaks.',
    },
  ];

  return (
    <section id="inspiration-section" className="py-16 sm:py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
              <Compass className="w-3.5 h-3.5" />
              Wandr Journal
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Inspiration for the curious.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light mt-2 max-w-xl">
              Visual moodboards, hidden boutique sanctuaries, and unfiltered local guides written by modern travellers.
            </p>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => {
            const dest = DESTINATIONS.find((d) => d.id === story.destId) || DESTINATIONS[0];
            return (
              <div
                key={story.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-stone-900 shadow-2xs">
                        {story.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-light text-stone-400 mb-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{story.readTime}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-stone-900 tracking-tight mb-2 group-hover:text-[#E05A47] transition-colors leading-snug">
                      {story.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {story.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-600">
                    {dest.name}, {dest.country}
                  </span>
                  <button
                    onClick={() => onSelectInspiration(dest)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E05A47] hover:underline cursor-pointer"
                  >
                    <span>Design this vibe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
