export interface DayWeatherForecast {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  condition: string;
  conditionCategory: 'sunny' | 'cloudy' | 'rainy' | 'breezy' | 'snow';
  tempMaxC: number;
  tempMinC: number;
  tempMaxF: number;
  tempMinF: number;
  precipitationPercent: number;
  humidityPercent: number;
  uvIndex: number;
  windSpeedKmh: number;
  summary: string;
  packingTip: string;
  bestActivityWindow: string;
}

export interface DestinationWeatherReport {
  destinationId: string;
  destinationName: string;
  country: string;
  currentTempC: number;
  currentTempF: number;
  currentCondition: string;
  seasonName: string;
  climateOverview: string;
  isPeakSeason: boolean;
  sunriseTime: string;
  sunsetTime: string;
  averageRainfallDays: number;
  generalPackingTips: string[];
  daysForecast: DayWeatherForecast[];
  aiWeatherSuitabilityScore: number; // e.g. 96
  aiSuitabilityVerdict: string;
  lastUpdated: string;
}

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

interface DestinationClimateProfile {
  baseTempC: number;
  tempRange: [number, number]; // [min, max]
  climateType: 'tropical' | 'mediterranean' | 'alpine' | 'desert' | 'subtropical' | 'temperate';
  seasonName: string;
  climateOverview: string;
  sunrise: string;
  sunset: string;
  rainyLikelihood: number; // 0 to 100
  generalPacking: string[];
}

