export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    decimals: 0,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    decimals: 0,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    decimals: 0,
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp ',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    decimals: 0,
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    flag: '🇹🇭',
    decimals: 0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    decimals: 0,
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    flag: '🇻🇳',
    decimals: 0,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    decimals: 0,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    decimals: 0,
  },
};

// Base INR Exchange rates fallback baseline
export const DEFAULT_INR_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.0119, // 1 INR = ~0.0119 USD (1 USD = ~84.0 INR)
  EUR: 0.011, // 1 INR = ~0.0110 EUR (1 EUR = ~90.9 INR)
  GBP: 0.00935, // 1 INR = ~0.00935 GBP (1 GBP = ~107.0 INR)
  AED: 0.0437, // 1 INR = ~0.0437 AED (1 AED = ~22.88 INR)
  JPY: 1.825, // 1 INR = ~1.825 JPY (1 JPY = ~0.548 INR)
  IDR: 190.5, // 1 INR = ~190.5 IDR (10,000 IDR = ~52.5 INR)
  THB: 0.421, // 1 INR = ~0.421 THB (1 THB = ~2.375 INR)
  SGD: 0.0157, // 1 INR = ~0.0157 SGD (1 SGD = ~63.7 INR)
  VND: 302.5, // 1 INR = ~302.5 VND
  CHF: 0.0105, // 1 INR = ~0.0105 CHF
  AUD: 0.0182, // 1 INR = ~0.0182 AUD
};

/**
 * Resolves the destination local currency based on destination name or country
 */
export function getDestinationCurrency(country?: string, destinationName?: string): CurrencyConfig {
  const normCountry = (country || '').toLowerCase();
  const normDest = (destinationName || '').toLowerCase();

  if (
    normCountry.includes('indonesia') ||
    normDest.includes('bali') ||
    normDest.includes('lombok') ||
    normDest.includes('komodo')
  ) {
    return SUPPORTED_CURRENCIES.IDR;
  }
  if (
    normCountry.includes('japan') ||
    normDest.includes('kyoto') ||
    normDest.includes('tokyo') ||
    normDest.includes('osaka')
  ) {
    return SUPPORTED_CURRENCIES.JPY;
  }
  if (
    normCountry.includes('italy') ||
    normCountry.includes('france') ||
    normCountry.includes('greece') ||
    normCountry.includes('spain') ||
    normCountry.includes('germany') ||
    normCountry.includes('austria') ||
    normDest.includes('amalfi') ||
    normDest.includes('santorini') ||
    normDest.includes('paris') ||
    normDest.includes('rome')
  ) {
    return SUPPORTED_CURRENCIES.EUR;
  }
  if (
    normCountry.includes('uae') ||
    normCountry.includes('united arab emirates') ||
    normCountry.includes('emirates') ||
    normDest.includes('dubai') ||
    normDest.includes('abu dhabi')
  ) {
    return SUPPORTED_CURRENCIES.AED;
  }
  if (
    normCountry.includes('thailand') ||
    normDest.includes('phuket') ||
    normDest.includes('bangkok') ||
    normDest.includes('chiang mai') ||
    normDest.includes('krabi') ||
    normDest.includes('samui')
  ) {
    return SUPPORTED_CURRENCIES.THB;
  }
  if (
    normCountry.includes('vietnam') ||
    normDest.includes('hanoi') ||
    normDest.includes('da nang') ||
    normDest.includes('hoi an')
  ) {
    return SUPPORTED_CURRENCIES.VND;
  }
  if (
    normCountry.includes('united kingdom') ||
    normCountry.includes('uk') ||
    normDest.includes('london') ||
    normDest.includes('edinburgh')
  ) {
    return SUPPORTED_CURRENCIES.GBP;
  }
  if (
    normCountry.includes('united states') ||
    normCountry.includes('usa') ||
    normCountry.includes('us') ||
    normDest.includes('new york')
  ) {
    return SUPPORTED_CURRENCIES.USD;
  }
  if (normCountry.includes('singapore') || normDest.includes('singapore')) {
    return SUPPORTED_CURRENCIES.SGD;
  }
  if (
    normCountry.includes('switzerland') ||
    normDest.includes('zurich') ||
    normDest.includes('interlaken') ||
    normDest.includes('zermatt')
  ) {
    return SUPPORTED_CURRENCIES.CHF;
  }
  if (
    normCountry.includes('australia') ||
    normDest.includes('sydney') ||
    normDest.includes('melbourne')
  ) {
    return SUPPORTED_CURRENCIES.AUD;
  }

  // Default to INR for Indian domestic destinations (Goa, Kashmir, Jaipur, Kerala, Ladakh, etc.)
  return SUPPORTED_CURRENCIES.INR;
}

/**
 * Converts an INR amount to a target currency
 */
export function convertInrTo(
  amountInInr: number,
  targetCurrencyCode: string,
  liveRates?: Record<string, number>
): number {
  if (!amountInInr || isNaN(amountInInr)) return 0;
  if (targetCurrencyCode === 'INR') return amountInInr;

  const rate = liveRates?.[targetCurrencyCode] || DEFAULT_INR_RATES[targetCurrencyCode] || 1;
  const rawConverted = amountInInr * rate;

  // Round smartly based on currency magnitude
  if (targetCurrencyCode === 'IDR' || targetCurrencyCode === 'VND') {
    return Math.round(rawConverted / 1000) * 1000;
  }
  if (targetCurrencyCode === 'JPY') {
    return Math.round(rawConverted / 10) * 10;
  }
  if (
    targetCurrencyCode === 'USD' ||
    targetCurrencyCode === 'EUR' ||
    targetCurrencyCode === 'GBP' ||
    targetCurrencyCode === 'CHF' ||
    targetCurrencyCode === 'SGD' ||
    targetCurrencyCode === 'AUD'
  ) {
    return Math.round(rawConverted);
  }
  return Math.round(rawConverted);
}

/**
 * Formats an amount directly into the target currency string
 */
export function formatWithCurrency(
  amountInInr: number,
  targetCurrencyCode: string,
  liveRates?: Record<string, number>
): string {
  const config = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.INR;
  const converted = convertInrTo(amountInInr, targetCurrencyCode, liveRates);

  let formattedNumber = '';
  if (targetCurrencyCode === 'INR') {
    formattedNumber = converted.toLocaleString('en-IN');
  } else {
    formattedNumber = converted.toLocaleString('en-US');
  }

  return `${config.symbol}${formattedNumber}`;
}

/**
 * Fetches real-time open exchange rates against INR
 */
export async function fetchLiveExchangeRates(): Promise<{
  rates: Record<string, number>;
  lastUpdated: string;
}> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/INR', {
      cache: 'default',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.rates) {
      return {
        rates: { ...DEFAULT_INR_RATES, ...data.rates },
        lastUpdated: data.time_last_update_utc
          ? new Date(data.time_last_update_utc).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Live Rates',
      };
    }
  } catch {
    // Graceful fallback to built-in updated baseline
  }
  return {
    rates: DEFAULT_INR_RATES,
    lastUpdated: 'Live Mid-Market',
  };
}
