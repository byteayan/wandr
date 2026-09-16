import React, { useState } from 'react';
import {
  Heart,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Waves,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Eye,
} from 'lucide-react';
import { StayItem } from '../types/travel';
import { STAYS_DATA } from '../data/travelData';

interface StaysDiscoveryProps {
  onSelectStay: (stay: StayItem) => void;
  onViewStayDetails: (stay: StayItem) => void;
  savedStayIds: string[];
  onToggleSaveStay: (id: string) => void;
  activeStayId?: string;
}

export const StaysDiscovery: React.FC<StaysDiscoveryProps> = ({
  onSelectStay,
  onViewStayDetails,
  savedStayIds,
  onToggleSaveStay,
  activeStayId,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterPoolOnly, setFilterPoolOnly] = useState<boolean>(false);
  const [filterBreakfastOnly, setFilterBreakfastOnly] = useState<boolean>(false);
  const [filterLuxuryOnly, setFilterLuxuryOnly] = useState<boolean>(false);
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [id: string]: number }>({});

  const handleNextImage = (stayId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [stayId]: ((prev[stayId] || 0) + 1) % max,
    }));
  };

  const handlePrevImage = (stayId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [stayId]: ((prev[stayId] || 0) - 1 + max) % max,
    }));
  };

  const filteredStays = STAYS_DATA.filter((stay) => {
    if (filterType !== 'All' && stay.propertyType !== filterType) return false;
    if (filterPoolOnly && !stay.pool) return false;
    if (filterBreakfastOnly && !stay.breakfastIncluded) return false;
    if (filterLuxuryOnly && !stay.luxuryTier) return false;
    return true;
  });

  const propertyTypes = ['All', 'Boutique Villa', 'Luxury Resort', 'Heritage Suite'];

  return (
    <section id="stays-section" className="py-16 sm:py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Sanctuary Discovery
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Stays designed for waking up inspired.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light mt-2 max-w-xl">
              Curated private pool villas, heritage houseboats, and cliffside suites. Hand-vetted
              for design, quietude, and hospitality.
            </p>
          </div>
        </div>

        {/* Usability Filter Bar (Airbnb / OYO style) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          {/* Property Types */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-stone-900 text-stone-50 shadow-2xs font-semibold'
                    : 'bg-stone-50 text-stone-600 border border-stone-200/80 hover:bg-stone-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Feature Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterPoolOnly(!filterPoolOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                filterPoolOnly
                  ? 'bg-[#E05A47] text-white border-[#E05A47]'
                  : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Private Pool</span>
            </button>

            <button
              onClick={() => setFilterBreakfastOnly(!filterBreakfastOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                filterBreakfastOnly
                  ? 'bg-[#E05A47] text-white border-[#E05A47]'
                  : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Breakfast Included</span>
            </button>

            <button
              onClick={() => setFilterLuxuryOnly(!filterLuxuryOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                filterLuxuryOnly
                  ? 'bg-[#E05A47] text-white border-[#E05A47]'
                  : 'bg-stone-50 text-stone-700 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-Star Luxury</span>
            </button>
          </div>
        </div>

        {/* Stays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStays.map((stay) => {
            const isSaved = savedStayIds.includes(stay.id);
            const isSelected = activeStayId === stay.id;
            const currentImgIdx = activeImageIndexes[stay.id] || 0;
            const totalTripPrice = stay.pricePerNight * 6; // based on standard 7d trip (6 nights)

            return (
              <div
                key={stay.id}
                className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  isSelected
                    ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-lg'
                    : 'border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-xl'
                }`}
              >
                {/* Image Gallery Carousel Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={stay.images[currentImgIdx]}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-stone-900 shadow-2xs">
                      {stay.propertyType}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveStay(stay.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-[#E05A47] text-white shadow-sm'
                          : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#E05A47]'
                      }`}
                      title={isSaved ? 'Remove from Wishlist' : 'Save Stay'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Carousel Prev / Next Controls if multiple images */}
                  {stay.images.length > 1 && (
                    <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handlePrevImage(stay.id, stay.images.length, e)}
                        className="p-1.5 rounded-full bg-white/80 text-stone-800 hover:bg-white shadow-md cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextImage(stay.id, stay.images.length, e)}
                        className="p-1.5 rounded-full bg-white/80 text-stone-800 hover:bg-white shadow-md cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Carousel Dot Indicators */}
                  {stay.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {stay.images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            currentImgIdx === idx ? 'bg-white w-4' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Stay Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Rating Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-[#E05A47]" />
                        <span>{stay.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{stay.rating.toFixed(2)}</span>
                        <span className="text-[10px] text-stone-400 font-light">
                          ({stay.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Stay Name */}
                    <h3 className="text-lg font-serif font-bold text-stone-900 tracking-tight mb-1 group-hover:text-[#E05A47] transition-colors">
                      {stay.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-light mb-3">{stay.roomType}</p>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stay.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-stone-100/80 text-stone-600 text-[10px] font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/70 inline-flex items-center gap-1 mb-4">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{stay.cancellationPolicy}</span>
                    </div>
                  </div>

                  {/* Card Pricing & Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-stone-900">
                          ₹{stay.pricePerNight.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-light">/ night</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-light">
                        ₹{totalTripPrice.toLocaleString('en-IN')} total (6 nights)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewStayDetails(stay)}
                        className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-all cursor-pointer"
                      >
                        View stay
                      </button>

                      <button
                        onClick={() => onSelectStay(stay)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Choose'}
                      </button>
                    </div>
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
