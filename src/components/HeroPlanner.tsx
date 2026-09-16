import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  User,
  Users,
  MapPin,
  Clock,
  Compass,
  Check,
  ChevronDown,
  Coins,
  Flame,
  Sliders,
  Plane,
  Train,
  Bus,
  Car,
} from 'lucide-react';
import { CompanionType, VibeType, BudgetTier, DurationOption } from '../types/travel';
import { POPULAR_ORIGINS, DESTINATIONS } from '../data/travelData';
import { WandrLogo } from './WandrLogo';

interface HeroPlannerProps {
  onDesignTrip: (data: {
    companion: CompanionType;
    vibes: VibeType[];
    budgetTier: BudgetTier;
    customBudget?: number;
    duration: DurationOption;
    destinationId?: string;
    originCity: string;
  }) => void;
  onExploreClick: () => void;
}

export const HeroPlanner: React.FC<HeroPlannerProps> = ({ onDesignTrip, onExploreClick }) => {
  // State for AI Planner
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType>('couple');
  const [selectedVibes, setSelectedVibes] = useState<VibeType[]>(['Romantic', 'Adventure']);
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('100k');
  const [customBudget, setCustomBudget] = useState<number>(120000);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>('7');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Delhi (DEL)');
  const [selectedDestId, setSelectedDestId] = useState<string>('bali');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const companions: { type: CompanionType; label: string; icon: string }[] = [
    { type: 'couple', label: 'Couple', icon: '❤️' },
    { type: 'solo', label: 'Solo', icon: '🧍' },
    { type: 'friends', label: 'Friends', icon: '👯' },
    { type: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  ];

  const vibesList: { name: VibeType; icon: string; desc: string }[] = [
    { name: 'Romantic', icon: '🌹', desc: 'Sunset cliffs, candlelight, slow mornings' },
    { name: 'Adventure', icon: '🏔️', desc: 'Volcano jeeps, surf, diving, trails' },
    { name: 'Relaxing', icon: '🥥', desc: 'Private spas, lagoon pools, ocean breeze' },
    { name: 'Luxury', icon: '✨', desc: '5-star suites, private butler, fine dining' },
    { name: 'Party', icon: '🍸', desc: 'Beach clubs, sunset DJs, rooftop mixology' },
    { name: 'Nature', icon: '🌿', desc: 'Rainforest villas, waterfalls, wildlife' },
    { name: 'Food', icon: '🍜', desc: 'Street food night walks, chef masterclasses' },
    { name: 'Culture', icon: '🏮', desc: 'Ancient temples, artisan quarters, heritage' },
  ];

  const durations: { value: DurationOption; label: string }[] = [
    { value: '3', label: '3 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '7 days' },
    { value: '10+', label: '10+ days' },
  ];

  const budgetOptions: { value: BudgetTier; label: string; desc: string }[] = [
    { value: '50k', label: '₹50K', desc: 'Boutique stays & smart flights' },
    { value: '100k', label: '₹1L', desc: 'Curated villas & prime experiences' },
    { value: '200k', label: '₹2L+', desc: 'Luxury ocean suites & private cars' },
    { value: 'custom', label: 'Custom', desc: 'Specify exact amount' },
  ];

  const toggleVibe = (vibe: VibeType) => {
    if (selectedVibes.includes(vibe)) {
      if (selectedVibes.length > 1) {
        setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
      }
    } else {
      if (selectedVibes.length < 3) {
        setSelectedVibes([...selectedVibes, vibe]);
      } else {
        setSelectedVibes([...selectedVibes.slice(1), vibe]);
      }
    }
  };

  const handleDesignSubmit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onDesignTrip({
        companion: selectedCompanion,
        vibes: selectedVibes,
        budgetTier: selectedBudget,
        customBudget: selectedBudget === 'custom' ? customBudget : undefined,
        duration: selectedDuration,
        destinationId: selectedDestId,
        originCity: selectedOrigin,
      });
      setIsGenerating(false);
    }, 900);
  };

  // Find best match destination preview
  const matchedDest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Hero Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85"
          alt="Wandr Cinematic Destination"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Subtle Dark Gradient Overlay to ensure crisp contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FAFAF9]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <div className="max-w-3xl pt-8 pb-10 sm:pt-12 sm:pb-14 text-white">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181E24]/80 backdrop-blur-md border border-white/20 text-stone-200 text-[11px] font-medium uppercase tracking-[0.2em] mb-6 shadow-md">
            <WandrLogo size="xs" variant="icon-only" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse"></span>
            <span>wandr AI Travel Experience Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.12] mb-6">
            Your next trip starts with a{' '}
            <span className="font-editorial italic text-stone-100">vibe</span>.
          </h1>

          <p className="text-base sm:text-lg text-stone-200/90 font-light leading-relaxed max-w-2xl mb-8">
            Tell Wandr who you're traveling with, what you want to feel, and your budget. We'll
            design the journey.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                const el = document.getElementById('ai-planner-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#E05A47] hover:bg-[#C84B31] text-white font-medium text-sm sm:text-base shadow-lg shadow-[#E05A47]/20 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Plan my trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-medium text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-stone-300" />
              <span>Explore destinations</span>
            </button>
          </div>
        </div>

        {/* Floating AI Trip Planner Card */}
        <div
          id="ai-planner-card"
          className="mt-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_32px_-8px_rgba(28,25,23,0.08)] transition-all"
        >
          {/* Planner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200/70 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E05A47]/10 text-[#E05A47] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  Where should we take you?
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light">
                  Dynamic itinerary engine • Flights, stays, transfers & curated experiences
                </p>
              </div>
            </div>

            {/* Quick Origin & Preset Destination Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700">
                <Plane className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500">Flying from:</span>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
                >
                  {POPULAR_ORIGINS.map((o) => (
                    <option key={o.code} value={`${o.city} (${o.code})`}>
                      {o.city} ({o.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-[#E05A47]" />
                <span className="text-stone-500">Destination:</span>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4 Interactive AI Planner Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-stone-200/70">
            {/* Step 1: Who are you travelling with? */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                  1. Who are you with?
                </label>
                <span className="text-[11px] font-medium text-[#E05A47] capitalize">
                  {selectedCompanion}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {companions.map((comp) => {
                  const isSelected = selectedCompanion === comp.type;
                  return (
                    <button
                      key={comp.type}
                      type="button"
                      onClick={() => setSelectedCompanion(comp.type)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-2xs font-semibold'
                          : 'bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                      }`}
                    >
                      <span className="text-base">{comp.icon}</span>
                      <span>{comp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: What's the vibe? */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                  2. What's the vibe?
                </label>
                <span className="text-[11px] font-medium text-stone-400">
                  Pick 1–3 ({selectedVibes.length}/3)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                {vibesList.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe.name);
                  return (
                    <button
                      key={vibe.name}
                      type="button"
                      onClick={() => toggleVibe(vibe.name)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E05A47]/10 border-[#E05A47] text-[#E05A47] font-semibold'
                          : 'bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{vibe.icon}</span>
                        <span className="truncate">{vibe.name}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: What's your budget? */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                  3. What's your budget?
                </label>
                <span className="text-[11px] font-medium text-stone-400">Per person</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {budgetOptions.map((b) => {
                  const isSelected = selectedBudget === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setSelectedBudget(b.value)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-2xs font-semibold'
                          : 'bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                      }`}
                    >
                      <div className="font-semibold text-xs">{b.label}</div>
                      <div
                        className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}
                      >
                        {b.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedBudget === 'custom' && (
                <div className="mt-2 flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                  <span className="text-xs font-semibold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(Number(e.target.value))}
                    step="5000"
                    min="25000"
                    max="1000000"
                    className="w-full text-xs font-semibold text-stone-900 bg-transparent focus:outline-none"
                    placeholder="Enter amount"
                  />
                </div>
              )}
            </div>

            {/* Step 4: How long? */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                  4. How long?
                </label>
                <span className="text-[11px] font-medium text-stone-400">Ideal duration</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((d) => {
                  const isSelected = selectedDuration === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDuration(d.value)}
                      className={`flex items-center justify-center p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-2xs font-semibold'
                          : 'bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Match Preview & Final CTA */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-200/80">
                <img
                  src={matchedDest.coverImage}
                  alt={matchedDest.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-serif font-bold text-stone-900">
                    {matchedDest.name}, {matchedDest.country}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-medium">
                    {matchedDest.budgetFit}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                  <span>Match Score: 98%</span>
                  <span>•</span>
                  <span>{selectedVibes.join(' + ')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDesignSubmit}
              disabled={isGenerating}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#E05A47] hover:bg-[#C84B31] active:scale-98 text-white font-medium text-sm sm:text-base shadow-md shadow-[#E05A47]/20 transition-all flex items-center justify-center gap-2.5 group cursor-pointer disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing your journey...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Design my trip</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Travel Mode Shortcuts */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="text-stone-400 font-medium hidden sm:inline mr-1">Direct Booking:</span>
          <button
            onClick={() => {
              const el = document.getElementById('travel-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-stone-200/80 text-stone-700 hover:border-stone-400 hover:text-stone-900 shadow-2xs transition-all cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5 text-[#E05A47]" />
            <span className="font-medium">Flights</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('travel-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-stone-200/80 text-stone-700 hover:border-stone-400 hover:text-stone-900 shadow-2xs transition-all cursor-pointer"
          >
            <Train className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-medium">Trains & Vande Bharat</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('travel-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-stone-200/80 text-stone-700 hover:border-stone-400 hover:text-stone-900 shadow-2xs transition-all cursor-pointer"
          >
            <Bus className="w-3.5 h-3.5 text-amber-800" />
            <span className="font-medium">Buses</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('travel-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-stone-200/80 text-stone-700 hover:border-stone-400 hover:text-stone-900 shadow-2xs transition-all cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-stone-800" />
            <span className="font-medium">Cabs & Transfers</span>
          </button>
        </div>
      </div>
    </section>
  );
};
