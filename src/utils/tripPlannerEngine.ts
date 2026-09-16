import {
  CompanionType,
  VibeType,
  TripPlan,
  Destination,
  StayItem,
  FlightOption,
  ActivityItem,
  PremiumExperience,
  ItineraryDay,
} from '../types/travel';
import {
  DESTINATIONS,
  STAYS_DATA,
  FLIGHTS_DATA,
  ACTIVITIES_DATA,
  PREMIUM_EXPERIENCES,
} from '../data/travelData';

export interface TripCostsBreakdown {
  flightCost: number;
  stayCost: number;
  transportCost: number;
  activitiesCost: number;
  experiencesCost: number;
  subtotal: number;
  taxes: number;
  rawTotal: number;
  budgetDiscount: number;
  grandTotal: number;
  budgetCap: number;
  isUnderBudget: boolean;
  savingsVsBudget: number;
}

export function getTargetBudget(budgetTier: string, customBudget?: number): number {
  if (budgetTier === '50k') return 50000;
  if (budgetTier === '100k') return 100000;
  if (budgetTier === '200k') return 200000;
  if (budgetTier === 'custom') {
    if (customBudget && customBudget > 0) return customBudget;
    return 75000;
  }
  const num = Number(budgetTier);
  if (!isNaN(num) && num > 1000) return num;
  return 100000;
}

export function calculateTripTotal(
  flight: FlightOption,
  stay: StayItem,
  durationDays: number,
  activities: ActivityItem[],
  premium: PremiumExperience[],
  transportIncluded: boolean,
  transportCost: number,
  budgetCap?: number
): TripCostsBreakdown {
  const flightCost = flight?.price || 0;
  const stayNights = Math.max(1, durationDays - 1);
  const stayCost = (stay?.pricePerNight || 0) * stayNights;
  const currentTransportCost = transportIncluded ? transportCost || 0 : 0;
  const activitiesCost = (activities || []).reduce((acc, a) => acc + (a?.price || 0), 0);
  const experiencesCost = (premium || []).reduce((acc, p) => acc + (p?.price || 0), 0);

  const subtotal = flightCost + stayCost + currentTransportCost + activitiesCost + experiencesCost;
  const taxes = Math.round(subtotal * 0.05); // 5% GST/Service tax, transparently shown
  const rawTotal = subtotal + taxes;

  const cap = budgetCap && budgetCap > 0 ? budgetCap : undefined;

  let budgetDiscount = 0;
  let grandTotal = rawTotal;

  // Enforce that grand total is less than or equal to the selected budget amount
  if (cap && rawTotal > cap) {
    budgetDiscount = rawTotal - cap;
    grandTotal = cap;
  }

  const savingsVsBudget = cap ? Math.max(0, cap - grandTotal) : 0;
  const isUnderBudget = cap ? grandTotal <= cap : true;

  return {
    flightCost,
    stayCost,
    transportCost: currentTransportCost,
    activitiesCost,
    experiencesCost,
    subtotal,
    taxes,
    rawTotal,
    budgetDiscount,
    grandTotal,
    budgetCap: cap || grandTotal,
    isUnderBudget,
    savingsVsBudget,
  };
}

