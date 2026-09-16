import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Heart,
  Check,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StayItem } from '../types/travel';

interface StayDetailsModalProps {
  stay: StayItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStay: (stay: StayItem) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const StayDetailsModal: React.FC<StayDetailsModalProps> = ({
  stay,
  isOpen,
  onClose,
  onSelectStay,
  isSaved,
  onToggleSave,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  if (!isOpen || !stay) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCFB] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-stone-200/90 shadow-2xl flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[10px] font-medium uppercase tracking-wider">
                {stay.propertyType}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{stay.rating.toFixed(2)}</span>
                <span className="text-stone-400 font-light">
                  ({stay.reviewCount} verified reviews)
                </span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight mt-1">
              {stay.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-stone-500 font-light mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#E05A47]" />
              <span>
                {stay.location} • {stay.distanceToCenter}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(stay.id)}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
                isSaved
                  ? 'bg-[#E05A47] text-white border-[#E05A47]'
                  : 'bg-white text-stone-600 border-stone-200 hover:text-[#E05A47]'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-2xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Main Gallery Display */}
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 shadow-2xs">
            <img
              src={stay.images[activeImgIndex] || stay.images[0]}
              alt={stay.name}
              className="w-full h-full object-cover"
            />
            {stay.images.length > 1 && (
              <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between">
                <button
                  onClick={() =>
                    setActiveImgIndex(
                      (activeImgIndex - 1 + stay.images.length) % stay.images.length
                    )
                  }
                  className="p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/80 backdrop-blur-xs shadow cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((activeImgIndex + 1) % stay.images.length)}
                  className="p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/80 backdrop-blur-xs shadow cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
              About This Sanctuary
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {stay.description}
            </p>
          </div>

          {/* Room Configuration */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80">
            <div className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-1">
              Included Room Type
            </div>
            <div className="text-sm font-serif font-bold text-stone-900">{stay.roomType}</div>
            <div className="text-xs text-stone-500 font-light mt-1">
              King bed, panoramic terrace, rain shower & signature bathroom amenities.
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
              Included Amenities & Perks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stay.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white border border-stone-200/90 text-xs font-medium text-stone-700 flex items-center gap-2 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation policy */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>
              <strong>Cancellation:</strong> {stay.cancellationPolicy}
            </span>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-[#FAF8F5] border-t border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="text-lg font-serif font-bold text-stone-900">
              ₹{stay.pricePerNight.toLocaleString('en-IN')}{' '}
              <span className="text-xs text-stone-500 font-light">/ night</span>
            </div>
            <div className="text-[11px] text-stone-400 font-light">
              All local resort taxes included
            </div>
          </div>

          <button
            onClick={() => {
              onSelectStay(stay);
              onClose();
            }}
            className="px-6 py-3 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            Select This Stay for Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};