const CLIMATE_PROFILES: Record<string, DestinationClimateProfile> = {
  bali: {
    baseTempC: 28,
    tempRange: [24, 31],
    climateType: 'tropical',
    seasonName: 'Dry Tropical Season',
    climateOverview: 'Gentle offshore ocean breezes with crystal clear sunny skies and warm evenings.',
    sunrise: '06:12 AM',
    sunset: '06:28 PM',
    rainyLikelihood: 12,
    generalPacking: ['Breathable linen shirts', 'Polarized UV sunglasses', 'Reef-safe SPF 50+', 'Light evening wrap', 'Swimwear & dry bag'],
  },
  vietnam: {
    baseTempC: 25,
    tempRange: [21, 29],
    climateType: 'tropical',
    seasonName: 'Mild & Pleasant Spring',
    climateOverview: 'Comfortable humidity, crisp morning mist over Ha Long Bay, and golden afternoon sun in Hoi An.',
    sunrise: '05:48 AM',
    sunset: '06:05 PM',
    rainyLikelihood: 15,
    generalPacking: ['Comfortable walking sandals', 'Light cotton layers', 'Compact travel umbrella', 'UV sun hat', 'Light jacket for bay cruises'],
  },
  kashmir: {
    baseTempC: 17,
    tempRange: [9, 22],
    climateType: 'alpine',
    seasonName: 'Crisp Alpine Spring/Autumn',
    climateOverview: 'Refreshing pine mountain air with chilly twilight temperatures and warm sunny afternoons.',
    sunrise: '05:35 AM',
    sunset: '07:15 PM',
    rainyLikelihood: 10,
    generalPacking: ['Pashmina/Woolen stole', 'Thermal inner layer for night', 'Trekking boots', 'Windcheater jacket', 'Moisturizer & lip balm'],
  },
  goa: {
    baseTempC: 30,
    tempRange: [25, 33],
    climateType: 'tropical',
    seasonName: 'Coastal Sunny Season',
    climateOverview: 'Endless blue skies, warm Arabian sea breezes, and postcard-perfect 6 PM golden hours.',
    sunrise: '06:18 AM',
    sunset: '06:45 PM',
    rainyLikelihood: 8,
    generalPacking: ['Cotton beachwear', 'Slide sandals', 'High-SPF Sunscreen', 'Open-collar resort shirts', 'Sunglasses & beach tote'],
  },
  amalfi: {
    baseTempC: 24,
    tempRange: [18, 27],
    climateType: 'mediterranean',
    seasonName: 'Mediterranean Azure Season',
    climateOverview: 'Cobalt skies over the Tyrrhenian sea with balmy lemon-scented coastal breezes.',
    sunrise: '06:05 AM',
    sunset: '07:50 PM',
    rainyLikelihood: 8,
    generalPacking: ['Italian linen trousers', 'Sturdy walking shoes for cliff steps', 'Chic sunglasses', 'Light cardigan for yachting', 'Evening dinner dress'],
  },
  kyoto: {
    baseTempC: 22,
    tempRange: [15, 25],
    climateType: 'temperate',
    seasonName: 'Temperate Garden Season',
    climateOverview: 'Temperate and clear, ideal for temple strolling and bamboo grove morning walks.',
    sunrise: '05:15 AM',
    sunset: '06:35 PM',
    rainyLikelihood: 18,
    generalPacking: ['Easy slip-on walking shoes', 'Layered light sweater', 'Pocket rain poncho', 'Daypack for shrines', 'Refillable water tumbler'],
  },
  dubai: {
    baseTempC: 32,
    tempRange: [24, 36],
    climateType: 'desert',
    seasonName: 'Sunny Desert Glow',
    climateOverview: 'Bright sunny skies throughout the day with cooler desert night breezes.',
    sunrise: '05:50 AM',
    sunset: '06:55 PM',
    rainyLikelihood: 2,
    generalPacking: ['Light breathable cotton', 'UV protective sunglasses', 'Light scarf for AC interiors', 'Desert evening jacket', 'Hydration pack'],
  },
  phuket: {
    baseTempC: 29,
    tempRange: [25, 32],
    climateType: 'tropical',
    seasonName: 'Andaman Dry Season',
    climateOverview: 'Calm turquoise seas, vibrant sunshine, and gentle evening breeze perfect for night markets.',
    sunrise: '06:20 AM',
    sunset: '06:35 PM',
    rainyLikelihood: 14,
    generalPacking: ['Quick-dry shorts', 'Snorkeling mask/goggles', 'Waterproof phone pouch', 'Wide-brim hat', 'Sunscreen'],
  },
  ladakh: {
    baseTempC: 15,
    tempRange: [5, 20],
    climateType: 'alpine',
    seasonName: 'High-Altitude Sunny Crisp',
    climateOverview: 'Pristine high-altitude sunshine, zero humidity, and chilly starry nights.',
    sunrise: '05:25 AM',
    sunset: '07:20 PM',
    rainyLikelihood: 4,
    generalPacking: ['Heavy fleece jacket', 'SPF 50+ zinc cream', 'UV 400 sunglasses', 'Thermals for Pangong night', 'Electrolyte hydration sachets'],
  },
  jaipur: {
    baseTempC: 27,
    tempRange: [18, 31],
    climateType: 'subtropical',
    seasonName: 'Royal Heritage Season',
    climateOverview: 'Pleasant daytime exploration weather with cool desert evenings around fort courtyards.',
    sunrise: '06:00 AM',
    sunset: '06:40 PM',
    rainyLikelihood: 5,
    generalPacking: ['Comfortable cotton kurtas/shirts', 'Walking sneakers', 'Sun hat for fort climbs', 'Light shawl for evening dining', 'Moisturizer'],
  },
};

const DEFAULT_PROFILE: DestinationClimateProfile = {
  baseTempC: 26,
  tempRange: [20, 29],
  climateType: 'subtropical',
  seasonName: 'Ideal Travel Season',
  climateOverview: 'Mild and pleasant conditions with optimal visibility and comfortable sightseeing temperatures.',
  sunrise: '06:00 AM',
  sunset: '06:30 PM',
  rainyLikelihood: 10,
  generalPacking: ['Light casual layers', 'Sunglasses & SPF', 'Comfortable walking footwear', 'Light evening jacket'],
};

const WEATHER_CONDITIONS = [
  { text: 'Sun-Drenched & Clear', category: 'sunny' as const, icon: '☀️' },
  { text: 'Pleasant & Mild Breeze', category: 'breezy' as const, icon: '🌤️' },
  { text: 'Partly Cloudy with Golden Sunset', category: 'sunny' as const, icon: '⛅' },
  { text: 'Clear Azure Skies', category: 'sunny' as const, icon: '☀️' },
  { text: 'Warm Tropical Calm', category: 'sunny' as const, icon: '🌴' },
  { text: 'Brief 15-min Passing Mist', category: 'rainy' as const, icon: '🌦️' },
];

/**
 * Generate a detailed weather forecast report for any destination and date range
 */
