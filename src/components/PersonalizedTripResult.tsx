import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  MapPin,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Hotel,
  Plane,
  Check,
  Share2,
} from 'lucide-react';
import { TripPlan, PremiumExperience } from '../types/travel';
import { STAYS_DATA, PREMIUM_EXPERIENCES, ACTIVITIES_DATA } from '../data/travelData';
import { WeatherForecastCard } from './WeatherForecastCard';
import { PreTripChecklist } from './PreTripChecklist';

interface PersonalizedTripResultProps {
  tripPlan: TripPlan;
  onUpdateTripPlan: (updated: TripPlan) => void;
  onProceedToBooking: () => void;
  onOpenStaySelector: () => void;
  onOpenFlightSelector: () => void;
  onOpenShare?: () => void;
}

export const PersonalizedTripResult: React.FC<PersonalizedTripResultProps> = ({
  tripPlan,
  onUpdateTripPlan,
  onProceedToBooking,
  onOpenStaySelector,
  onOpenFlightSelector,
  onOpenShare,
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'itinerary' | 'checklist' | 'weather'>(
    'all'
  );
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isAiModifying, setIsAiModifying] = useState<boolean>(false);
  const [showAddExperienceTray, setShowAddExperienceTray] = useState<boolean>(false);

  // AI Prompt Modifiers quick triggers
  const handleApplyAiModifier = (promptType: string) => {
    setIsAiModifying(true);
    setTimeout(() => {
      const updatedVibes = [...tripPlan.vibes];
      let updatedDays = [...tripPlan.days];
      const updatedPrem = [...tripPlan.selectedPremium];

      if (promptType === 'romantic') {
        if (!updatedVibes.includes('Romantic')) updatedVibes.push('Romantic');
        // Add romantic experience if not present
        const romanticExp = PREMIUM_EXPERIENCES.find((p) => p.category === 'Romantic');
        if (romanticExp && !updatedPrem.some((p) => p.id === romanticExp.id)) {
          updatedPrem.push(romanticExp);
        }
        // Enhance day 3 with romantic dinner note
        updatedDays = updatedDays.map((d) => {
          if (d.dayNumber === 3) {
            return {
              ...d,
              summary:
                'Special romantic focus: Sunset cliffside dinner with acoustic serenades and champagne.',
            };
          }
          return d;
        });
      } else if (promptType === 'adventure') {
        if (!updatedVibes.includes('Adventure')) updatedVibes.push('Adventure');
        const advAct = ACTIVITIES_DATA.find((a) => a.category === 'Adventure');
        if (advAct) {
          updatedDays = updatedDays.map((d) => {
            if (d.dayNumber === 2) {
              return {
                ...d,
                summary:
                  'High-adrenaline upgrade: 4x4 off-road jungle expedition & canyon gorge river jump.',
              };
            }
            return d;
          });
        }
      } else if (promptType === 'relaxing') {
        updatedDays = updatedDays.map((d) => ({
          ...d,
          summary: `${d.summary} (Paced with late morning sleep-ins & serene spa intervals)`,
        }));
      }

      onUpdateTripPlan({
        ...tripPlan,
        vibes: updatedVibes,
        selectedPremium: updatedPrem,
        days: updatedDays,
      });

      setIsAiModifying(false);
      setAiPromptInput('');
    }, 700);
  };

  const handleUpgradeStay = () => {
    // Switch to Luxury Resort if currently boutique, or vice versa
    const luxuryStay = STAYS_DATA.find(
      (s) => s.destinationId === tripPlan.destination.id && s.luxuryTier
    );
    if (luxuryStay) {
      onUpdateTripPlan({
        ...tripPlan,
        selectedStay: luxuryStay,
      });
    } else {
      onOpenStaySelector();
    }
  };

  const handleTogglePremium = (prem: PremiumExperience) => {
    const exists = tripPlan.selectedPremium.some((p) => p.id === prem.id);
    let updated;
    if (exists) {
      updated = tripPlan.selectedPremium.filter((p) => p.id !== prem.id);
    } else {
      updated = [...tripPlan.selectedPremium, prem];
    }
    onUpdateTripPlan({
      ...tripPlan,
      selectedPremium: updated,
    });
  };

  return (
    <section
      id="personalized-trip"
      className="py-16 sm:py-24 bg-[#FDFCFB] border-y border-stone-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Dynamic Synthesis Complete
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-4">
            Your trip,{' '}
            <span className="font-editorial italic font-normal text-stone-600">
              designed around you
            </span>
            .
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 px-4 sm:px-6 py-2 rounded-full border border-stone-200/80 shadow-2xs">
              <span className="font-serif font-bold text-stone-900">
                {tripPlan.destination.name}
              </span>
              <span className="text-stone-300">•</span>
              <span>{tripPlan.durationDays} Days</span>
              <span className="text-stone-300">•</span>
              <span className="capitalize">{tripPlan.companion}</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#E05A47] font-bold">
                ₹{tripPlan.totalPrice.toLocaleString('en-IN')}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" /> ≤ ₹{tripPlan.budget.toLocaleString('en-IN')} Budget
              </span>
            </div>

            {onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer select-none active:scale-98"
                title="Share this itinerary with travel companions"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Itinerary</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Itinerary Quick-Action Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 mb-10 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Quick Prompt Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.18em] mr-1">
                Refine Vibe:
              </span>
              <button
                onClick={() => handleApplyAiModifier('romantic')}
                disabled={isAiModifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50/80 hover:bg-rose-50 border border-stone-200/80 hover:border-rose-300 text-xs font-medium text-stone-800 hover:text-rose-700 transition-all cursor-pointer shadow-2xs"
              >
                <span>❤️ Make it more romantic</span>
              </button>

              <button
                onClick={() => handleApplyAiModifier('adventure')}
                disabled={isAiModifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50/80 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-xs font-medium text-stone-800 hover:text-amber-700 transition-all cursor-pointer shadow-2xs"
              >
                <span>🏔️ Add more adventure</span>
              </button>

              <button
                onClick={() => handleApplyAiModifier('relaxing')}
                disabled={isAiModifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50/80 hover:bg-emerald-50 border border-stone-200/80 hover:border-emerald-300 text-xs font-medium text-stone-800 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              >
                <span>🥥 Slower & chill pace</span>
              </button>
            </div>

            {/* Custom AI Prompt Input */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && aiPromptInput.trim()) {
                      handleApplyAiModifier(aiPromptInput.trim());
                    }
                  }}
                  placeholder="e.g. Add a sunset yacht cruise on Day 4..."
                  className="w-full bg-[#FAF8F5] text-xs text-stone-900 px-4 py-2.5 rounded-full border border-stone-200/80 focus:outline-none focus:border-[#E05A47] pr-16"
                />
                <button
                  onClick={() =>
                    aiPromptInput.trim() && handleApplyAiModifier(aiPromptInput.trim())
                  }
                  disabled={!aiPromptInput.trim() || isAiModifying}
                  className="absolute right-1 top-1 bottom-1 px-3.5 bg-stone-900 hover:bg-[#E05A47] disabled:opacity-40 text-white text-[11px] font-medium rounded-full transition-all flex items-center justify-center cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Additional Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-4 border-t border-stone-100">
            <button
              onClick={handleUpgradeStay}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-50/70 border border-stone-200/80 text-xs font-medium text-stone-800 hover:bg-stone-100 hover:border-stone-300 transition-all shadow-2xs cursor-pointer"
            >
              <Hotel className="w-3.5 h-3.5 text-[#E05A47]" />
              <span>
                {tripPlan.selectedStay.luxuryTier
                  ? 'Stay: Luxury Suite (Active)'
                  : 'Upgrade stay to 5-Star'}
              </span>
            </button>

            <button
              onClick={() => setShowAddExperienceTray(!showAddExperienceTray)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-50/70 border border-stone-200/80 text-xs font-medium text-stone-800 hover:bg-stone-100 hover:border-stone-300 transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Add premium experiences ({tripPlan.selectedPremium.length})</span>
            </button>

            <button
              onClick={onOpenFlightSelector}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-50/70 border border-stone-200/80 text-xs font-medium text-stone-800 hover:bg-stone-100 hover:border-stone-300 transition-all shadow-2xs cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5 text-stone-600" />
              <span>
                {tripPlan.selectedTransitMode === 'train' && tripPlan.selectedTrain
                  ? `Train: ${tripPlan.selectedTrain.trainName}`
                  : tripPlan.selectedTransitMode === 'bus' && tripPlan.selectedBus
                    ? `Bus: ${tripPlan.selectedBus.operator}`
                    : tripPlan.selectedTransitMode === 'cab' && tripPlan.selectedCab
                      ? `Cab: ${tripPlan.selectedCab.vehicleName}`
                      : `Transit: ${tripPlan.selectedFlight.airline}`}
              </span>
            </button>

            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all shadow-2xs cursor-pointer ml-auto"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share & Invite Group</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl mb-8 max-w-fit overflow-x-auto border border-stone-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveViewTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeViewTab === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌟 Complete Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewTab === 'checklist'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🎒 Pre-Trip Checklist</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Packing & Gear
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('itinerary')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeViewTab === 'itinerary'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📅 Itinerary Timeline ({tripPlan.durationDays}D)
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('weather')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeViewTab === 'weather'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ☀️ Weather & Climate
          </button>
        </div>

        {/* Experience Add-on Tray Drawer (when open) */}
        {showAddExperienceTray && (
          <div className="mb-10 bg-[#FAF8F5] p-6 rounded-3xl border border-stone-200/90 transition-all animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-serif font-bold text-stone-900">
                  Select Unforgettable Experiences
                </h4>
                <p className="text-xs text-stone-500 font-light">
                  Curated touchpoints that elevate an ordinary holiday into a lifelong memory.
                </p>
              </div>
              <button
                onClick={() => setShowAddExperienceTray(false)}
                className="text-xs font-medium text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PREMIUM_EXPERIENCES.map((prem) => {
                const isSelected = tripPlan.selectedPremium.some((p) => p.id === prem.id);
                return (
                  <div
                    key={prem.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-[#E05A47] shadow-2xs ring-1 ring-[#E05A47]/30'
                        : 'bg-white/80 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{prem.icon}</span>
                        <span className="text-xs font-bold text-stone-900">
                          +₹{prem.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h5 className="text-xs font-serif font-bold text-stone-900 mb-1">
                        {prem.title}
                      </h5>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mb-3 font-light">
                        {prem.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePremium(prem)}
                      className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E05A47] text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isSelected ? '✓ Included in Trip' : '+ Add to Trip'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pre-Trip Checklist (Shown in All or Checklist tab) */}
        {(activeViewTab === 'all' || activeViewTab === 'checklist') && (
          <PreTripChecklist tripPlan={tripPlan} />
        )}

        {/* Weather Forecast Card for Planned Dates (Shown in All or Weather tab) */}
        {(activeViewTab === 'all' || activeViewTab === 'weather') && (
          <WeatherForecastCard
            destination={tripPlan.destination}
            durationDays={tripPlan.durationDays}
            startDate={tripPlan.startDate}
            endDate={tripPlan.endDate}
          />
        )}

        {/* Day-by-Day Timeline Layout (Shown in All or Itinerary tab) */}
        {(activeViewTab === 'all' || activeViewTab === 'itinerary') && (
          <div className="space-y-4">
            {tripPlan.days.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden transition-all duration-200 hover:border-stone-300 shadow-2xs"
                >
                  {/* Day Header Accordion Toggle */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-2xs shrink-0">
                        <span className="text-[9px] font-semibold uppercase text-[#E05A47] tracking-[0.18em]">
                          DAY
                        </span>
                        <span className="text-lg font-serif font-bold text-stone-900 leading-tight">
                          0{day.dayNumber}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                            {day.dayTitle}
                          </h3>
                          {day.dateStr && (
                            <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[11px] font-medium border border-stone-200/70">
                              {day.dateStr}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-500 line-clamp-1 mt-0.5 font-light">
                          {day.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-stone-400 hidden sm:inline">
                        {day.activities.length} items
                      </span>
                      <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-600">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Day Activities Expansion */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-[#FCFBF9]">
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-stone-200">
                        {day.activities.map((act, index) => (
                          <div key={act.id || index} className="relative flex items-start gap-4">
                            {/* Timeline Pin Dot */}
                            <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#E05A47] flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-[#E05A47]" />
                            </div>

                            <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-base shrink-0 shadow-2xs">
                              {act.icon}
                            </div>

                            <div className="flex-1 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-serif font-bold text-stone-900">
                                    {act.title}
                                  </span>
                                  {act.type === 'experience' && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-medium border border-rose-200/80">
                                      Curated
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-stone-400" />
                                  {act.time}
                                </span>
                              </div>

                              {act.location && (
                                <div className="text-[11px] font-light text-stone-500 flex items-center gap-1 mb-1.5">
                                  <MapPin className="w-3 h-3 text-stone-400" />
                                  <span>{act.location}</span>
                                </div>
                              )}

                              {act.notes && (
                                <p className="text-xs text-stone-600 font-light leading-relaxed">
                                  {act.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Booking CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-stone-900 text-stone-50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#E05A47] block mb-1">
              Ready to Wander?
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              One unified checkout for your entire trip.
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-light">
              Zero tab switching. Flights, verified villa, private transport & VIP tours locked
              together.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto shrink-0">
            {onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-medium text-xs sm:text-sm border border-stone-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#E05A47]" />
                <span>Share Plan</span>
              </button>
            )}
            <button
              onClick={onProceedToBooking}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#E05A47] hover:bg-[#C84B31] text-white font-medium text-sm sm:text-base shadow-md shadow-[#E05A47]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Review & Book Entire Trip</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