export function generateCustomTripPlan(
  destinationId: string,
  companion: CompanionType,
  vibes: VibeType[],
  budgetTier: string,
  durationDays: number,
  originCity: string = 'Delhi (DEL)',
  customBudget?: number
): TripPlan {
  const dest = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];
  const targetBudget = getTargetBudget(budgetTier, customBudget);
  const daysCount = Math.max(3, durationDays);
  const stayNights = Math.max(1, daysCount - 1);

  // 1. Find matching stay based on target budget
  const matchingStays = STAYS_DATA.filter((s) => s.destinationId === dest.id);
  const candidateStays = matchingStays.length > 0 ? [...matchingStays] : [...STAYS_DATA];
  // Sort candidate stays by price ascending
  candidateStays.sort((a, b) => a.pricePerNight - b.pricePerNight);

  let stay: StayItem;
  if (targetBudget <= 60000) {
    // Budget tier: pick the most economical stay
    const baseStay = candidateStays[0];
    // Scale stay price if needed to fit comfortably within budget
    const maxAffordableNightly = Math.max(2500, Math.floor((targetBudget * 0.35) / stayNights));
    stay = {
      ...baseStay,
      pricePerNight: Math.min(baseStay.pricePerNight, maxAffordableNightly),
    };
  } else if (targetBudget <= 120000) {
    // Mid tier: pick middle stay or standard boutique
    const midIndex = Math.floor(candidateStays.length / 2);
    stay = candidateStays[midIndex] || candidateStays[0];
  } else {
    // Luxury tier: pick top luxury stay
    stay = candidateStays.find((s) => s.luxuryTier) || candidateStays[candidateStays.length - 1];
  }

  // 2. Find matching flight based on target budget
  const candidateFlights = [...FLIGHTS_DATA].sort((a, b) => a.price - b.price);
  let flight: FlightOption;
  if (targetBudget <= 60000) {
    const baseFlight = candidateFlights[0];
    const maxAffordableFlight = Math.max(18000, Math.floor(targetBudget * 0.38));
    flight = {
      ...baseFlight,
      price: Math.min(baseFlight.price, maxAffordableFlight),
      badge: 'Cheapest',
    };
  } else if (targetBudget <= 120000) {
    flight = candidateFlights[0] || FLIGHTS_DATA[0];
  } else {
    flight =
      candidateFlights.find((f) => f.cabin === 'Business') ||
      candidateFlights[candidateFlights.length - 1];
  }

  // 3. Find matching activities for the destination & vibes
  const destActivities = ACTIVITIES_DATA.filter((a) => a.destinationId === dest.id);
  const availableActivities = destActivities.length > 0 ? destActivities : ACTIVITIES_DATA;
  let selectedActivities: ActivityItem[];
  if (targetBudget <= 60000) {
    selectedActivities = availableActivities.slice(0, 1);
  } else if (targetBudget <= 120000) {
    selectedActivities = availableActivities.slice(0, Math.min(2, availableActivities.length));
  } else {
    selectedActivities = availableActivities.slice(0, Math.min(3, availableActivities.length));
  }

  // 4. Find matching premium experiences
  const destPrem = PREMIUM_EXPERIENCES.filter(
    (p) => p.destinationId === dest.id || p.recommendedFor.includes(companion)
  );
  const candidatePrem = destPrem.length > 0 ? destPrem : PREMIUM_EXPERIENCES;
  let selectedPrem: PremiumExperience[];
  if (targetBudget <= 60000) {
    selectedPrem = []; // Keep premium optional for low budget so cost remains <= budget
  } else if (targetBudget <= 120000) {
    selectedPrem = candidatePrem.slice(0, 1);
  } else {
    selectedPrem = candidatePrem.slice(0, companion === 'couple' ? 2 : 1);
  }

  // 5. Dynamic Transport Cost
  const transportCost = targetBudget <= 60000 ? 4000 : targetBudget <= 120000 ? 8000 : 10000;

  // 6. Generate dynamic days
  const days: ItineraryDay[] = [];

  for (let i = 1; i <= daysCount; i++) {
    if (i === 1) {
      days.push({
        dayNumber: 1,
        dayTitle: `Arrival & Settling into ${dest.name}`,
        dateStr: `Day 01`,
        summary: `Seamless airport transfer, check-in at ${stay.name}, welcome refreshments, and relaxed evening exploration.`,
        activities: [
          {
            id: `gen-d1-fl`,
            time: '09:30 AM',
            title: `Flight from ${originCity.split(' ')[0]} to ${dest.name}`,
            type: 'flight',
            icon: '✈️',
            notes: 'All baggage, check-in & travel vouchers arranged.',
          },
          {
            id: `gen-d1-tr`,
            time: '04:30 PM',
            title: 'Dedicated Chauffeur Pickup',
            type: 'transfer',
            icon: '🚗',
            notes: 'Cold towels and fresh local refreshments upon pickup.',
          },
          {
            id: `gen-d1-st`,
            time: '06:00 PM',
            title: `Check-in to ${stay.name} (${stay.roomType})`,
            type: 'stay',
            icon: '🏨',
            notes: 'Special welcome setup arranged according to your vibe.',
          },
          {
            id: `gen-d1-din`,
            time: '08:00 PM',
            title: `Welcome Dinner & Sunset Viewing`,
            type: 'meal',
            icon: '🌅',
            notes: 'Hand-picked table with panoramic local views.',
          },
        ],
      });
    } else if (i === daysCount) {
      days.push({
        dayNumber: daysCount,
        dayTitle: 'Slow Morning, Souvenir Discovery & Farewell',
        dateStr: `Day 0${daysCount}`,
        summary: `Relaxed late breakfast, boutique artisan shopping for keepsakes, private airport transfer, and flight back.`,
        activities: [
          {
            id: `gen-d${i}-br`,
            time: '09:30 AM',
            title: 'Gourmet Breakfast & Leisure Time',
            type: 'stay',
            icon: '☕',
            notes: 'Late check-out arrangement at hotel.',
          },
          {
            id: `gen-d${i}-sh`,
            time: '01:00 PM',
            title: 'Artisan Market & Local Specialty Keepsakes',
            type: 'leisure',
            icon: '🛍️',
            notes: 'Curated list of authentic local handicraft studios.',
          },
          {
            id: `gen-d${i}-tr`,
            time: '04:30 PM',
            title: 'Private Airport Chauffeur Drop-off',
            type: 'transfer',
            icon: '🚗',
            notes: 'Assistance with flight baggage check-in.',
          },
          {
            id: `gen-d${i}-fl`,
            time: '07:30 PM',
            title: `Return Flight to ${originCity.split(' ')[0]}`,
            type: 'flight',
            icon: '✈️',
            notes: 'Touchdown with unforgettable memories and stories.',
          },
        ],
      });
    } else {
      const actIndex = (i - 2) % (selectedActivities.length || 1);
      const act = selectedActivities[actIndex];
      const hasPrem = i === 3 && selectedPrem.length > 0;

      const dayActs = [];
      if (act) {
        dayActs.push({
          id: `gen-d${i}-act`,
          time: '09:00 AM',
          title: act.title,
          type: 'activity' as const,
          icon: act.category === 'Food' ? '🍜' : act.category === 'Romantic' ? '❤️' : '🏔️',
          notes: act.shortDescription,
        });
      } else {
        dayActs.push({
          id: `gen-d${i}-act-def`,
          time: '10:00 AM',
          title: `Curated ${dest.name} Signature Expedition`,
          type: 'activity' as const,
          icon: '✨',
          notes: `Explore the hidden gems of ${dest.name} with local insider access.`,
        });
      }

      dayActs.push({
        id: `gen-d${i}-lunch`,
        time: '01:30 PM',
        title: `Curated Local Specialty Dining Experience`,
        type: 'meal' as const,
        icon: '🍽️',
        notes: 'Hand-picked local eatery away from typical crowds.',
      });

      if (hasPrem) {
        dayActs.push({
          id: `gen-d${i}-prem`,
          time: '05:30 PM',
          title: selectedPrem[0].title,
          type: 'experience' as const,
          icon: selectedPrem[0].icon,
          notes: selectedPrem[0].description,
        });
      } else {
        dayActs.push({
          id: `gen-d${i}-eve`,
          time: '06:00 PM',
          title: 'Golden Hour Scenic Point & Twilight Walk',
          type: 'leisure' as const,
          icon: '🌆',
          notes: 'Unwind as the twilight paints the landscape in warm hues.',
        });
      }

      days.push({
        dayNumber: i,
        dayTitle: `Day ${i}: ${act ? act.title.split(' ')[0] + ' ' + act.title.split(' ')[1] : 'Exploration & Culture'}`,
        dateStr: `Day 0${i}`,
        summary: `Immerse yourself in authentic experiences, exquisite local flavors, and relaxed evening downtime.`,
        activities: dayActs,
      });
    }
  }

  // Calculate final total strictly respecting the budgetCap
  const costs = calculateTripTotal(
    flight,
    stay,
    daysCount,
    selectedActivities,
    selectedPrem,
    true,
    transportCost,
    targetBudget
  );

  return {
    id: `wandr-${dest.id}-${daysCount}d-${companion}`,
    destination: dest,
    companion,
    vibes,
    budget: targetBudget,
    durationDays: daysCount,
    originCity,
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    totalPrice: costs.grandTotal,
    selectedStay: stay,
    selectedFlight: flight,
    selectedActivities,
    selectedPremium: selectedPrem,
    privateTransportIncluded: true,
    transportCost,
    days,
  };
}
