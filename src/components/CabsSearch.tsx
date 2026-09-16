import React, { useState } from 'react';
import { Car, MapPin, Calendar, Star, Users, Luggage, Check, Search } from 'lucide-react';
import { CabOption } from '../types/travel';
import { CABS_DATA } from '../data/travelData';

interface CabsSearchProps {
  onSelectCab: (cab: CabOption) => void;
  selectedCabId?: string;
}

export const CabsSearch: React.FC<CabsSearchProps> = ({ onSelectCab, selectedCabId }) => {
  const [pickupLocation, setPickupLocation] = useState<string>('Delhi Airport (DEL) Terminal 3');
  const [destination, setDestination] = useState<string>('Jaipur City Center / Heritage Hotel');
  const [pickupDate, setPickupDate] = useState<string>('2026-10-14');
  const [cabType, setCabType] = useState<string>('ALL');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  const filteredCabs = CABS_DATA.filter((cab) => {
    if (cabType === 'ALL') return true;
    if (cabType === 'Sedan') return cab.vehicleType.toLowerCase().includes('sedan');
    if (cabType === 'SUV')
      return (
        cab.vehicleType.toLowerCase().includes('suv') ||
        cab.vehicleType.toLowerCase().includes('innova')
      );
    if (cabType === 'Luxury')
      return (
        cab.vehicleName.toLowerCase().includes('mercedes') ||
        cab.vehicleName.toLowerCase().includes('bmw') ||
        cab.vehicleName.toLowerCase().includes('innova')
      );
    return true;
  });

  return (
    <section id="cabs-search" className="py-8 sm:py-12 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto">
        {/* Section Intro */}
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
            <Car className="w-3.5 h-3.5 text-stone-700" />
            Private Cabs & Transfers
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Doorstep airport pickups & intercity chauffeurs.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Upfront fixed pricing, verified executive chauffeurs, flight delay buffer, and pristine
            sanitized vehicles.
          </p>
        </div>

        {/* Clean, Focused Cab Search Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-2">
            {/* 1. Pickup Location */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Pickup Location
              </label>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Airport, Hotel, Home"
                  className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Destination */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Destination
              </label>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. City center, Resort"
                  className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Date & Time */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Date & Time
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-medium text-stone-900 cursor-pointer w-full"
                />
              </div>
            </div>

            {/* 4. Cab Type */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Cab Type
              </label>
              <select
                value={cabType}
                onChange={(e) => setCabType(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Sedan">Prime Sedan (4 Seats)</option>
                <option value="SUV">Luxury SUV / Innova (6 Seats)</option>
                <option value="Luxury">Executive Chauffeur</option>
              </select>
            </div>

            {/* 5. Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-[#E05A47] text-white font-medium text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Cabs</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cab Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCabs.map((cab) => {
            const isSelected = selectedCabId === cab.id;

            return (
              <div
                key={cab.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-md'
                    : 'border-stone-200/90 hover:border-stone-400 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={cab.image}
                      alt={cab.vehicleName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium">
                      {cab.vehicleType}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-serif font-bold text-stone-900">
                        {cab.vehicleName}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{cab.driverRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-500 font-light mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        {cab.capacity}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-stone-400" />
                        {cab.luggageCapacity}
                      </span>
                      <span>•</span>
                      <span>{cab.perKmRate}</span>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-600 font-light">
                      {cab.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-100 bg-[#FAF8F5]/60 mt-4">
                  <div className="pt-3">
                    <div className="text-[10px] text-stone-400 font-light">
                      Fixed all-inclusive fare
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900">
                      ₹{cab.pricePerTrip.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCab(cab)}
                    className={`mt-3 px-5 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                    }`}
                  >
                    {isSelected ? '✓ In Itinerary' : 'Select Cab'}
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
