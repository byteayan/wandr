import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Plane,
  Train,
  Bus,
  Car,
  Hotel,
  Ticket,
  CheckCircle2,
  TrendingDown,
  Tag,
  ShieldCheck,
  Check,
  Coins,
  ArrowLeftRight,
  RefreshCw,
  Globe2,
  Info,
  Share2,
} from 'lucide-react';
import { TripPlan, UserProfile } from '../types/travel';
import { calculateTripTotal } from '../utils/tripPlannerEngine';
import {
  SUPPORTED_CURRENCIES,
  CurrencyConfig,
  DEFAULT_INR_RATES,
  getDestinationCurrency,
  convertInrTo,
  formatWithCurrency,
  fetchLiveExchangeRates,
} from '../utils/currencyConverter';

interface FloatingTripSummaryProps {
  tripPlan: TripPlan;
  userProfile?: UserProfile;
  onViewItinerary: () => void;
  onProceedToBooking: () => void;
  onCustomizeClick: () => void;
  onOpenShare?: () => void;
}

export const FloatingTripSummary: React.FC<FloatingTripSummaryProps> = ({
  tripPlan,
  userProfile,
  onViewItinerary,
  onProceedToBooking,
  onCustomizeClick,
  onOpenShare,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Currency Conversion state
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('INR');
  const [liveRates, setLiveRates] = useState<Record<string, number>>(DEFAULT_INR_RATES);
  const [lastRateUpdate, setLastRateUpdate] = useState<string>('Live Mid-Market');
  const [isFetchingRates, setIsFetchingRates] = useState<boolean>(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track scroll position to show floating badge smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;
    const loadRates = async () => {
      setIsFetchingRates(true);
      try {
        const data = await fetchLiveExchangeRates();
        if (isMounted) {
          setLiveRates(data.rates);
          setLastRateUpdate(data.lastUpdated);
        }
      } catch (err) {
        // Fallback already set
      } finally {
        if (isMounted) setIsFetchingRates(false);
      }
    };
    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close currency dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasPlannedTrip = !!(tripPlan && tripPlan.destination && !isDismissed);

  // Auto-detect Destination Local Currency
  const destCurrency: CurrencyConfig = tripPlan?.destination
    ? getDestinationCurrency(tripPlan.destination.country, tripPlan.destination.name)
    : SUPPORTED_CURRENCIES.INR;

  const isDestCurrencyDifferent = destCurrency.code !== 'INR';

  // Manual refresh exchange rates handler
  const handleRefreshRates = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFetchingRates(true);
    const data = await fetchLiveExchangeRates();
    setLiveRates(data.rates);
    setLastRateUpdate(data.lastUpdated);
    setTimeout(() => setIsFetchingRates(false), 500);
  };

  // Fast toggle between Home (INR) and Destination Local Currency
  const handleQuickToggleCurrency = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedCurrencyCode === 'INR') {
      setSelectedCurrencyCode(destCurrency.code);
    } else {
      setSelectedCurrencyCode('INR');
    }
  };

  // Calculate live total in INR base with budget enforcement
  const costs = tripPlan?.destination
    ? calculateTripTotal(
        tripPlan.selectedFlight,
        tripPlan.selectedStay,
        tripPlan.durationDays,
        tripPlan.selectedActivities,
        tripPlan.selectedPremium,
        tripPlan.privateTransportIncluded,
        tripPlan.transportCost,
        tripPlan.budget
      )
    : {
        grandTotal: 0,
        flightCost: 0,
        stayCost: 0,
        activitiesCost: 0,
        transportCost: 0,
        experiencesCost: 0,
        subtotal: 0,
        taxes: 0,
        rawTotal: 0,
        budgetDiscount: 0,
        budgetCap: 0,
        isUnderBudget: true,
        savingsVsBudget: 0,
      };

  // AI Optimization Savings Calculation vs Standard Retail Prices
  const retailFlightCost = Math.round(costs.flightCost * 1.15) + 650;
  const retailStayCost = Math.round(costs.stayCost * 1.22);
  const retailActivitiesCost = Math.round(costs.activitiesCost * 1.18);
  const retailTransportCost = Math.round(costs.transportCost * 1.2);
  const retailConvenienceFees = 1450;

  const standardRetailTotal =
    retailFlightCost +
    retailStayCost +
    retailActivitiesCost +
    retailTransportCost +
    retailConvenienceFees +
    costs.experiencesCost;

  const totalSavings = Math.max(1200, standardRetailTotal - costs.grandTotal);
  const savingsPercent = Math.round((totalSavings / Math.max(1, standardRetailTotal)) * 100);

  // Transit mode display
  const transitLabel =
    tripPlan?.selectedTransitMode === 'train' && tripPlan.selectedTrain
      ? `Train: ${tripPlan.selectedTrain.trainName}`
      : tripPlan?.selectedTransitMode === 'bus' && tripPlan.selectedBus
      ? `Bus: ${tripPlan.selectedBus.operator}`
      : tripPlan?.selectedTransitMode === 'cab' && tripPlan.selectedCab
      ? `Cab: ${tripPlan.selectedCab.vehicleName}`
      : tripPlan?.selectedFlight
      ? `Flight: ${tripPlan.selectedFlight.airline}`
      : 'Transit: Direct Route';

  const TransitIcon =
    tripPlan?.selectedTransitMode === 'train'
      ? Train
      : tripPlan?.selectedTransitMode === 'bus'
      ? Bus
      : tripPlan?.selectedTransitMode === 'cab'
      ? Car
      : Plane;

  // Planning Steps calculation
  const planningSteps = tripPlan?.destination
    ? [
        {
          id: 'destination',
          label: 'Destination',
          completed: !!tripPlan.destination,
          icon: MapPin,
          detail: tripPlan.destination?.name || 'Not selected',
        },
        {
          id: 'transit',
          label: 'Transit',
          completed: !!(
            (tripPlan.selectedTransitMode === 'train' && tripPlan.selectedTrain) ||
            (tripPlan.selectedTransitMode === 'bus' && tripPlan.selectedBus) ||
            (tripPlan.selectedTransitMode === 'cab' && tripPlan.selectedCab) ||
            tripPlan.selectedFlight
          ),
          icon: TransitIcon,
          detail: transitLabel.replace(/^[^:]+:\s*/, ''),
        },
        {
          id: 'stay',
          label: 'Stay',
          completed: !!tripPlan.selectedStay,
          icon: Hotel,
          detail: tripPlan.selectedStay?.name || 'Not selected',
        },
        {
          id: 'activities',
          label: 'Activities',
          completed: tripPlan.selectedActivities && tripPlan.selectedActivities.length > 0,
          icon: Ticket,
          detail:
            tripPlan.selectedActivities?.length > 0
              ? `${tripPlan.selectedActivities.length} Experiences`
              : 'None selected',
        },
      ]
    : [];

  const completedCount = planningSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / (planningSteps.length || 1)) * 100);

  // Active currency info
  const activeCurrency = SUPPORTED_CURRENCIES[selectedCurrencyCode] || SUPPORTED_CURRENCIES.INR;

  // Compute exchange rate ratio string
  const currentRateRatio =
    selectedCurrencyCode === 'INR'
      ? isDestCurrencyDifferent
        ? `1 INR = ${(liveRates[destCurrency.code] || DEFAULT_INR_RATES[destCurrency.code] || 1).toFixed(
            destCurrency.code === 'IDR' || destCurrency.code === 'VND' ? 1 : 3
          )} ${destCurrency.code}`
        : '1 INR = ₹1.00 (Base Home Currency)'
      : `1 ${selectedCurrencyCode} = ₹${(
          1 / (liveRates[selectedCurrencyCode] || DEFAULT_INR_RATES[selectedCurrencyCode] || 1)
        ).toFixed(2)} INR`;

  return (
    <AnimatePresence mode="wait">
      {hasPlannedTrip && (
        <motion.aside
          key="floating-trip-summary"
          initial={{ opacity: 0, y: 32, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 300,
            mass: 0.7,
          }}
          aria-label="Planned trip floating summary"
          className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-30 max-w-[calc(100vw-1.5rem)] sm:max-w-sm"
        >
          {/* Animated Toggle between Pill and Full Card */}
          <AnimatePresence mode="wait" initial={false}>
            {!isExpanded ? (
              /* Collapsed Pill View */
              <motion.div
                key="summary-pill"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                role="region"
                aria-label="Planned trip quick summary"
                className="group flex items-center gap-2.5 p-2 sm:p-2.5 pl-2.5 sm:pl-3 bg-stone-900/95 text-white backdrop-blur-md rounded-full shadow-xl border border-stone-800 hover:border-stone-700 hover:bg-stone-900 transition-colors cursor-pointer select-none"
                onClick={() => setIsExpanded(true)}
              >
                {/* Destination Mini Thumbnail */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                  <img
                    src={tripPlan.destination.coverImage}
                    alt={tripPlan.destination.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-stone-900" />
                </div>

                {/* Core Info with Currency Display */}
                <div className="flex flex-col text-left pr-1 min-w-0">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-serif font-bold text-xs sm:text-sm truncate">
                      {tripPlan.destination.name}
                    </span>
                    <span className="text-[10px] text-stone-400 font-light hidden sm:inline">
                      • {tripPlan.durationDays}D
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-300 font-medium mt-0.5">
                    <span className="text-amber-400 font-bold">
                      {formatWithCurrency(costs.grandTotal, selectedCurrencyCode, liveRates)}
                    </span>

                    {/* Quick Currency Toggle Pill on Minibar */}
                    {isDestCurrencyDifferent && (
                      <button
                        type="button"
                        onClick={handleQuickToggleCurrency}
                        title={`Switch currency to ${selectedCurrencyCode === 'INR' ? destCurrency.name : 'INR'}`}
                        className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeftRight className="w-2.5 h-2.5 text-amber-400" />
                        <span>{activeCurrency.flag} {selectedCurrencyCode}</span>
                      </button>
                    )}

                    {/* Savings Badge on Collapsed Pill */}
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 hidden sm:flex items-center gap-0.5">
                      <TrendingDown className="w-2.5 h-2.5 text-emerald-400" />
                      Save {formatWithCurrency(totalSavings, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>
                </div>

                {/* Share Button on Minibar */}
                {onOpenShare && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShare();
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-[#E05A47] text-stone-200 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Share this trip plan with companions"
                    aria-label="Share trip plan"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Expand / Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors shrink-0"
                  title="Expand Trip Summary & Currency Tools"
                  aria-label="Expand Trip Summary & Currency Tools"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              /* Full Expanded Mini-Summary Card */
              <motion.div
                key="summary-card"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-2xl text-stone-900 w-[340px] sm:w-[380px] flex flex-col gap-3 max-h-[88vh] overflow-y-auto"
              >
                {/* Header with Title and Close / Collapse */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tripPlan.destination.coverImage}
                      alt={tripPlan.destination.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-1 ring-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                          {tripPlan.destination.name}
                        </h4>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#E05A47]/10 text-[#E05A47]">
                          {tripPlan.companion}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-500 font-light">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{tripPlan.destination.country}</span>
                        <span>•</span>
                        <span>{tripPlan.durationDays} Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Minimize summary"
                      aria-label="Minimize summary"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDismissed(true)}
                      className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Dismiss summary card"
                      aria-label="Dismiss summary card"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* REAL-TIME CURRENCY CONVERSION CONTROLLER */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-3 rounded-2xl border border-stone-800 shadow-sm">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Coins className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-xs text-stone-200">
                        Live Currency Converter
                      </span>
                    </div>

                    {/* Live rate update indicator with manual refresh */}
                    <button
                      type="button"
                      onClick={handleRefreshRates}
                      className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80 hover:bg-emerald-900/80 transition-colors cursor-pointer"
                      title="Refresh real-time rates"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium">{isFetchingRates ? 'Updating...' : 'Live Mid-Market'}</span>
                      <RefreshCw
                        className={`w-2.5 h-2.5 ml-0.5 ${isFetchingRates ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Toggle Selector Buttons */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-stone-800/90 rounded-xl text-[11px] font-medium mb-2">
                    {/* Home Currency: INR */}
                    <button
                      type="button"
                      onClick={() => setSelectedCurrencyCode('INR')}
                      className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedCurrencyCode === 'INR'
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                          : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                      }`}
                    >
                      <span>🇮🇳</span>
                      <span>INR (₹)</span>
                    </button>

                    {/* Destination Local Currency */}
                    <button
                      type="button"
                      onClick={() => setSelectedCurrencyCode(destCurrency.code)}
                      className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedCurrencyCode === destCurrency.code && selectedCurrencyCode !== 'INR'
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                          : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                      }`}
                    >
                      <span>{destCurrency.flag}</span>
                      <span className="truncate">
                        {destCurrency.code === 'INR' ? 'Local' : `${destCurrency.code} (${destCurrency.symbol.trim()})`}
                      </span>
                    </button>

                    {/* More Currencies Dropdown Button */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                        className={`w-full py-1.5 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedCurrencyCode !== 'INR' && selectedCurrencyCode !== destCurrency.code
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                            : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                        }`}
                      >
                        <Globe2 className="w-3 h-3" />
                        <span className="truncate">
                          {selectedCurrencyCode !== 'INR' && selectedCurrencyCode !== destCurrency.code
                            ? `${activeCurrency.flag} ${selectedCurrencyCode}`
                            : 'More'}
                        </span>
                        <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showCurrencyDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full right-0 mb-2 w-48 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-1.5 z-50 text-stone-200 max-h-48 overflow-y-auto"
                          >
                            <div className="text-[10px] font-semibold text-stone-400 px-2 py-1 uppercase tracking-wider border-b border-stone-800">
                              Global Currencies
                            </div>
                            <div className="space-y-0.5 mt-1">
                              {Object.values(SUPPORTED_CURRENCIES).map((curr) => {
                                const isCurrActive = selectedCurrencyCode === curr.code;
                                const isDest = curr.code === destCurrency.code;
                                return (
                                  <button
                                    key={curr.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCurrencyCode(curr.code);
                                      setShowCurrencyDropdown(false);
                                    }}
                                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                      isCurrActive
                                        ? 'bg-amber-500 text-stone-950 font-bold'
                                        : 'hover:bg-stone-800 text-stone-200'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span>{curr.flag}</span>
                                      <span>{curr.code}</span>
                                      <span className="text-[10px] opacity-75 font-normal">
                                        ({curr.symbol.trim()})
                                      </span>
                                    </span>
                                    {isDest && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-800 text-amber-300 font-medium">
                                        Dest
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Active Exchange Rate Reference Note */}
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800/80">
                    <span className="flex items-center gap-1 font-mono text-stone-300">
                      <ArrowLeftRight className="w-2.5 h-2.5 text-amber-400" />
                      <span>{currentRateRatio}</span>
                    </span>
                    <span className="text-stone-400 font-light">0% Forex Markup</span>
                  </div>
                </div>

                {/* Visual Progress Bar Section */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E05A47]" />
                      Planning Progress
                    </span>
                    <span className="text-[10px] font-bold text-stone-800 bg-white px-2 py-0.5 rounded-full border border-stone-200/70 shadow-2xs">
                      {completedCount} of 4 Completed ({progressPercent}%)
                    </span>
                  </div>

                  {/* Segmented Progress Bar */}
                  <div className="w-full bg-stone-200/70 rounded-full h-1.5 overflow-hidden flex gap-1 p-0.5 mb-2.5">
                    {planningSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          step.completed ? 'bg-emerald-600' : 'bg-stone-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* 4 Step Micro Badges */}
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {planningSteps.map((step) => {
                      const StepIcon = step.icon;
                      return (
                        <div
                          key={step.id}
                          className={`p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                            step.completed
                              ? 'bg-white text-stone-800 border border-stone-200/80 shadow-2xs'
                              : 'bg-stone-100/50 text-stone-400 opacity-60 border border-transparent'
                          }`}
                          title={`${step.label}: ${step.detail}`}
                        >
                          <div className="relative">
                            <StepIcon
                              className={`w-3.5 h-3.5 ${
                                step.completed ? 'text-stone-800' : 'text-stone-400'
                              }`}
                            />
                            {step.completed && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
                            )}
                          </div>
                          <span className="text-[9px] font-medium leading-none truncate w-full">
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Optimization Savings Card */}
                <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 rounded-2xl p-3 border border-emerald-200/80 text-emerald-950">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <TrendingDown className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-xs text-emerald-900">
                        Wandr AI Savings Summary
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                      {savingsPercent}% Lower Fare
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1 pt-1.5 border-t border-emerald-200/60">
                    <div>
                      <div className="text-[10px] text-emerald-800/80">
                        Standard Retail:{' '}
                        <span className="line-through text-stone-500 font-medium">
                          {formatWithCurrency(standardRetailTotal, selectedCurrencyCode, liveRates)}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-900 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>
                          You Save {formatWithCurrency(totalSavings, selectedCurrencyCode, liveRates)} with AI Bundling
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1 text-[9px] text-emerald-800 font-medium">
                    <div className="flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span>Direct Partner Stays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span>0% Convenience Fees</span>
                    </div>
                  </div>
                </div>

                {/* Quick Dates & Itinerary Dates */}
                <div className="flex items-center justify-between text-xs bg-[#FAF8F5] p-2.5 rounded-2xl border border-stone-200/70">
                  <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#E05A47]" />
                    <span>
                      {tripPlan.startDate} – {tripPlan.endDate}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-light">
                    From {tripPlan.originCity.split(' ')[0]}
                  </span>
                </div>

                {/* Highlights Breakdown: Stay & Transit */}
                <div className="space-y-1.5 text-xs">
                  {/* Stay item */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-stone-700">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Hotel className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate font-medium">{tripPlan.selectedStay.name}</span>
                    </div>
                    <span className="text-stone-900 font-semibold shrink-0 font-serif">
                      {formatWithCurrency(
                        tripPlan.selectedStay.pricePerNight * Math.max(1, tripPlan.durationDays - 1),
                        selectedCurrencyCode,
                        liveRates
                      )}
                    </span>
                  </div>

                  {/* Transit item */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-stone-700">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <TransitIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate font-medium">{transitLabel}</span>
                    </div>
                    <span className="text-stone-900 font-semibold shrink-0 font-serif">
                      {formatWithCurrency(tripPlan.selectedFlight.price, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>

                  {/* Activities summary if any */}
                  {tripPlan.selectedActivities.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-stone-700">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="font-medium">
                          {tripPlan.selectedActivities.length} Activities & Tours
                        </span>
                      </div>
                      <span className="text-stone-900 font-semibold shrink-0 font-serif">
                        {formatWithCurrency(costs.activitiesCost, selectedCurrencyCode, liveRates)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Grand Total Row with Dual-Currency Display & Budget Guarantee */}
                <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        Wandr Bundle Total ({activeCurrency.code})
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        <Check className="w-2.5 h-2.5" /> ≤ ₹{tripPlan.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 font-light mt-0.5">
                      {selectedCurrencyCode !== 'INR' ? (
                        <span>≈ ₹{costs.grandTotal.toLocaleString('en-IN')} INR Home Rate</span>
                      ) : isDestCurrencyDifferent ? (
                        <span>
                          ≈ {formatWithCurrency(costs.grandTotal, destCurrency.code, liveRates)} {destCurrency.name}
                        </span>
                      ) : (
                        <span>Taxes & transfers included</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 line-through">
                      {formatWithCurrency(standardRetailTotal, selectedCurrencyCode, liveRates)}
                    </div>
                    <span className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                      {formatWithCurrency(costs.grandTotal, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        onViewItinerary();
                      }}
                      className="py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors text-center cursor-pointer"
                    >
                      View Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        onProceedToBooking();
                      }}
                      className="py-2.5 px-3 rounded-2xl bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all shadow-2xs text-center flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                    >
                      <span>Instant Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {onOpenShare && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        onOpenShare();
                      }}
                      className="w-full py-2 px-3 rounded-2xl bg-[#E05A47]/10 hover:bg-[#E05A47]/20 text-[#E05A47] border border-[#E05A47]/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Itinerary with Group</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
