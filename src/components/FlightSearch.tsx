import React, { useState } from 'react';
import {
  Plane,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  Luggage,
  ShieldCheck,
  Check,
  Leaf,
  ChevronDown,
} from 'lucide-react';
import { FlightOption } from '../types/travel';
import { FLIGHTS_DATA, POPULAR_ORIGINS } from '../data/travelData';

interface FlightSearchProps {
  onSelectFlight: (flight: FlightOption) => void;
  selectedFlightId?: string;
}

export const FlightSearch: React.FC<FlightSearchProps> = ({ onSelectFlight, selectedFlightId }) => {
  const [fromCity, setFromCity] = useState<string>('Delhi (DEL)');
  const [toCity, setToCity] = useState<string>('Bali (DPS)');
  const [departDate, setDepartDate] = useState<string>('2026-10-12');
  const [returnDate, setReturnDate] = useState<string>('2026-10-18');
  const [travellers, setTravellers] = useState<string>('2 Travellers');
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>(
    'Economy'
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <section id="flight-search" className="py-8 sm:py-12 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
            <Plane className="w-3.5 h-3.5" />
            Seamless Sky Search
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Transparent flights. Zero hidden charges.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Direct airline connectivity with guaranteed baggage, priority boarding, and full carbon
            offset insights.
          </p>
        </div>

        {/* Flight Search Usability Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {/* From */}
            <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                From (Origin)
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                {POPULAR_ORIGINS.map((o) => (
                  <option key={o.code} value={`${o.city} (${o.code})`}>
                    {o.city} ({o.code})
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                To (Destination)
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="Bali (DPS)">Bali (DPS)</option>
                <option value="Hanoi (HAN)">Hanoi, Vietnam (HAN)</option>
                <option value="Srinagar (SXR)">Srinagar, Kashmir (SXR)</option>
                <option value="Tokyo (NRT)">Tokyo, Japan (NRT)</option>
                <option value="Naples (NAP)">Naples, Amalfi (NAP)</option>
                <option value="Goa (GOI)">Goa (GOI)</option>
              </select>
            </div>

            {/* Dates */}
            <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Dates (Roundtrip)
              </label>
              <div className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Oct 12 – Oct 18</span>
              </div>
            </div>

            {/* Travellers & Cabin */}
            <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Cabin & Travellers
              </label>
              <div className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>2 Travellers • {cabinClass}</span>
              </div>
            </div>

            {/* Search CTA */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-[#E05A47] text-white font-medium text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Search Flights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Flight Results List */}
        <div className="space-y-4">
          {FLIGHTS_DATA.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            return (
              <div
                key={flight.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-md'
                    : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Airline & Route Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    {/* Airline Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center text-2xl font-bold">
                        {flight.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-serif font-bold text-stone-900">
                            {flight.airline}
                          </h4>
                          {flight.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                flight.badge === 'Cheapest'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                  : flight.badge === 'Fastest'
                                    ? 'bg-stone-100 text-stone-800 border border-stone-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                              }`}
                            >
                              {flight.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-500 font-light">
                          Flight {flight.flightNumber} • {flight.cabin}
                        </span>
                      </div>
                    </div>

                    {/* Flight Schedule Timeline */}
                    <div className="flex items-center gap-6 sm:gap-8">
                      {/* Depart */}
                      <div>
                        <span className="text-lg font-serif font-bold text-stone-900 block">
                          {flight.departTime}
                        </span>
                        <span className="text-xs font-medium text-stone-500">
                          {flight.fromCode}
                        </span>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="flex flex-col items-center min-w-28 sm:min-w-36">
                        <span className="text-[11px] font-medium text-stone-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {flight.duration}
                        </span>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="w-full h-px bg-stone-200"></div>
                          <Plane className="w-3.5 h-3.5 text-[#E05A47] absolute bg-white px-0.5" />
                        </div>
                        <span className="text-[10px] text-stone-400 font-light mt-1">
                          {flight.stops}
                        </span>
                      </div>

                      {/* Arrive */}
                      <div>
                        <span className="text-lg font-serif font-bold text-stone-900 block">
                          {flight.arriveTime}
                        </span>
                        <span className="text-xs font-medium text-stone-500">{flight.toCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flight Baggage & Price */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] font-light text-stone-500 flex items-center lg:justify-end gap-1 mb-0.5">
                        <Luggage className="w-3.5 h-3.5 text-stone-400" />
                        <span>{flight.baggage}</span>
                      </div>
                      <div className="text-xl font-bold text-stone-900">
                        ₹{flight.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-stone-400 font-light">
                        per person (taxes included)
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectFlight(flight)}
                      className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                      }`}
                    >
                      {isSelected ? '✓ In Itinerary' : 'Select Flight'}
                    </button>
                  </div>
                </div>

                {/* Eco / Emissions Note */}
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-light">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{flight.emission}</span>
                  </span>
                  <span className="text-emerald-800 font-medium">100% Free Seat Selection</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
