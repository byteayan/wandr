import React, { useState } from 'react';
import { Bus, Calendar, Users, Search, Clock, Filter, Star } from 'lucide-react';
import { BusOption } from '../types/travel';
import { BUSES_DATA, POPULAR_BUS_CITIES } from '../data/travelData';

interface BusSearchProps {
  onSelectBus: (bus: BusOption) => void;
  selectedBusId?: string;
}

export const BusSearch: React.FC<BusSearchProps> = ({ onSelectBus, selectedBusId }) => {
  const [fromCity, setFromCity] = useState<string>('Delhi');
  const [toCity, setToCity] = useState<string>('Jaipur');
  const [journeyDate, setJourneyDate] = useState<string>('2026-10-14');
  const [passengers, setPassengers] = useState<number>(2);
  const [busTypeFilter, setBusTypeFilter] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<string>('ALL');
  const [priceSort, setPriceSort] = useState<'low' | 'high' | 'rating'>('rating');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  // Filter and sort buses
  const filteredBuses = BUSES_DATA.filter((bus) => {
    if (busTypeFilter !== 'ALL' && bus.busType !== busTypeFilter) return false;
    if (timeFilter !== 'ALL') {
      const hour = parseInt(bus.departTime.split(':')[0], 10);
      if (timeFilter === 'morning' && (hour < 5 || hour >= 12)) return false;
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false;
      if (timeFilter === 'night' && (hour < 17 || hour >= 24)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (priceSort === 'low') return a.price - b.price;
    if (priceSort === 'high') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <section id="bus-search" className="py-8 sm:py-12 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
            <Bus className="w-3.5 h-3.5 text-amber-800" />
            Luxury Intercity Sleepers & AC Coaches
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Premium Volvo & electric sleepers. Recline in comfort.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Multi-Axle Scania, BharatBenz, and quiet electric coaches with sanitized berths, onboard
            live GPS, and flexible cancellation.
          </p>
        </div>

        {/* Bus Search Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {/* From City */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                From City
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent text-xs font-serif font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                {POPULAR_BUS_CITIES.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* To City */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                To City
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent text-xs font-serif font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                {POPULAR_BUS_CITIES.map((c) => (
                  <option key={`to-${c.city}`} value={c.city}>
                    {c.city} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Departure Date
              </label>
              <div className="flex items-center gap-1.5 text-xs font-medium text-stone-900">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Passengers
              </label>
              <div className="flex items-center gap-1.5 text-xs font-medium text-stone-900">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                  className="bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                </select>
              </div>
            </div>

            {/* Search CTA */}
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
                    <span>Search Buses</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Bus Type:
              </span>
              {[
                { id: 'ALL', label: 'All Fleets' },
                { id: 'AC Sleeper (2+1)', label: 'AC Sleeper Pod' },
                { id: 'Multi-Axle Volvo AC', label: 'Multi-Axle Volvo' },
                { id: 'BharatBenz Premium', label: 'BharatBenz Luxury' },
                { id: 'Semi-Sleeper Luxury', label: 'Semi-Sleeper' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBusTypeFilter(b.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    busTypeFilter === b.id
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">Sort by:</span>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as 'low' | 'high' | 'rating')}
                className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium focus:outline-none cursor-pointer border border-stone-200"
              >
                <option value="rating">Top Operator Rating</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bus Results List */}
        {filteredBuses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
              No buses matching filter criteria
            </h3>
            <p className="text-xs text-stone-500 font-light max-w-md mx-auto mb-4">
              Try switching back to "All Fleets" to browse luxury sleeper options.
            </p>
            <button
              onClick={() => {
                setBusTypeFilter('ALL');
                setTimeFilter('ALL');
              }}
              className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-[#E05A47] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBuses.map((bus) => {
              const isSelected = selectedBusId === bus.id;

              return (
                <div
                  key={bus.id}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-md'
                      : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Operator & Route Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                      <div className="w-13 h-13 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                        <Bus className="w-6 h-6 text-[#E05A47]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                            {bus.operator}
                          </h3>
                          {bus.badge && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                bus.badge === 'Top Cleanliness'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                  : bus.badge === 'High Safety'
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200/80'
                                    : 'bg-stone-100 text-stone-800 border border-stone-200'
                              }`}
                            >
                              {bus.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 font-light flex-wrap">
                          <span className="font-medium text-stone-700">{bus.busType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {bus.rating.toFixed(2)} ({bus.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Boarding and Dropping points */}
                        <div className="mt-2.5 space-y-1 text-xs text-stone-500 font-light">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>
                              <strong>Boarding:</strong> {bus.boardingPoint}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#E05A47]" />
                            <span>
                              <strong>Dropping:</strong> {bus.droppingPoint}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-6 sm:gap-8 justify-between lg:justify-end">
                      <div>
                        <span className="text-xl font-serif font-bold text-stone-900 block">
                          {bus.departTime}
                        </span>
                        <span className="text-xs font-medium text-stone-600">{bus.fromCity}</span>
                      </div>

                      <div className="flex flex-col items-center min-w-24 sm:min-w-32">
                        <span className="text-[11px] font-medium text-stone-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {bus.duration}
                        </span>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="w-full h-px bg-stone-200"></div>
                          <Bus className="w-3.5 h-3.5 text-[#E05A47] absolute bg-white px-0.5" />
                        </div>
                        {bus.liveTracking && (
                          <span className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live GPS Tracking
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-xl font-serif font-bold text-stone-900 block">
                          {bus.arriveTime}
                        </span>
                        <span className="text-xs font-medium text-stone-600">{bus.toCity}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <div className="text-left lg:text-right">
                        <div className="text-[11px] text-amber-700 font-semibold mb-0.5">
                          ⚡ Only {bus.seatsLeft} seats left
                        </div>
                        <div className="text-2xl font-serif font-bold text-stone-900">
                          ₹{bus.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-400 font-light">
                          all taxes included
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectBus(bus)}
                        className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-98 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? '✓ In Itinerary' : 'Select Bus'}
                      </button>
                    </div>
                  </div>

                  {/* Amenities & Cancellation Tag */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 font-light">
                    <div className="flex flex-wrap items-center gap-2">
                      {bus.amenities.slice(0, 3).map((a, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600"
                        >
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                    <span className="text-emerald-800 font-medium">
                      🛡️ {bus.cancellationPolicy}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
