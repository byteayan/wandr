export type CompanionType = 'couple' | 'solo' | 'friends' | 'family';

export type VibeType =
  'Romantic' | 'Adventure' | 'Relaxing' | 'Luxury' | 'Party' | 'Nature' | 'Food' | 'Culture';

export type BudgetTier = '50k' | '100k' | '200k' | 'custom';

export type DurationOption = '3' | '5' | '7' | '10+';

export interface VibeScore {
  label: string;
  icon: string;
  score: number; // out of 10
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  vibeScores: VibeScore[];
  vibeTags: VibeType[];
  bestTime: string;
  estimatedBudget: string;
  idealDays: number;
  budgetFit: 'Great fit' | 'Excellent fit' | 'Luxury tier';
  recommendedFor: CompanionType[];
  highlights: string[];
  weather: {
    temp: string;
    condition: string;
    icon: string;
  };
}

export interface StayItem {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  propertyType:
    | 'Boutique Villa'
    | 'Luxury Resort'
    | 'Eco Lodge'
    | 'Heritage Suite'
    | 'Beachfront Chalet'
    | 'Modern Apartment';
  location: string;
  rating: number;
  reviewCount: number;
  images: string[];
  pricePerNight: number;
  roomType: string;
  amenities: string[];
  cancellationPolicy: string;
  coupleFriendly: boolean;
  pool: boolean;
  breakfastIncluded: boolean;
  luxuryTier: boolean;
  distanceToCenter: string;
  description: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  logo: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: string; // 'Direct' | '1 Stop (SIN)' etc.
  price: number;
  baggage: string;
  badge?: 'Cheapest' | 'Fastest' | 'Best Value' | 'Wandr Choice';
  cabin: 'Economy' | 'Premium Economy' | 'Business';
  emission: string;
}

export interface TrainClassOption {
  classType: string; // '1A' | '2A' | '3A' | 'CC' | 'EC' | 'Executive'
  className: string; // 'AC First Class' | 'Exec Chair Car'
  price: number;
  status: string; // 'Available - 42' | 'RAC 4' | 'WL 12'
  statusType: 'available' | 'rac' | 'waitlist';
  freeCancellation?: boolean;
}

export interface TrainOption {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType:
    'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Tejas Superfast' | 'Express' | 'Shinkansen Bullet';
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  distance: string;
  punctualityScore: string;
  badge?: 'Fastest' | 'Top Rated' | 'Scenic Route' | 'Wandr Favorite' | 'Best Value' | string;
  runsOnDays: string[];
  classes: TrainClassOption[];
  amenities: string[];
  foodIncluded: boolean;
  carbonSavings: string;
}

export interface BusOption {
  id: string;
  operator: string;
  busType:
    | 'AC Sleeper (2+1)'
    | 'Multi-Axle Volvo AC'
    | 'BharatBenz Premium'
    | 'Semi-Sleeper Luxury'
    | 'Scania Multi-Axle';
  fromCity: string;
  toCity: string;
  boardingPoint: string;
  droppingPoint: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  badge?: 'High Safety' | 'Top Cleanliness' | 'Express Route' | 'Best Value';
  amenities: string[];
  liveTracking: boolean;
  cancellationPolicy: string;
}

export interface CabOption {
  id: string;
  vehicleName: string;
  vehicleType:
    'Sedan Comfort' | 'Luxury SUV' | 'Innova Crysta' | 'Premium EV Sedan' | 'Executive Van';
  capacity: string;
  luggageCapacity: string;
  pricePerTrip: number;
  perKmRate: string;
  driverRating: number;
  driverExperience: string;
  inclusions: string[];
  estimatedTime: string;
  image: string;
}

export type TravelMode = 'flights' | 'trains' | 'buses' | 'cabs';

export interface ActivityItem {
  id: string;
  title: string;
  category: VibeType;
  location: string;
  destinationId: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  shortDescription: string;
  included: string[];
  badge?: string;
  timeSlot?: string;
}

export interface PremiumExperience {
  id: string;
  title: string;
  icon: string;
  category: 'Romantic' | 'Comfort' | 'VIP' | 'Wellness' | 'Personalized';
  destinationId: string;
  price: number;
  image: string;
  description: string;
  includes: string[];
  recommendedFor: CompanionType[];
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  type: 'flight' | 'transfer' | 'stay' | 'meal' | 'activity' | 'experience' | 'leisure';
  icon: string;
  cost?: number;
  location?: string;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  dayTitle: string;
  dateStr?: string;
  summary: string;
  activities: ItineraryActivity[];
}

export interface TripPlan {
  id: string;
  destination: Destination;
  companion: CompanionType;
  vibes: VibeType[];
  budget: number;
  durationDays: number;
  originCity: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  selectedStay: StayItem;
  selectedFlight: FlightOption;
  selectedTransitMode?: 'flight' | 'train' | 'bus' | 'cab';
  selectedTrain?: TrainOption;
  selectedBus?: BusOption;
  selectedCab?: CabOption;
  selectedActivities: ActivityItem[];
  selectedPremium: PremiumExperience[];
  privateTransportIncluded: boolean;
  transportCost: number;
  days: ItineraryDay[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  isPremium?: boolean;
  premiumTier?: 'Wanderlust Pro' | 'Wanderlust Black' | null;
  premiumValidUntil?: string;
  upcomingTrips: {
    id: string;
    destinationName: string;
    country: string;
    coverImage: string;
    dates: string;
    days: number;
    companion: string;
    status: 'Confirmed' | 'Designing' | 'Completed';
    totalCost: number;
  }[];
  pastTrips: {
    id: string;
    destinationName: string;
    country: string;
    coverImage: string;
    dates: string;
    year: string;
    rating: number;
  }[];
  savedStayIds: string[];
  savedDestinationIds: string[];
  savedActivityIds: string[];
  savedTrainIds?: string[];
  savedBusIds?: string[];
}

export interface TripFeedbackData {
  tripId: string;
  destinationName: string;
  country: string;
  coverImage: string;
  dates: string;
  durationDays?: number;
  companion?: string;
}

export interface TripFeedbackSubmission {
  tripId: string;
  overallRating: number;
  aiPlanningRating: number;
  stayRating: number;
  transitRating: number;
  activitiesRating: number;
  selectedTags: string[];
  comments: string;
  recommendationScore: 'definitely' | 'likely' | 'neutral' | 'unlikely';
  favoriteMemory?: string;
  submittedAt: string;
}
