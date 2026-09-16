import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Plane,
  Train,
  Bus,
  Hotel,
  Car,
  Ticket,
  Heart,
  ChevronDown,
  Info,
  CreditCard,
  Smartphone,
  Users,
  Check,
  X,
  AlertCircle,
  Crown,
  Coins,
  ArrowLeftRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TripPlan, UserProfile } from '../types/travel';
import { calculateTripTotal } from '../utils/tripPlannerEngine';
import { UserAvatar } from './UserAvatar';
import {
  SUPPORTED_CURRENCIES,
  getDestinationCurrency,
  formatWithCurrency,
  DEFAULT_INR_RATES,
  fetchLiveExchangeRates,
} from '../utils/currencyConverter';

interface SmartBookingCheckoutProps {
  tripPlan: TripPlan;
  userProfile?: UserProfile;
  onCustomizeClick: () => void;
  onBookingSuccess: (plan: TripPlan) => void;
}

export const SmartBookingCheckout: React.FC<SmartBookingCheckoutProps> = ({
  tripPlan,
  userProfile,
  onCustomizeClick,
  onBookingSuccess,
}) => {
  const [includeTransport, setIncludeTransport] = useState<boolean>(
    tripPlan.privateTransportIncluded
  );
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'split'>('upi');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Currency toggle state
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('INR');
  const [liveRates, setLiveRates] = useState<Record<string, number>>(DEFAULT_INR_RATES);

  const destCurrency = tripPlan?.destination
    ? getDestinationCurrency(tripPlan.destination.country, tripPlan.destination.name)
    : SUPPORTED_CURRENCIES.INR;

  const isDestCurrencyDifferent = destCurrency.code !== 'INR';

  useEffect(() => {
    fetchLiveExchangeRates().then((res) => {
      setLiveRates(res.rates);
    });
  }, []);

  const isPremium = !!userProfile?.isPremium;

  const costs = calculateTripTotal(
    tripPlan.selectedFlight,
    tripPlan.selectedStay,
    tripPlan.durationDays,
    tripPlan.selectedActivities,
    tripPlan.selectedPremium,
    includeTransport,
    tripPlan.transportCost,
    tripPlan.budget
  );

  const handleBookEntireTrip = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setBookingConfirmed(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4D30', '#18181B', '#10B981', '#F59E0B'],
      });
      onBookingSuccess({
        ...tripPlan,
        privateTransportIncluded: includeTransport,
        totalPrice: costs.grandTotal,
      });
    }, 1200);
  };

  return (
    <section id="smart-booking" className="py-16 sm:py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            Wandr Unified Booking
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Stop juggling 5 different tabs.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light mt-2">
            Every element of your trip is coordinated into one transparent invoice with verified
            inventory and unified cancellation terms.
          </p>
        </div>

        {/* Unified Booking Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-400">
                  YOUR TRIP INVENTORY
                </span>
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation
                </span>
              </div>

              {/* Itemized Rows */}
              <div className="divide-y divide-stone-100 mt-2">
                {/* 1. Flights */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center font-bold">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        Flights ({tripPlan.selectedFlight.airline})
                      </div>
                      <div className="text-xs text-stone-500 font-light">
                        {tripPlan.selectedFlight.fromCode} → {tripPlan.selectedFlight.toCode} •
                        Roundtrip Included
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900">
                      ₹{costs.flightCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">Included</div>
                  </div>
                </div>

                {/* 2. Stays */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center font-bold">
                      <Hotel className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        Stay ({tripPlan.selectedStay.name})
                      </div>
                      <div className="text-xs text-stone-500 font-light">
                        {tripPlan.durationDays - 1} nights • {tripPlan.selectedStay.roomType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900">
                      ₹{costs.stayCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">Included</div>
                  </div>
                </div>

                {/* 3. Transport (Toggleable) */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center font-bold">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        Transport (Private Airport & Daily Chauffeur)
                      </div>
                      <div className="text-xs text-stone-500 font-light">
                        Air-conditioned luxury vehicle throughout the island
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-stone-900">
                        ₹{tripPlan.transportCost.toLocaleString('en-IN')}
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer mt-0.5 justify-end">
                        <input
                          type="checkbox"
                          checked={includeTransport}
                          onChange={(e) => setIncludeTransport(e.target.checked)}
                          className="rounded text-[#E05A47] focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="text-[10px] font-medium text-stone-500">
                          {includeTransport ? 'Included' : 'Remove'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. Activities */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center font-bold">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        Activities ({tripPlan.selectedActivities.length} Guided Experiences)
                      </div>
                      <div className="text-xs text-stone-500 font-light">
                        {tripPlan.selectedActivities.map((a) => a.title.split(' ')[0]).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900">
                      ₹{costs.activitiesCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">Included</div>
                  </div>
                </div>

                {/* 5. Premium Experiences */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        Experiences ({tripPlan.selectedPremium.length} Bespoke Add-ons)
                      </div>
                      <div className="text-xs text-stone-500 font-light">
                        {tripPlan.selectedPremium.map((p) => p.title.split(' ')[0]).join(', ') ||
                          'None selected'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900">
                      ₹{costs.experiencesCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium">Bespoke</div>
                  </div>
                </div>
              </div>

              {/* Transparent Inclusions & Cancellation Badge */}
              <div className="mt-6 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    <strong>Free cancellation</strong> until 7 days prior to departure. Zero
                    convenience surcharge.
                  </span>
                </div>
                <button
                  onClick={onCustomizeClick}
                  className="font-medium text-[#E05A47] hover:underline whitespace-nowrap cursor-pointer"
                >
                  Customize elements →
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Invoice Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900 text-stone-50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E05A47]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#E05A47]">
                    TOTAL TRIP INVOICE
                  </span>

                  {/* Currency Switcher */}
                  <div className="inline-flex items-center gap-1 bg-stone-800/80 p-0.5 rounded-lg text-[10px] font-medium border border-stone-700">
                    <button
                      type="button"
                      onClick={() => setSelectedCurrencyCode('INR')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        selectedCurrencyCode === 'INR'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      🇮🇳 INR
                    </button>
                    {isDestCurrencyDifferent && (
                      <button
                        type="button"
                        onClick={() => setSelectedCurrencyCode(destCurrency.code)}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          selectedCurrencyCode === destCurrency.code
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'text-stone-300 hover:text-white'
                        }`}
                      >
                        {destCurrency.flag} {destCurrency.code}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedCurrencyCode('USD')}
                      className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        selectedCurrencyCode === 'USD'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      🇺🇸 USD
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-stone-800">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                      {formatWithCurrency(costs.grandTotal, selectedCurrencyCode, liveRates)}
                    </h3>
                    {selectedCurrencyCode !== 'INR' && (
                      <div className="text-xs text-amber-400 font-medium mt-1">
                        ≈ ₹{costs.grandTotal.toLocaleString('en-IN')} INR Home Fare
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 font-light block">All-inclusive</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mt-1 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <Check className="w-3 h-3" /> ≤ ₹{tripPlan.budget.toLocaleString('en-IN')}{' '}
                      Budget
                    </span>
                  </div>
                </div>

                {/* Budget Match & Savings Pill */}
                <div className="mb-5 p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-xs">
                  <div className="flex items-center justify-between text-stone-300 mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Target Budget
                    </span>
                    <span className="font-bold text-white">
                      ₹{tripPlan.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium">
                      {costs.savingsVsBudget > 0
                        ? `🎉 ₹${costs.savingsVsBudget.toLocaleString('en-IN')} Under Budget Cap`
                        : '🎯 Exact Target Match (Guaranteed ≤ Budget)'}
                    </span>
                    <span className="text-stone-400">
                      {Math.round((costs.grandTotal / (tripPlan.budget || costs.grandTotal)) * 100)}
                      % of Budget
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((costs.grandTotal / (tripPlan.budget || costs.grandTotal)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-xs text-stone-300 mb-6 font-light">
                  <div className="flex justify-between">
                    <span>Flights (Roundtrip)</span>
                    <span className="font-medium text-white">
                      {formatWithCurrency(costs.flightCost, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stays & Accommodations</span>
                    <span className="font-medium text-white">
                      {formatWithCurrency(costs.stayCost, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport & Chauffeur</span>
                    <span className="font-medium text-white">
                      {formatWithCurrency(costs.transportCost, selectedCurrencyCode, liveRates)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities & Experiences</span>
                    <span className="font-medium text-white">
                      {formatWithCurrency(
                        costs.activitiesCost + costs.experiencesCost,
                        selectedCurrencyCode,
                        liveRates
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-400 pt-2 border-t border-stone-800">
                    <span>Taxes & GST (Transparent 5%)</span>
                    <span>{formatWithCurrency(costs.taxes, selectedCurrencyCode, liveRates)}</span>
                  </div>
                  {costs.budgetDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Wandr Smart Budget Subsidy
                      </span>
                      <span>
                        -{formatWithCurrency(costs.budgetDiscount, selectedCurrencyCode, liveRates)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleBookEntireTrip}
                    className="w-full py-3.5 rounded-full bg-[#E05A47] hover:bg-[#C84B31] active:scale-98 text-white font-medium text-sm sm:text-base shadow-md shadow-[#E05A47]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Book entire trip</span>
                  </button>

                  <button
                    onClick={onCustomizeClick}
                    className="w-full py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs transition-all cursor-pointer"
                  >
                    Customize plan & stays
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-center gap-4 text-[11px] text-stone-400 font-light">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Wandr Guarantee
                  </span>
                  <span>•</span>
                  <span>24/7 On-Trip Concierge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frictionless One-Click Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => {
                setShowCheckoutModal(false);
                setBookingConfirmed(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingConfirmed ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF4D30]/10 text-[#FF4D30] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900">
                      Confirm & Lock Your Trip
                    </h3>
                    <p className="text-xs text-stone-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span>
                        {tripPlan.destination.name} • {tripPlan.durationDays} Days •
                      </span>
                      <span className="font-bold text-stone-900">
                        {formatWithCurrency(costs.grandTotal, selectedCurrencyCode, liveRates)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3" /> ≤ ₹{tripPlan.budget.toLocaleString('en-IN')}{' '}
                        Budget
                      </span>
                    </p>
                  </div>
                </div>

                {/* Traveller Quick Info */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={userProfile?.avatar}
                      alt={userProfile?.name || 'Ayan'}
                      size="md"
                      className="w-11 h-11 ring-2 ring-stone-900/10 shadow-2xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {userProfile?.name || 'Ayan Alam'}
                      </div>
                      <div className="text-[11px] text-stone-500 font-light">
                        {userProfile?.email || 'ayanalamxnaruto@gmail.com'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Verified Guest
                  </span>
                </div>

                {/* Payment Option Tabs */}
                <div className="mb-6">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Payment Method
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'upi'
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Instant UPI</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cards / EMI</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('split')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'split'
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Split Pay</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-full bg-[#FF4D30] hover:bg-[#E03E22] text-white font-extrabold text-sm shadow-lg shadow-[#FF4D30]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Locking inventory with airlines & stays...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay {formatWithCurrency(costs.grandTotal, selectedCurrencyCode, liveRates)}{' '}
                        & Confirm Trip
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Success Confirmation View */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900 mb-2">
                  Trip Confirmed & Designed!
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mb-6">
                  Your booking code is{' '}
                  <strong>#WANDR-{tripPlan.destination.name.toUpperCase().slice(0, 3)}-8824</strong>
                  . All flight tickets, villa vouchers, and chauffeur contact details are synced to
                  your Wandr Live Dashboard.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      const el = document.getElementById('live-trip-mode');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 rounded-full bg-[#18181B] hover:bg-[#FF4D30] text-white text-xs font-extrabold transition-all"
                  >
                    Open Live Trip Companion Mode →
                  </button>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full py-2.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
