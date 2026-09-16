import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPlanner } from './components/HeroPlanner';
import { VibeDestinations } from './components/VibeDestinations';
import { PersonalizedTripResult } from './components/PersonalizedTripResult';
import { SmartBookingCheckout } from './components/SmartBookingCheckout';
import { StaysDiscovery } from './components/StaysDiscovery';
import { TransitHub } from './components/TransitHub';
import { ActivitiesExplorer } from './components/ActivitiesExplorer';
import { PremiumExperiences } from './components/PremiumExperiences';
import { LiveTripMode } from './components/LiveTripMode';
import { HowItWorks } from './components/HowItWorks';
import { TrustTransparency } from './components/TrustTransparency';
import { InspirationSection } from './components/InspirationSection';
import { Footer } from './components/Footer';
import { UserAccountModal } from './components/UserAccountModal';
import { StayDetailsModal } from './components/StayDetailsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PremiumBenefitsPage } from './components/PremiumBenefitsPage';
import { FloatingTripSummary } from './components/FloatingTripSummary';
import { TripFeedbackModal } from './components/TripFeedbackModal';
import { ShareTripModal } from './components/ShareTripModal';
import { deserializeTripPlan } from './utils/shareableTripLink';
import { Share2, Sparkles, X } from 'lucide-react';

import {
  TripPlan,
  UserProfile,
  Destination,
  StayItem,
  FlightOption,
  TrainOption,
  TrainClassOption,
  BusOption,
  CabOption,
  ActivityItem,
  PremiumExperience,
  CompanionType,
  VibeType,
  BudgetTier,
  DurationOption,
  TripFeedbackData,
  TripFeedbackSubmission,
} from './types/travel';
import { INITIAL_TRIP_PLAN, DEFAULT_USER_PROFILE } from './data/travelData';
import { generateCustomTripPlan, calculateTripTotal } from './utils/tripPlannerEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [tripPlan, setTripPlan] = useState<TripPlan>(INITIAL_TRIP_PLAN);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [liveModeActive, setLiveModeActive] = useState<boolean>(true);

  // Modals & Sharing
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [selectedStayForDetails, setSelectedStayForDetails] = useState<StayItem | null>(null);
  const [feedbackTrip, setFeedbackTrip] = useState<TripFeedbackData | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [sharedTripAlert, setSharedTripAlert] = useState<{
    curatorName?: string;
    destinationName: string;
    durationDays: number;
  } | null>(null);

  // Check URL on load for shared trip links (?trip=... or ?sharedTrip=...)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const tripPayload = searchParams.get('trip') || searchParams.get('sharedTrip');

        if (tripPayload) {
          const resolved = deserializeTripPlan(tripPayload);
          if (resolved && resolved.tripPlan) {
            setTripPlan(resolved.tripPlan);
            setSharedTripAlert({
              curatorName: resolved.curatorName || 'A travel companion',
              destinationName: resolved.tripPlan.destination.name,
              durationDays: resolved.tripPlan.durationDays,
            });

            // Smooth scroll to personalized itinerary after brief render
            setTimeout(() => {
              const el = document.getElementById('personalized-trip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        }
      }
    } catch (err) {
      console.warn('Could not parse shared trip parameter:', err);
    }
  }, []);

  const handleOpenFeedback = (trip: TripFeedbackData) => {
    setFeedbackTrip(trip);
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = (submission: TripFeedbackSubmission) => {
    setUserProfile((prev) => {
      // Update past trip rating if matched
      const updatedPastTrips = prev.pastTrips.map((p) =>
        p.id === submission.tripId ? { ...p, rating: submission.overallRating } : p
      );
      return {
        ...prev,
        pastTrips: updatedPastTrips,
      };
    });
  };

  // Handle AI Planner Submit
  const handleDesignTrip = (data: {
    companion: CompanionType;
    vibes: VibeType[];
    budgetTier: BudgetTier;
    customBudget?: number;
    duration: DurationOption;
    destinationId?: string;
    originCity: string;
  }) => {
    const days = parseInt(data.duration, 10) || 7;
    const destId = data.destinationId || 'bali';
    const newPlan = generateCustomTripPlan(
      destId,
      data.companion,
      data.vibes,
      data.budgetTier,
      days,
      data.originCity,
      data.customBudget
    );
    setTripPlan(newPlan);

    // Smooth scroll down to personalized trip result
    const el = document.getElementById('personalized-trip');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Selecting a Destination from Vibe Grid / Search
  const handleSelectDestination = (dest: Destination) => {
    const newPlan = generateCustomTripPlan(
      dest.id,
      tripPlan.companion,
      dest.vibeTags,
      '100k',
      dest.idealDays,
      tripPlan.originCity,
      tripPlan.budget
    );
    setTripPlan(newPlan);

    const el = document.getElementById('personalized-trip');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Selecting a Stay
  const handleSelectStay = (stay: StayItem) => {
    setTripPlan((prev) => {
      const costs = calculateTripTotal(
        prev.selectedFlight,
        stay,
        prev.durationDays,
        prev.selectedActivities,
        prev.selectedPremium,
        prev.privateTransportIncluded,
        prev.transportCost,
        prev.budget
      );
      return {
        ...prev,
        selectedStay: stay,
        totalPrice: costs.grandTotal,
      };
    });
  };

  // Handle Selecting a Flight
  const handleSelectFlight = (flight: FlightOption) => {
    setTripPlan((prev) => {
      const costs = calculateTripTotal(
        flight,
        prev.selectedStay,
        prev.durationDays,
        prev.selectedActivities,
        prev.selectedPremium,
        prev.privateTransportIncluded,
        prev.transportCost,
        prev.budget
      );
      return {
        ...prev,
        selectedFlight: flight,
        selectedTransitMode: 'flight',
        totalPrice: costs.grandTotal,
      };
    });
  };

  // Handle Selecting a Train
  const handleSelectTrain = (train: TrainOption, _selectedClass?: TrainClassOption) => {
    setTripPlan((prev) => ({
      ...prev,
      selectedTrain: train,
      selectedTransitMode: 'train',
    }));
  };

  // Handle Selecting a Bus
  const handleSelectBus = (bus: BusOption) => {
    setTripPlan((prev) => ({
      ...prev,
      selectedBus: bus,
      selectedTransitMode: 'bus',
    }));
  };

  // Handle Selecting a Cab
  const handleSelectCab = (cab: CabOption) => {
    setTripPlan((prev) => ({
      ...prev,
      selectedCab: cab,
      selectedTransitMode: 'cab',
    }));
  };

  // Handle Toggling an Activity
  const handleToggleActivity = (activity: ActivityItem) => {
    setTripPlan((prev) => {
      const exists = prev.selectedActivities.some((a) => a.id === activity.id);
      const updated = exists
        ? prev.selectedActivities.filter((a) => a.id !== activity.id)
        : [...prev.selectedActivities, activity];
      const costs = calculateTripTotal(
        prev.selectedFlight,
        prev.selectedStay,
        prev.durationDays,
        updated,
        prev.selectedPremium,
        prev.privateTransportIncluded,
        prev.transportCost,
        prev.budget
      );
      return {
        ...prev,
        selectedActivities: updated,
        totalPrice: costs.grandTotal,
      };
    });
  };

  // Handle Toggling Premium Experiences
  const handleToggleExperience = (exp: PremiumExperience) => {
    setTripPlan((prev) => {
      const exists = prev.selectedPremium.some((p) => p.id === exp.id);
      const updated = exists
        ? prev.selectedPremium.filter((p) => p.id !== exp.id)
        : [...prev.selectedPremium, exp];
      const costs = calculateTripTotal(
        prev.selectedFlight,
        prev.selectedStay,
        prev.durationDays,
        prev.selectedActivities,
        updated,
        prev.privateTransportIncluded,
        prev.transportCost,
        prev.budget
      );
      return {
        ...prev,
        selectedPremium: updated,
        totalPrice: costs.grandTotal,
      };
    });
  };

  // Wishlist / Save Toggles
  const handleToggleSaveStay = (id: string) => {
    setUserProfile((prev) => {
      const exists = prev.savedStayIds.includes(id);
      return {
        ...prev,
        savedStayIds: exists
          ? prev.savedStayIds.filter((item) => item !== id)
          : [...prev.savedStayIds, id],
      };
    });
  };

  const handleToggleSaveDestination = (id: string) => {
    setUserProfile((prev) => {
      const exists = prev.savedDestinationIds.includes(id);
      return {
        ...prev,
        savedDestinationIds: exists
          ? prev.savedDestinationIds.filter((item) => item !== id)
          : [...prev.savedDestinationIds, id],
      };
    });
  };

  // Booking Confirmation Handler
  const handleBookingSuccess = (confirmedPlan: TripPlan) => {
    setUserProfile((prev) => ({
      ...prev,
      upcomingTrips: [
        {
          id: confirmedPlan.id,
          destinationName: confirmedPlan.destination.name,
          country: confirmedPlan.destination.country,
          coverImage: confirmedPlan.destination.coverImage,
          dates: `${confirmedPlan.startDate} – ${confirmedPlan.endDate}`,
          days: confirmedPlan.durationDays,
          companion: confirmedPlan.companion,
          status: 'Confirmed',
          totalCost: confirmedPlan.totalPrice,
        },
        ...prev.upcomingTrips.filter((t) => t.id !== confirmedPlan.id),
      ],
    }));
    setLiveModeActive(true);
  };

  // Handle Upgrade to Premium
  const handleUpgradeSuccess = (tier: 'Wanderlust Pro' | 'Wanderlust Black') => {
    setUserProfile((prev) => ({
      ...prev,
      isPremium: true,
      premiumTier: tier,
    }));
  };

  const scrollToPlanner = () => {
    if (activeTab === 'premium') {
      setActiveTab('explore');
      setTimeout(() => {
        const el = document.getElementById('ai-planner-card');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('ai-planner-card');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans pb-16 md:pb-0 selection:bg-[#E05A47]/15 selection:text-[#E05A47]">
      {/* 1. Desktop & Mobile Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'trips') {
            const el = document.getElementById('personalized-trip');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'stays') {
            const el = document.getElementById('stays-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'travel') {
            const el = document.getElementById('travel-hub');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'activities') {
            const el = document.getElementById('activities-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'inspiration') {
            const el = document.getElementById('inspiration-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'premium') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSaved={() => setIsProfileOpen(true)}
        onPlanTripClick={scrollToPlanner}
        userProfile={userProfile}
        liveModeActive={liveModeActive}
        setLiveModeActive={setLiveModeActive}
      />

      {/* Shared Trip Notification Banner */}
      {sharedTripAlert && (
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white px-4 py-3 border-b border-stone-700/80 shadow-md sticky top-16 sm:top-20 z-40 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-[#E05A47]/20 text-[#FF7043] border border-[#E05A47]/30 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-stone-200">
                <span className="font-semibold text-white">Shared Itinerary Loaded:</span> Viewing a{' '}
                {sharedTripAlert.durationDays}-day curated trip to{' '}
                <span className="text-[#FFA726] font-semibold">
                  {sharedTripAlert.destinationName}
                </span>{' '}
                shared by{' '}
                <strong className="text-white font-serif">{sharedTripAlert.curatorName}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-600/80 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3 h-3 text-[#E05A47]" />
                <span>Re-Share</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('personalized-trip');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-1 rounded-full bg-[#E05A47] hover:bg-[#C84B31] text-white text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Inspect Itinerary
              </button>
              <button
                type="button"
                onClick={() => setSharedTripAlert(null)}
                className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      {activeTab === 'premium' ? (
        <PremiumBenefitsPage
          userProfile={userProfile}
          onUpgradeSuccess={handleUpgradeSuccess}
          onBackToExplore={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* 2. Hero + Floating AI Trip Planner */}
          <HeroPlanner
            onDesignTrip={handleDesignTrip}
            onExploreClick={() => {
              const el = document.getElementById('vibe-destinations');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 3. “Made for your vibe” Destination Discovery */}
          <VibeDestinations
            onSelectDestination={handleSelectDestination}
            savedDestinationIds={userProfile.savedDestinationIds}
            onToggleSaveDestination={handleToggleSaveDestination}
          />

          {/* 4. Personalized Trip Result & Customizer */}
          <PersonalizedTripResult
            tripPlan={tripPlan}
            onUpdateTripPlan={setTripPlan}
            onProceedToBooking={() => {
              const el = document.getElementById('smart-booking');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenStaySelector={() => {
              const el = document.getElementById('stays-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenFlightSelector={() => {
              const el = document.getElementById('travel-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenShare={() => setIsShareOpen(true)}
          />

          {/* 5. Smart Unified Booking Experience */}
          <SmartBookingCheckout
            tripPlan={tripPlan}
            userProfile={userProfile}
            onCustomizeClick={() => {
              const el = document.getElementById('personalized-trip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBookingSuccess={handleBookingSuccess}
          />

          {/* 6. Multi-Modal Transit Hub (Flights, Trains, Buses, Cabs & Chauffeurs) */}
          <TransitHub
            onSelectFlight={handleSelectFlight}
            onSelectTrain={handleSelectTrain}
            onSelectBus={handleSelectBus}
            onSelectCab={handleSelectCab}
            selectedFlightId={tripPlan.selectedFlight.id}
            selectedTrainId={tripPlan.selectedTrain?.id}
            selectedBusId={tripPlan.selectedBus?.id}
            selectedCabId={tripPlan.selectedCab?.id}
            selectedTransitMode={tripPlan.selectedTransitMode}
          />

          {/* 7. Stays Discovery (Airbnb + OYO Usability) */}
          <StaysDiscovery
            onSelectStay={handleSelectStay}
            onViewStayDetails={(stay) => setSelectedStayForDetails(stay)}
            savedStayIds={userProfile.savedStayIds}
            onToggleSaveStay={handleToggleSaveStay}
            activeStayId={tripPlan.selectedStay.id}
          />

          {/* 8. Activities Explorer */}
          <ActivitiesExplorer
            onToggleActivity={handleToggleActivity}
            selectedActivityIds={tripPlan.selectedActivities.map((a) => a.id)}
          />

          {/* 9. Premium Experiences ("Make it unforgettable") */}
          <PremiumExperiences
            onToggleExperience={handleToggleExperience}
            selectedExperienceIds={tripPlan.selectedPremium.map((p) => p.id)}
          />

          {/* 10. Live Trip Mode Dashboard */}
          {liveModeActive && (
            <LiveTripMode tripPlan={tripPlan} onOpenFeedback={handleOpenFeedback} />
          )}

          {/* 11. How Wandr Works (8-step journey) */}
          <HowItWorks />

          {/* 12. Trust & Radical Transparency */}
          <TrustTransparency />

          {/* 13. Inspiration & Wandr Journal */}
          <InspirationSection onSelectInspiration={handleSelectDestination} />
        </>
      )}

      {/* 14. Final CTA & Footer */}
      <Footer
        onPlanTripClick={scrollToPlanner}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'premium') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const el =
              document.getElementById(`${tab}-section`) || document.getElementById('travel-hub');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSaved={() => setIsProfileOpen(true)}
        userProfile={userProfile}
        liveModeActive={liveModeActive}
        setLiveModeActive={setLiveModeActive}
      />

      {/* Modals & Drawers */}
      <FloatingTripSummary
        tripPlan={tripPlan}
        userProfile={userProfile}
        onOpenShare={() => setIsShareOpen(true)}
        onViewItinerary={() => {
          if (activeTab !== 'explore') {
            setActiveTab('explore');
            setTimeout(() => {
              const el = document.getElementById('personalized-trip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            const el = document.getElementById('personalized-trip');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onProceedToBooking={() => {
          if (activeTab !== 'explore') {
            setActiveTab('explore');
            setTimeout(() => {
              const el = document.getElementById('smart-booking');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            const el = document.getElementById('smart-booking');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onCustomizeClick={() => {
          if (activeTab !== 'explore') {
            setActiveTab('explore');
            setTimeout(() => {
              const el = document.getElementById('personalized-trip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            const el = document.getElementById('personalized-trip');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <UserAccountModal
        userProfile={userProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onViewItinerary={() => {
          const el = document.getElementById('personalized-trip');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectDestination={handleSelectDestination}
        onSelectStay={handleSelectStay}
        onOpenFeedback={handleOpenFeedback}
        onOpenShare={() => setIsShareOpen(true)}
        onUpdateProfile={setUserProfile}
      />

      <ShareTripModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tripPlan={tripPlan}
        userProfile={userProfile}
      />

      <TripFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        tripData={feedbackTrip}
        onSubmitFeedback={handleSubmitFeedback}
      />

      <StayDetailsModal
        stay={selectedStayForDetails}
        isOpen={!!selectedStayForDetails}
        onClose={() => setSelectedStayForDetails(null)}
        onSelectStay={handleSelectStay}
        isSaved={
          selectedStayForDetails
            ? userProfile.savedStayIds.includes(selectedStayForDetails.id)
            : false
        }
        onToggleSave={handleToggleSaveStay}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDestination={handleSelectDestination}
        onSelectStay={handleSelectStay}
      />
    </div>
  );
}
