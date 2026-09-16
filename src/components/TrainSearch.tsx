import React, { useState } from 'react';
import { Train, Calendar, Users, Search, Check, Filter } from 'lucide-react';
import { TrainOption, TrainClassOption } from '../types/travel';
import { TRAINS_DATA, POPULAR_TRAIN_STATIONS } from '../data/travelData';

interface TrainSearchProps {
  onSelectTrain: (train: TrainOption, selectedClass?: TrainClassOption) => void;
  selectedTrainId?: string;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({ onSelectTrain, selectedTrainId }) => {
  const [fromStation, setFromStation] = useState<string>('New Delhi (NDLS)');
  const [toStation, setToStation] = useState<string>('Varanasi Junction (BSB)');
  const [journeyDate, setJourneyDate] = useState<string>('2026-10-14');
  const [passengers, setPassengers] = useState<number>(2);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [trainTypeFilter, setTrainTypeFilter] = useState<string>('ALL');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedClassPerTrain, setSelectedClassPerTrain] = useState<
    Record<string, TrainClassOption>
  >({});

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  // Filter trains
  const filteredTrains = TRAINS_DATA.filter((train) => {
    if (trainTypeFilter !== 'ALL' && train.trainType !== trainTypeFilter) return false;
    if (selectedClassFilter !== 'ALL') {
      const hasClass = train.classes.some((c) => c.classType === selectedClassFilter);
      if (!hasClass) return false;
    }
    return true;
  });

  const handleSelectTrainWithClass = (train: TrainOption) => {
    const chosenClass = selectedClassPerTrain[train.id] || train.classes[0];
    onSelectTrain(train, chosenClass);
  };

  return (
    <section id="train-search" className="py-8 sm:py-12 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto">
        {/* Section Intro */}
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
            <Train className="w-3.5 h-3.5 text-emerald-700" />
            Vande Bharat & Rail Network
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            High-speed scenic railways with confirmed seats.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Real-time availability, confirmed berth predictions, onboard meals, and zero
            cancellation penalty.
          </p>
        </div>

        {/* Clean, Focused Train Search Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {/* 1. From Station / City */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                From Station / City
              </label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                {POPULAR_TRAIN_STATIONS.map((s) => (
                  <option key={s.code} value={`${s.station} (${s.code})`}>
                    {s.station} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. To Station / City */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                To Station / City
              </label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                {POPULAR_TRAIN_STATIONS.map((s) => (
                  <option key={`to-${s.code}`} value={`${s.station} (${s.code})`}>
                    {s.station} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Journey Date */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Journey Date
              </label>
              <div className="flex items-center gap-1.5 text-xs font-medium text-stone-900">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>

            {/* 4. Passengers */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Passengers
              </label>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                  className="w-full bg-transparent text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                  <option value={6}>6+ Group</option>
                </select>
              </div>
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
                    <span>Search Trains</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Class:
              </span>
              {[
                { id: 'ALL', label: 'All Classes' },
                { id: 'EC', label: 'Vande Bharat EC' },
                { id: 'CC', label: 'AC Chair Car' },
                { id: '1A', label: '1A First AC' },
                { id: '2A', label: '2A 2-Tier' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClassFilter(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedClassFilter === c.id
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">Type:</span>
              <select
                value={trainTypeFilter}
                onChange={(e) => setTrainTypeFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium focus:outline-none cursor-pointer border border-stone-200"
              >
                <option value="ALL">All Trains</option>
                <option value="Vande Bharat">Vande Bharat</option>
                <option value="Rajdhani">Rajdhani Express</option>
                <option value="Shatabdi">Shatabdi Express</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        {filteredTrains.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Train className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-stone-900 mb-1">
              No trains match your filters
            </h4>
            <p className="text-xs text-stone-500 font-light max-w-md mx-auto mb-4">
              Try selecting "All Classes" or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedClassFilter('ALL');
                setTrainTypeFilter('ALL');
              }}
              className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-[#E05A47] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrains.map((train) => {
              const isSelected = selectedTrainId === train.id;
              const activeClass = selectedClassPerTrain[train.id] || train.classes[0];

              return (
                <div
                  key={train.id}
                  className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E05A47] ring-2 ring-[#E05A47]/20 shadow-md'
                      : 'border-stone-200/90 hover:border-stone-400 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Train Brand & Timings */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="font-serif font-bold text-base sm:text-lg text-stone-900">
                          {train.trainName}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono font-semibold">
                          #{train.trainNumber}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            train.trainType === 'Vande Bharat'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {train.trainType}
                        </span>
                        {train.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                            {train.badge}
                          </span>
                        )}
                      </div>

                      {/* Timings Strip */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center max-w-lg mb-4">
                        <div>
                          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                            {train.departTime}
                          </div>
                          <div className="text-xs text-stone-500 font-light truncate">
                            {train.fromStation}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[11px] text-stone-400 font-medium mb-1">
                            {train.duration}
                          </span>
                          <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full border-2 border-emerald-600 bg-white shrink-0" />
                            <div className="flex-1 border-t border-dashed border-stone-300" />
                            <Train className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <div className="flex-1 border-t border-dashed border-stone-300" />
                            <div className="w-2 h-2 rounded-full bg-stone-900 shrink-0" />
                          </div>
                          <span className="text-[10px] text-emerald-700 font-medium mt-1">
                            {train.punctualityScore} on-time
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                            {train.arriveTime}
                          </div>
                          <div className="text-xs text-stone-500 font-light truncate">
                            {train.toStation}
                          </div>
                        </div>
                      </div>

                      {/* Amenities Row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-light">
                        {train.amenities.map((am, i) => (
                          <span key={i} className="inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Classes Selector & Action */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 shrink-0">
                      {/* Class Options Carousel */}
                      <div className="flex flex-wrap gap-2">
                        {train.classes.map((cls) => {
                          const isClassActive = activeClass.classType === cls.classType;

                          return (
                            <button
                              key={cls.classType}
                              onClick={() =>
                                setSelectedClassPerTrain((prev) => ({
                                  ...prev,
                                  [train.id]: cls,
                                }))
                              }
                              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer min-w-[100px] ${
                                isClassActive
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                  : 'bg-stone-50 text-stone-800 border-stone-200/90 hover:border-stone-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs">{cls.classType}</span>
                                <span
                                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                    cls.statusType === 'available'
                                      ? isClassActive
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {cls.status}
                                </span>
                              </div>
                              <div className="text-sm font-serif font-bold">
                                ₹{cls.price.toLocaleString('en-IN')}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Select CTA */}
                      <button
                        onClick={() => handleSelectTrainWithClass(train)}
                        className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-98 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-2xs'
                        }`}
                      >
                        {isSelected ? '✓ In Itinerary' : `Select (${activeClass.classType})`}
                      </button>
                    </div>
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
