import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Hotel, Ticket, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { Destination, StayItem, ActivityItem } from '../types/travel';
import { DESTINATIONS, STAYS_DATA, ACTIVITIES_DATA } from '../data/travelData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectStay: (stay: StayItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
  onSelectStay,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDests = query.trim()
    ? DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.country.toLowerCase().includes(query.toLowerCase()) ||
          d.vibeTags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : DESTINATIONS.slice(0, 3);

  const filteredStays = query.trim()
    ? STAYS_DATA.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.location.toLowerCase().includes(query.toLowerCase())
      )
    : STAYS_DATA.slice(0, 2);

  const filteredActs = query.trim()
    ? ACTIVITIES_DATA.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#FDFCFB] rounded-3xl max-w-2xl w-full overflow-hidden border border-stone-200/90 shadow-2xl animate-fadeIn">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-stone-200/80 flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search by vibe, destination (e.g. Bali, Romantic, Villa, Diving)..."
            className="w-full text-sm font-serif font-medium text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-400 placeholder:font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md bg-stone-200/80 text-stone-600 text-xs font-medium hover:bg-stone-300/80 cursor-pointer transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {/* Destinations */}
          {filteredDests.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 mb-2 px-2">
                Destinations
              </div>
              <div className="space-y-1">
                {filteredDests.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => {
                      onSelectDestination(dest);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-2xl hover:bg-white text-left flex items-center justify-between transition-all group cursor-pointer border border-transparent hover:border-stone-200/80 shadow-none hover:shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dest.coverImage}
                        alt={dest.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#E05A47]">
                          {dest.name}, {dest.country}
                        </h5>
                        <p className="text-[11px] text-stone-500 font-light">
                          {dest.vibeTags.join(' • ')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#E05A47] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stays */}
          {filteredStays.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 mb-2 px-2">
                Villas & Stays
              </div>
              <div className="space-y-1">
                {filteredStays.map((stay) => (
                  <button
                    key={stay.id}
                    onClick={() => {
                      onSelectStay(stay);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-2xl hover:bg-white text-left flex items-center justify-between transition-all group cursor-pointer border border-transparent hover:border-stone-200/80 shadow-none hover:shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={stay.images[0]}
                        alt={stay.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#E05A47]">
                          {stay.name}
                        </h5>
                        <p className="text-[11px] text-stone-500 font-light">
                          {stay.location} • ₹{stay.pricePerNight.toLocaleString('en-IN')}/night
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-stone-400 group-hover:text-[#E05A47]">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