export function generateDestinationWeatherForecast(
  destinationId: string,
  destinationName: string,
  country: string,
  durationDays: number = 5,
  startDateStr?: string
): DestinationWeatherReport {
  const profileKey = destinationId.toLowerCase();
  const profile = CLIMATE_PROFILES[profileKey] || DEFAULT_PROFILE;

  const daysForecast: DayWeatherForecast[] = [];
  const baseDate = new Date();
  // If startDateStr is passed, try parsing or default to current date + 7 days
  if (startDateStr) {
    const parsed = new Date(startDateStr);
    if (!isNaN(parsed.getTime())) {
      baseDate.setTime(parsed.getTime());
    }
  }

  const daysCount = Math.max(3, Math.min(durationDays, 10));

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);

    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Slight variance per day
    const tempDelta = (i % 3 === 0 ? 1 : i % 2 === 0 ? -1 : 0);
    const dayMin = profile.tempRange[0] + tempDelta;
    const dayMax = profile.tempRange[1] + tempDelta;

    const conditionObj = WEATHER_CONDITIONS[(i + destinationName.length) % WEATHER_CONDITIONS.length];
    const precip = Math.max(5, Math.round(profile.rainyLikelihood + ((i * 4) % 15) - 5));
    const humidity = profile.climateType === 'tropical' ? 68 + (i % 8) : profile.climateType === 'desert' ? 28 + (i % 5) : 52 + (i % 6);
    const uvIndex = profile.climateType === 'desert' || profile.climateType === 'tropical' ? 8 : 6;
    const windSpeed = 10 + ((i * 3) % 12);

    let packingTip = 'Light breathable fabric & sunglasses';
    let bestActivityWindow = '07:30 AM – 11:30 AM & 04:30 PM – 07:00 PM';

    if (conditionObj.category === 'sunny') {
      packingTip = 'Wide-brim hat, sunglasses & UV protection';
      bestActivityWindow = 'Early morning hikes & late afternoon golden hour';
    } else if (conditionObj.category === 'rainy') {
      packingTip = 'Compact rain jacket & waterproof pouch';
      bestActivityWindow = 'Midday cozy cafe visits & indoor galleries';
    } else if (profile.climateType === 'alpine') {
      packingTip = 'Layered fleece, windcheater & warm socks';
      bestActivityWindow = '10:00 AM – 04:00 PM for warmest sun';
    }

    daysForecast.push({
      dayNumber: i + 1,
      dateStr: formattedDate,
      dayOfWeek: dayName,
      condition: conditionObj.text,
      conditionCategory: conditionObj.category,
      tempMaxC: dayMax,
      tempMinC: dayMin,
      tempMaxF: cToF(dayMax),
      tempMinF: cToF(dayMin),
      precipitationPercent: precip,
      humidityPercent: humidity,
      uvIndex,
      windSpeedKmh: windSpeed,
      summary: `${conditionObj.text} with high of ${dayMax}°C. ${precip < 15 ? 'Excellent visibility & zero rain interference.' : 'Brief refreshing shower possible in late afternoon.'}`,
      packingTip,
      bestActivityWindow,
    });
  }

  return {
    destinationId,
    destinationName,
    country,
    currentTempC: profile.baseTempC,
    currentTempF: cToF(profile.baseTempC),
    currentCondition: WEATHER_CONDITIONS[0].text,
    seasonName: profile.seasonName,
    climateOverview: profile.climateOverview,
    isPeakSeason: true,
    sunriseTime: profile.sunrise,
    sunsetTime: profile.sunset,
    averageRainfallDays: Math.round(profile.rainyLikelihood / 4),
    generalPackingTips: profile.generalPacking,
    daysForecast,
    aiWeatherSuitabilityScore: 95,
    aiSuitabilityVerdict: 'Optimal Climate Window • Ideal for Outdoor Itineraries',
    lastUpdated: 'Live AI Climate Sync',
  };
}

/**
 * Mock async fetch service to simulate live API fetching with caching
 */
export async function fetchDestinationWeatherForecast(
  destinationId: string,
  destinationName: string,
  country: string,
  durationDays: number = 5,
  startDateStr?: string
): Promise<DestinationWeatherReport> {
  // Simulate rapid 200ms async delay
  await new Promise((r) => setTimeout(r, 200));
  return generateDestinationWeatherForecast(destinationId, destinationName, country, durationDays, startDateStr);
}
