import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Check,
  X as CloseIcon,
  Zap,
  Coffee,
  Plane,
  HeartHandshake,
  Headphones,
  Compass,
  ArrowRight,
  Star,
  Lock,
  ChevronDown,
  Gift,
  CheckCircle2,
  Download,
  MessageSquare,
  BadgeCheck,
} from 'lucide-react';
import { UserProfile } from '../types/travel';
import { PREMIUM_TIERS, PremiumTier } from '../data/travelData';

interface PremiumBenefitsPageProps {
  userProfile: UserProfile;
  onUpgradeSuccess: (tier: 'Wanderlust Pro' | 'Wanderlust Black') => void;
  onBackToExplore: () => void;
}

export const PremiumBenefitsPage: React.FC<PremiumBenefitsPageProps> = ({
  userProfile,
  onUpgradeSuccess,
  onBackToExplore,
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedTierForUpgrade, setSelectedTierForUpgrade] = useState<PremiumTier | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [showConciergeModal, setShowConciergeModal] = useState<boolean>(false);

  const isAlreadyPremium = !!userProfile.isPremium;

  const handleSimulatedUpgrade = (tier: PremiumTier) => {
    setSelectedTierForUpgrade(tier);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedTierForUpgrade) return;
    setIsProcessingUpgrade(true);

    setTimeout(() => {
      setIsProcessingUpgrade(false);
      const tierName =
        selectedTierForUpgrade.id === 'black' ? 'Wanderlust Black' : 'Wanderlust Pro';
      onUpgradeSuccess(tierName);
      setSelectedTierForUpgrade(null);
      setShowCelebration(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const comparisonFeatures = [
    {
      name: 'Platform Booking Surcharges',
      free: 'Standard (3.5% fee)',
      pro: '0% Zero Fees (Save ₹12K+)',
      black: '0% Zero Fees (Save ₹25K+)',
    },
    {
      name: '24/7 Dedicated Concierge',
      free: 'Email support (24h)',
      pro: '60s WhatsApp Human Agent',
      black: 'Direct 1-on-1 Senior Manager',
    },
    {
      name: 'Disruption & Rebooking Protection',
      free: 'Standard airline policy',
      pro: 'Auto-Rebooking + Voucher',
      black: 'VIP Private Chauffeur & Rebook',
    },
    {
      name: 'Global Airport Lounge Passes',
      free: 'None',
      pro: '4 Passes / year',
      black: 'Unlimited + 2 Guests',
    },
    {
      name: 'Boutique Hotel Room Upgrades',
      free: 'Subject to pay',
      pro: 'Complimentary on Availability',
      black: 'Guaranteed Highest Category',
    },
    {
      name: 'Late 4:00 PM Check-Out',
      free: 'Not included',
      pro: 'Subject to Availability',
      black: 'Guaranteed + Free Spa Credit',
    },
    {
      name: 'Secret Villas & Unlisted Stays',
      free: 'Standard list only',
      pro: 'Curated Hidden Gems',
      black: 'Ultra-Exclusive Estates & Yachts',
    },
    {
      name: 'Live Smart Trip Companion',
      free: 'Online only',
      pro: 'Offline GPS + Live Alerts',
      black: 'Offline GPS + Personal Guide',
    },
  ];

  const faqs = [
    {
      q: 'How does 0% booking surcharge save me money?',
      a: 'Standard platforms charge a 3%–5% service and processing fee on flights, boutique villas, and curated transfers. With Wandr Pro, that surcharge is eliminated completely, saving an average of ₹12,000 on a single 7-day international journey.',
    },
    {
      q: 'How do the complimentary airport lounge passes work?',
      a: 'Your digital lounge QR passes are automatically loaded into your Wandr profile. Simply scan the pass at any of the 1,300+ participating Priority Lounges worldwide for free gourmet food, showers, and fast Wi-Fi.',
    },
    {
      q: 'Can I cancel or pause my subscription at any time?',
      a: 'Yes, absolutely. You can cancel with 1-click at any time from your Account Settings with zero cancellation fees or penalties. Your premium benefits remain active until the end of your billing cycle.',
    },
    {
      q: 'What is the Flight Disruption Auto-Rebooking Guard?',
      a: 'If your flight is cancelled or delayed by more than 2 hours, our automated engine immediately secures the next best available flight and generates an instant lounge/hotel meal voucher without you having to wait in airport queues.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 pb-24 animate-fadeIn">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1A18] via-stone-900 to-[#1C1A18] text-white pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E05A47]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-xs">
            <Crown className="w-4 h-4 text-amber-400" />
            Wandr Luxury Membership
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-stone-50 leading-[1.1] mb-6">
            Elevate every journey. <br />
            <span className="italic font-light text-stone-300">Without limits or surcharges.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Unlock 0% booking fees, 24/7 dedicated private WhatsApp concierge, guaranteed boutique
            upgrades, and worldwide airport lounge access — for just ₹300/month.
          </p>

          {/* Active Premium Member Banner (If already subscribed) */}
          {isAlreadyPremium ? (
            <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-amber-400/40 text-center shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-900 text-xs font-bold uppercase tracking-wider mb-3">
                <BadgeCheck className="w-4 h-4" />
                Active Membership: {userProfile.premiumTier || 'Wanderlust Pro'}
              </div>
              <p className="text-sm text-stone-200 font-light mb-4">
                You have VIP status unlocked across all stays, flights, and concierges until October
                2027.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConciergeModal(true)}
                  className="px-5 py-2.5 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white text-xs font-medium flex items-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>VIP WhatsApp Concierge</span>
                </button>
                <button
                  onClick={onBackToExplore}
                  className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Explore Destinations
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#pricing-plans"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white text-sm font-medium tracking-tight shadow-xl shadow-[#E05A47]/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Membership Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onBackToExplore}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-sm font-medium transition-all cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Success Celebration Banner (Shown after simulated upgrade) */}
      {showCelebration && (
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-400 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <Crown className="w-8 h-8 text-amber-300 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Welcome to {userProfile.premiumTier || 'Wanderlust Pro'}! 🎉
                </h3>
                <p className="text-xs text-emerald-200 font-light mt-1">
                  Your 0% fees, 4 lounge passes, and 24/7 dedicated concierge are now activated
                  across your account.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="px-5 py-2 rounded-full bg-white text-emerald-950 text-xs font-semibold hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3. Core Value Metrics / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center text-[#E05A47] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mb-1">0% Surcharges</div>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Zero platform commissions or hidden markup on airlines, boutique villas, or curated
              tours.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center text-amber-600 mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mb-1">60s Concierge</div>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Instant access to expert human trip designers via dedicated WhatsApp line anytime,
              anywhere.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center text-blue-600 mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mb-1">1,300+ Lounges</div>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Complimentary airport lounge access globally with premium food, high-speed Wi-Fi, and
              showers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center text-emerald-600 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mb-1">VIP Stays</div>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Complimentary room upgrades, early check-in, late 4 PM check-out, and on-arrival
              welcome champagne.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Pricing / Subscription Section */}
      <section id="pricing-plans" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E05A47]/10 text-[#E05A47] text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
            <Crown className="w-3.5 h-3.5" />
            Flexible Membership Plans
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Choose your level of luxury.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light mt-2">
            Cancel anytime with a single tap. All plans pay for themselves on your very first
            vacation.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-[#FAF8F5] border border-stone-200/80 shadow-2xs">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E05A47] text-white text-[10px] font-bold">
                Save 17% (₹250/mo)
              </span>
            </button>

            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {PREMIUM_TIERS.map((tier) => {
            const isAnnual = billingCycle === 'annual';
            const priceDisplay = isAnnual ? tier.annualMonthlyEquivalent : tier.monthlyPrice;
            const billedText = isAnnual
              ? `Billed annually at ₹${tier.annualPrice.toLocaleString('en-IN')}/yr`
              : 'Billed monthly, cancel anytime';
            const isUserCurrentTier =
              userProfile.isPremium &&
              ((tier.id === 'pro' && userProfile.premiumTier === 'Wanderlust Pro') ||
                (tier.id === 'black' && userProfile.premiumTier === 'Wanderlust Black'));

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 sm:p-10 border transition-all duration-300 flex flex-col justify-between relative ${
                  tier.popular
                    ? 'bg-white border-stone-900 ring-2 ring-stone-900 shadow-xl'
                    : 'bg-white border-stone-200/90 shadow-2xs hover:shadow-md'
                }`}
              >
                {tier.badge && (
                  <div
                    className={`absolute -top-3.5 right-8 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-xs ${
                      tier.popular ? 'bg-stone-900 text-white' : 'bg-amber-400 text-stone-900'
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                      {tier.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-500 font-light mb-6">
                    {tier.tagline}
                  </p>

                  <div className="mb-6 pb-6 border-b border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                        ₹{priceDisplay.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500 font-light">/ month</span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-light mt-1">{billedText}</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <div className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                      Everything Included:
                    </div>
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            feat.included
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-stone-100 text-stone-300'
                          }`}
                        >
                          {feat.included ? (
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <CloseIcon className="w-3 h-3 stroke-[1.5]" />
                          )}
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              feat.included ? 'text-stone-900' : 'text-stone-400 line-through'
                            }`}
                          >
                            {feat.title}
                          </span>
                          <span className="block text-xs text-stone-500 font-light mt-0.5">
                            {feat.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div>
                  {isUserCurrentTier ? (
                    <div className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Currently Active Plan</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSimulatedUpgrade(tier)}
                      className={`w-full py-4 rounded-2xl font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs active:scale-98 ${
                        tier.popular
                          ? 'bg-stone-900 hover:bg-[#E05A47] text-white shadow-md'
                          : 'bg-[#FAF8F5] hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Upgrade to {tier.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Detailed Free vs Pro vs Black Comparison Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xs overflow-x-auto">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Detailed Plan Feature Matrix
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Compare benefits side-by-side to find the right fit for your travel style.
            </p>
          </div>

          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-4 pr-4">Feature / Privilege</th>
                <th className="py-4 px-4 text-stone-600">Free Tier</th>
                <th className="py-4 px-4 text-stone-900 font-serif font-bold">Wandr Pro</th>
                <th className="py-4 pl-4 text-amber-700 font-serif font-bold">Wandr Black Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-light">
              {comparisonFeatures.map((row, i) => (
                <tr key={i} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 pr-4 font-medium text-stone-900">{row.name}</td>
                  <td className="py-4 px-4 text-stone-500">{row.free}</td>
                  <td className="py-4 px-4 text-emerald-800 font-medium">{row.pro}</td>
                  <td className="py-4 pl-4 text-stone-900 font-semibold">{row.black}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Clear, transparent answers on membership perks and policies.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-serif font-bold text-stone-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-stone-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Interactive Upgrade Modal Dialog */}
      {selectedTierForUpgrade && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCFB] rounded-3xl max-w-lg w-full overflow-hidden border border-stone-200/90 shadow-2xl animate-fadeIn">
            <div className="p-6 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-stone-900">
                    Upgrade to {selectedTierForUpgrade.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-light">
                    Instant activation with 30-day money-back guarantee
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTierForUpgrade(null)}
                className="p-2 rounded-full bg-white text-stone-500 hover:text-stone-900 border border-stone-200 cursor-pointer shadow-2xs"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                    {billingCycle === 'annual'
                      ? 'Annual Plan (Save 17%)'
                      : 'Monthly Plan (₹300/mo)'}
                  </span>
                  <div className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                    ₹
                    {billingCycle === 'annual'
                      ? selectedTierForUpgrade.annualPrice.toLocaleString('en-IN')
                      : selectedTierForUpgrade.monthlyPrice.toLocaleString('en-IN')}
                    <span className="text-xs text-stone-500 font-normal">
                      {' '}
                      / {billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    0% Platform Fees Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 font-light">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate access to 4 international airport lounge passes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated WhatsApp Travel Concierge contact provisioned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automatic room upgrades & early check-in applied to all trips</span>
                </div>
              </div>

              {/* Simulated Card / UPI details */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Payment Method: <strong>Instant UPI & Credit Card Sandbox</strong>
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">256-bit Encrypted</span>
              </div>
            </div>

            <div className="p-6 bg-[#FAF8F5] border-t border-stone-200/80 flex items-center justify-between">
              <button
                onClick={() => setSelectedTierForUpgrade(null)}
                className="px-5 py-2.5 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-stone-200 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmUpgrade}
                disabled={isProcessingUpgrade}
                className="px-7 py-3 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isProcessingUpgrade ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Activating VIP Membership...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Confirm & Activate Membership</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 8. VIP WhatsApp Concierge Modal */}
      {showConciergeModal && (
        <div
          onClick={() => setShowConciergeModal(false)}
          className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl overflow-hidden border border-stone-200 shadow-2xl p-6 text-stone-900 cursor-default"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-stone-900">
                    VIP WhatsApp Concierge
                  </h4>
                  <span className="text-[11px] text-stone-500 font-light">
                    Exclusive perk for {userProfile.premiumTier || 'Wanderlust Pro'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowConciergeModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="my-5 space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect with our dedicated travel experts instantly. Pick an action or send a custom
                itinerary request:
              </p>

              <a
                href="https://wa.me/919876543210?text=Hi%20Wandr%20VIP%20Desk,%20I'm%20a%20Pro%20member%20and%20need%20my%20Airport%20Lounge%20passes%20issued."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-xs text-stone-800 flex items-center justify-between shadow-2xs transition-colors cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-stone-700 shrink-0" />
                  <div>
                    <span className="font-bold block">Request Airport Lounge Passes</span>
                    <span className="text-[10px] text-stone-500">
                      Issued instantly to your mobile
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Wandr%20VIP%20Desk,%20please%20apply%20my%20complimentary%20room%20upgrade%20for%20my%20upcoming%20stay."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-xs text-stone-800 flex items-center justify-between shadow-2xs transition-colors cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold block">Apply VIP Villa Upgrade</span>
                    <span className="text-[10px] text-stone-500">
                      Subject to room category availability
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Wandr%20VIP%20Desk,%20I'd%20like%20a%20bespoke%20destination%20itinerary%20recommendation."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center justify-between shadow-md transition-colors cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold block">Open Direct WhatsApp Chat</span>
                    <span className="text-[10px] text-emerald-100">
                      Live agent replies within 45 seconds
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
              </a>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowConciergeModal(false)}
                className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-[#E05A47] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
