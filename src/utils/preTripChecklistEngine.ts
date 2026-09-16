import { TripPlan, Destination, ActivityItem, PremiumExperience } from '../types/travel';

export type ChecklistCategory =
  | 'documents'
  | 'clothing'
  | 'activity_gear'
  | 'electronics'
  | 'health_toiletries'
  | 'custom';

export interface ChecklistItem {
  id: string;
  title: string;
  category: ChecklistCategory;
  categoryLabel: string;
  reasonTag: string; // e.g. "Tropical Climate", "Scuba Tour", "Flight Mandatory"
  isEssential: boolean;
  packed: boolean;
  notes?: string;
  isCustom?: boolean;
}

export interface PreTripChecklistData {
  destinationName: string;
  country: string;
  durationDays: number;
  readinessPercentage: number;
  totalItemsCount: number;
  packedItemsCount: number;
  items: ChecklistItem[];
  luggageAdvice: {
    carryOnLimits: string;
    checkedBagAdvice: string;
    prohibitedInChecked: string[];
    packingHacks: string[];
  };
}

/**
 * Generates an intelligent, tailored checklist based on destination climate,
 * companion type, duration, and planned activities.
 */
export function generatePreTripChecklist(tripPlan: TripPlan): PreTripChecklistData {
  const dest = tripPlan.destination;
  const destId = dest?.id?.toLowerCase() || '';
  const country = dest?.country?.toLowerCase() || '';
  const duration = tripPlan.durationDays || 5;
  const companion = tripPlan.companion || 'Couple';

  const items: ChecklistItem[] = [];

  // Helper to add items
  const addItem = (
    id: string,
    title: string,
    category: ChecklistCategory,
    categoryLabel: string,
    reasonTag: string,
    isEssential: boolean = false,
    notes?: string
  ) => {
    if (!items.some((it) => it.id === id)) {
      items.push({
        id,
        title,
        category,
        categoryLabel,
        reasonTag,
        isEssential,
        packed: false,
        notes,
      });
    }
  };

  // 1. MANDATORY DOCUMENTS & ESSENTIALS
  const isInternational = country !== 'india';

  if (isInternational) {
    addItem(
      'doc-passport',
      'Passport (Valid 6+ months from travel date)',
      'documents',
      'Documents & Wallet',
      'International Border Clearance',
      true,
      'Keep physical original + 2 photocopies and offline cloud PDF copies'
    );
    addItem(
      'doc-visa',
      'Visa / e-Visa / Arrival Declaration QR',
      'documents',
      'Documents & Wallet',
      'Immigration Requirement',
      true,
      'Fill digital arrival card / tourist pass 48h prior to flight'
    );
    addItem(
      'doc-insurance',
      'Travel & Medical Insurance Policy Card',
      'documents',
      'Documents & Wallet',
      'Emergency Protection',
      true,
      'Ensure 24/7 overseas assistance hotline number is saved in phone'
    );
    addItem(
      'doc-forex',
      'Zero-Forex Debit/Credit Card & Emergency Cash ($100-200)',
      'documents',
      'Documents & Wallet',
      'Payment & Local Taxis',
      true,
      'Activate international transactions on your banking app'
    );
  } else {
    addItem(
      'doc-gov-id',
      'Government Photo ID (Aadhaar / Voter ID / Driving License)',
      'documents',
      'Documents & Wallet',
      'Airport & Hotel Check-in',
      true,
      'Original ID required for airport security and hotel check-in'
    );
  }

  addItem(
    'doc-tickets',
    'Flight / Transit Tickets & Hotel Confirmation Vouchers',
    'documents',
    'Documents & Wallet',
    'Wandr Verified Bookings',
    true,
    'Download offline PDF vouchers directly from Wandr app'
  );

  // 2. CLIMATE & APPAREL PACKING
  const isTropical =
    destId.includes('bali') ||
    destId.includes('phuket') ||
    destId.includes('goa') ||
    destId.includes('vietnam') ||
    destId.includes('andaman') ||
    country.includes('indonesia') ||
    country.includes('thailand');

  const isAlpineCold =
    destId.includes('kashmir') ||
    destId.includes('ladakh') ||
    destId.includes('manali') ||
    destId.includes('shimla') ||
    destId.includes('switzerland') ||
    destId.includes('alps');

  const isMediterraneanOrEuropean =
    destId.includes('amalfi') ||
    destId.includes('rome') ||
    destId.includes('paris') ||
    country.includes('italy') ||
    country.includes('france');

  const isDesert =
    destId.includes('dubai') ||
    destId.includes('jaipur') ||
    destId.includes('udaipur') ||
    destId.includes('jaisalmer') ||
    country.includes('uae');

  const isJapanOrEastAsia =
    destId.includes('kyoto') ||
    destId.includes('tokyo') ||
    country.includes('japan');

  if (isTropical) {
    addItem(
      'cloth-linen',
      `${Math.min(duration + 1, 6)}x Breathable Linen & Cotton Outfits`,
      'clothing',
      'Clothing & Apparel',
      'Tropical Humidity (28°C-32°C)',
      true,
      'Light colors reflect tropical sun and dry quickly'
    );
    addItem(
      'cloth-swimwear',
      '2x Quick-Dry Swimwear & UV Rashguard',
      'clothing',
      'Clothing & Apparel',
      'Beach & Pool Resorts',
      true,
      'Having 2 pairs allows one to dry while you wear the other'
    );
    addItem(
      'cloth-sunhat',
      'Wide-Brim Sun Hat & UV400 Polarized Sunglasses',
      'clothing',
      'Clothing & Apparel',
      'High UV Index (8-10)',
      true
    );
    addItem(
      'cloth-sandals',
      'Waterproof Slide Sandals & Breathable Walkers',
      'clothing',
      'Clothing & Apparel',
      'Island & Coastal Walking',
      false
    );
    addItem(
      'cloth-evening-resort',
      'Resort Casual Evening Wear for Sunset Lounges',
      'clothing',
      'Clothing & Apparel',
      'Dining & Beach Clubs',
      false
    );
  } else if (isAlpineCold) {
    addItem(
      'cloth-thermals',
      '2-3x Merino Wool Thermal Base Layers (Tops & Bottoms)',
      'clothing',
      'Clothing & Apparel',
      'Alpine Mountain Chills (5°C-15°C)',
      true,
      'Crucial for early morning viewpoints and high-altitude nights'
    );
    addItem(
      'cloth-fleece-jacket',
      'Windproof Down / Heavy Fleece Jacket',
      'clothing',
      'Clothing & Apparel',
      'Mountain Wind & Elevation',
      true
    );
    addItem(
      'cloth-trekking-boots',
      'Sturdy Ankle-Support Waterproof Boots & Wool Socks',
      'clothing',
      'Clothing & Apparel',
      'Rugged Valley & Snow Trails',
      true
    );
    addItem(
      'cloth-gloves-beanie',
      'Thermal Beanie, Neck Gaiter & Touchscreen Gloves',
      'clothing',
      'Clothing & Apparel',
      'Cold Mountain Twilight',
      false
    );
  } else if (isMediterraneanOrEuropean) {
    addItem(
      'cloth-euro-smart',
      'Chic Smart-Casual Outfits & Tailored Linen Trousers',
      'clothing',
      'Clothing & Apparel',
      'Mediterranean Resort Elegance',
      true
    );
    addItem(
      'cloth-cobblestone-shoes',
      'Cushioned Walking Sneakers for Cobblestones & Cliff Steps',
      'clothing',
      'Clothing & Apparel',
      'Coastal Village Exploration',
      true,
      'Amalfi & European alleys have thousands of steps'
    );
    addItem(
      'cloth-light-cardigan',
      'Light Evening Cardigan / Yachting Windbreaker',
      'clothing',
      'Clothing & Apparel',
      'Breezy Sea Ferry & Sunset Cruises',
      false
    );
  } else if (isDesert) {
    addItem(
      'cloth-desert-cotton',
      'Loose-Fitting Breathable Long Cotton Garments',
      'clothing',
      'Clothing & Apparel',
      'Desert Sun & Air Conditioning',
      true
    );
    addItem(
      'cloth-desert-scarf',
      'Lightweight Cotton Scarf / Pashmina Wrap',
      'clothing',
      'Clothing & Apparel',
      'Desert Wind & Cultural Sites',
      false
    );
    addItem(
      'cloth-desert-evening',
      'Warm Evening Layer for Night Desert Safaris',
      'clothing',
      'Clothing & Apparel',
      'Rapid Night Temperature Drop',
      false
    );
  } else if (isJapanOrEastAsia) {
    addItem(
      'cloth-slipon-shoes',
      'Comfortable Slip-On Walking Shoes (Temple-Friendly)',
      'clothing',
      'Clothing & Apparel',
      '15k+ Daily Steps & Tatami Entries',
      true,
      'Easy to take off and put on at shrines and ryokans'
    );
    addItem(
      'cloth-layered-casual',
      'Layerable Casual Separates & Light Sweater',
      'clothing',
      'Clothing & Apparel',
      'Temperate Spring/Autumn (16°C-24°C)',
      false
    );
    addItem(
      'cloth-pocket-umbrella',
      'Ultralight Folding Umbrella / Windproof Poncho',
      'clothing',
      'Clothing & Apparel',
      'Passing Coastal Showers',
      false
    );
  } else {
    addItem(
      'cloth-general-casual',
      `${Math.min(duration + 1, 5)}x Casual Outfits for Daily Sightseeing`,
      'clothing',
      'Clothing & Apparel',
      'General Sightseeing',
      true
    );
    addItem(
      'cloth-walking-shoes',
      'Comfortable Walking Sneakers & Extra Socks',
      'clothing',
      'Clothing & Apparel',
      'City Walking',
      true
    );
  }

  // 3. ACTIVITY-SPECIFIC GEAR (Derived from selected activities & premium tours)
  const allActivities = [
    ...(tripPlan.selectedActivities || []),
    ...(tripPlan.selectedPremium || []),
  ];

  const hasWaterActivity = allActivities.some((act) => {
    const title = (act.title || '').toLowerCase();
    return (
      title.includes('scuba') ||
      title.includes('snorkel') ||
      title.includes('dive') ||
      title.includes('surf') ||
      title.includes('kayak') ||
      title.includes('boat') ||
      title.includes('yacht') ||
      title.includes('cruise') ||
      title.includes('waterfall')
    );
  });

  const hasHikingOrTrekking = allActivities.some((act) => {
    const title = (act.title || '').toLowerCase();
    return (
      title.includes('trek') ||
      title.includes('hike') ||
      title.includes('volcano') ||
      title.includes('camp') ||
      title.includes('climb') ||
      title.includes('safari')
    );
  });

  const hasTempleOrReligiousSite = allActivities.some((act) => {
    const title = (act.title || '').toLowerCase();
    return (
      title.includes('temple') ||
      title.includes('shrine') ||
      title.includes('monastery') ||
      title.includes('palace') ||
      title.includes('fort') ||
      title.includes('mosque')
    );
  });

  const hasLuxuryOrNightclub = allActivities.some((act) => {
    const title = (act.title || '').toLowerCase();
    return (
      title.includes('dinner') ||
      title.includes('michelin') ||
      title.includes('club') ||
      title.includes('lounge') ||
      title.includes('rooftop') ||
      title.includes('helicopter')
    );
  });

  if (hasWaterActivity || isTropical) {
    addItem(
      'gear-dry-bag',
      '10L-20L Waterproof Floating Dry Bag',
      'activity_gear',
      'Activity & Experience Gear',
      'Watersports & Boat Tours',
      true,
      'Protects phones, camera, and wallets from sea spray'
    );
    addItem(
      'gear-waterproof-phone-case',
      'Underwater IPX8 Waterproof Phone Pouch with Lanyard',
      'activity_gear',
      'Activity & Experience Gear',
      'Lagoon & Snorkel Photography',
      false
    );
    addItem(
      'gear-microfiber-towel',
      'Quick-Drying Compact Microfiber Beach Towel',
      'activity_gear',
      'Activity & Experience Gear',
      'Excursions & Island Hopping',
      false
    );
  }

  if (hasHikingOrTrekking || isAlpineCold) {
    addItem(
      'gear-daypack',
      '20L-30L Lightweight Hiking Daypack with Rain Cover',
      'activity_gear',
      'Activity & Experience Gear',
      'Trek & Outdoor Excursion',
      true
    );
    addItem(
      'gear-hydration-flask',
      'Insulated Refillable Thermal Water Bottle (1L)',
      'activity_gear',
      'Activity & Experience Gear',
      'Hydration on Trails',
      true
    );
    addItem(
      'gear-blister-prevention',
      'Hydrocolloid Blister Bandages & Electrolyte Mix',
      'activity_gear',
      'Activity & Experience Gear',
      'High Endurance Hiking',
      false
    );
  }

  if (hasTempleOrReligiousSite || destId.includes('bali') || destId.includes('kyoto') || destId.includes('jaipur')) {
    addItem(
      'gear-temple-sarong',
      'Modest Sarong / Scarf Covering Shoulders & Knees',
      'activity_gear',
      'Activity & Experience Gear',
      'Sacred Temple Dress Code',
      true,
      'Mandatory at Balinese temples, Japanese shrines & Indian forts'
    );
  }

  if (hasLuxuryOrNightclub || companion === 'Couple') {
    addItem(
      'gear-evening-attire',
      'Dressy Evening Outfit & Collared Shirt / Cocktail Dress',
      'activity_gear',
      'Activity & Experience Gear',
      'VIP Sunset Dining / Club Entry',
      false
    );
  }

  // 4. ELECTRONICS & POWER
  addItem(
    'tech-powerbank',
    '10,000mAh – 20,000mAh Power Bank (Keep in Carry-On)',
    'electronics',
    'Electronics & Gadgets',
    'All-Day Navigation & Photos',
    true,
    'Aviation rule: Power banks MUST be in cabin bag, NOT checked luggage'
  );

  if (isInternational) {
    addItem(
      'tech-universal-adapter',
      'Universal Travel Adapter with Multi-USB-C Fast Ports',
      'electronics',
      'Electronics & Gadgets',
      'International Wall Sockets',
      true,
      'Compatible with Type C, G, A, and I sockets worldwide'
    );
    addItem(
      'tech-esim',
      'eSIM QR Code / International Roaming Activated',
      'electronics',
      'Electronics & Gadgets',
      'Immediate Airport Connectivity',
      true,
      'Set up Airalo / Maya Mobile or Telco Roaming before departure'
    );
  }

  addItem(
    'tech-cables-headphones',
    'Noise-Cancelling Earphones & Extra Long Braided Charging Cable',
    'electronics',
    'Electronics & Gadgets',
    'Flight Comfort & Transit',
    false
  );

  // 5. HEALTH, HYGIENE & TOILETRIES
  addItem(
    'health-medkit',
    'Personal First-Aid & Essential Meds (Paracetamol, Antacid, Bandages)',
    'health_toiletries',
    'Health, Skincare & Toiletries',
    'Travel Wellness Essentials',
    true,
    'Carry prescription slip for any custom medications'
  );

  if (isTropical || isDesert) {
    addItem(
      'health-sunscreen',
      'Reef-Safe High-SPF 50+ Sunscreen & Aloe Vera Gel',
      'health_toiletries',
      'Health, Skincare & Toiletries',
      'Tropical Sun Protection',
      true,
      'Reef-safe formula protects coral ecosystems in tropical waters'
    );
    addItem(
      'health-mosquito-repellent',
      'DEET / Citronella Mosquito Repellent Spray & Roll-on',
      'health_toiletries',
      'Health, Skincare & Toiletries',
      'Tropical Evening & Forest Walks',
      true
    );
  }

  if (isAlpineCold) {
    addItem(
      'health-lipbalm-moisturizer',
      'Intensive Lip Balm (SPF 30) & Heavy Hydrating Cream',
      'health_toiletries',
      'Health, Skincare & Toiletries',
      'Dry Alpine Air & Windburn',
      true
    );
  }

  addItem(
    'health-liquids-pouch',
    'TSA Clear 1-Quart Pouch for Carry-On Liquids (<100ml each)',
    'health_toiletries',
    'Health, Skincare & Toiletries',
    'Airport Security Compliance',
    false
  );

  addItem(
    'health-sanitizer-wipes',
    'Antibacterial Hand Wipes & Travel Pocket Tissues',
    'health_toiletries',
    'Health, Skincare & Toiletries',
    'Transit Hygiene & Street Food',
    false
  );

  const totalItemsCount = items.length;
  const packedItemsCount = items.filter((i) => i.packed).length;
  const readinessPercentage = Math.round((packedItemsCount / Math.max(1, totalItemsCount)) * 100);

  return {
    destinationName: dest?.name || 'Destination',
    country: dest?.country || 'Global',
    durationDays: duration,
    readinessPercentage,
    totalItemsCount,
    packedItemsCount,
    items,
    luggageAdvice: {
      carryOnLimits: 'Cabin Bag: 7kg limit (Max 55 x 40 x 20 cm) + 1 small personal laptop/tote item.',
      checkedBagAdvice: 'Checked Luggage: 15kg to 20kg included depending on airline. Use TSA-approved cable locks.',
      prohibitedInChecked: [
        'Lithium-ion Power Banks (Cabin only)',
        'Loose Spare Batteries & E-Cigarettes',
        'Valuable Jewelry & Cash',
        'Original Passports & Critical Medications',
      ],
      packingHacks: [
        'Roll garments instead of folding to prevent deep creases and save 35% space.',
        'Use compression packing cubes to separate daily outfits from laundry.',
        'Pack 1 change of clothes & swimwear in your cabin bag in case of checked luggage delay.',
        'Take photos of your luggage exterior and baggage claim tags before boarding.',
      ],
    },
  };
}
