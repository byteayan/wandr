import { TripPlan, CompanionType, VibeType, ItineraryDay } from '../types/travel';
import {
  DESTINATIONS,
  STAYS_DATA,
  FLIGHTS_DATA,
  TRAINS_DATA,
  BUSES_DATA,
  CABS_DATA,
  ACTIVITIES_DATA,
  PREMIUM_EXPERIENCES,
} from '../data/travelData';
import { calculateTripTotal, generateCustomTripPlan } from './tripPlannerEngine';

export interface SerializedTripPayload {
  v: number; // schema version
  id?: string;
  destId: string;
  orig: string;
  comp: CompanionType;
  vibes: VibeType[];
  bgt: number;
  days: number;
  sDate: string;
  eDate: string;
  stayId: string;
  tMode?: 'flight' | 'train' | 'bus' | 'cab';
  flId?: string;
  trId?: string;
  busId?: string;
  cabId?: string;
  actIds: string[];
  premIds: string[];
  privTr?: boolean;
  trCost?: number;
  curator?: string;
  curatorEmail?: string;
  customSummaries?: { day: number; title?: string; summary: string }[];
}

export interface SharedTripResolution {
  tripPlan: TripPlan;
  curatorName?: string;
  curatorEmail?: string;
  isShared: boolean;
}

/**
 * Serializes a complete TripPlan into a URL-safe compact Base64 payload.
 */
export function serializeTripPlan(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam',
  curatorEmail?: string
): string {
  const customSummaries = tripPlan.days
    .filter((d) => d.summary || d.dayTitle)
    .map((d) => ({
      day: d.dayNumber,
      title: d.dayTitle,
      summary: d.summary,
    }));

  const payload: SerializedTripPayload = {
    v: 1,
    id: tripPlan.id,
    destId: tripPlan.destination.id,
    orig: tripPlan.originCity,
    comp: tripPlan.companion,
    vibes: tripPlan.vibes,
    bgt: tripPlan.budget,
    days: tripPlan.durationDays,
    sDate: tripPlan.startDate,
    eDate: tripPlan.endDate,
    stayId: tripPlan.selectedStay.id,
    tMode: tripPlan.selectedTransitMode || 'flight',
    flId: tripPlan.selectedFlight?.id,
    trId: tripPlan.selectedTrain?.id,
    busId: tripPlan.selectedBus?.id,
    cabId: tripPlan.selectedCab?.id,
    actIds: tripPlan.selectedActivities.map((a) => a.id),
    premIds: tripPlan.selectedPremium.map((p) => p.id),
    privTr: tripPlan.privateTransportIncluded,
    trCost: tripPlan.transportCost,
    curator: curatorName,
    curatorEmail: curatorEmail,
    customSummaries: customSummaries.length > 0 ? customSummaries : undefined,
  };

  try {
    const jsonStr = JSON.stringify(payload);
    // UTF-8 safe base64 encoding
    const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    const base64 = btoa(utf8Bytes);
    return encodeURIComponent(base64);
  } catch (error) {
    console.error('Failed to serialize trip plan:', error);
    // Fallback to minimal query params
    return encodeURIComponent(
      JSON.stringify({
        destId: tripPlan.destination.id,
        days: tripPlan.durationDays,
        curator: curatorName,
      })
    );
  }
}

/**
 * Deserializes an encoded string from URL back into a full interactive TripPlan.
 */
export function deserializeTripPlan(encodedStr: string): SharedTripResolution | null {
  if (!encodedStr) return null;

  try {
    let jsonStr = '';
    const cleanStr = decodeURIComponent(encodedStr);

    try {
      const decodedUtf8 = atob(cleanStr);
      jsonStr = decodeURIComponent(
        Array.prototype.map
          .call(decodedUtf8, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      // Direct string fallback if not double-encoded
      jsonStr = cleanStr;
    }

    const payload: SerializedTripPayload = JSON.parse(jsonStr);
    if (!payload || !payload.destId) return null;

    // 1. Resolve destination
    const destination =
      DESTINATIONS.find((d) => d.id === payload.destId) ||
      DESTINATIONS.find((d) => d.name.toLowerCase() === payload.destId.toLowerCase()) ||
      DESTINATIONS[0];

    // 2. Resolve stay
    const selectedStay =
      STAYS_DATA.find((s) => s.id === payload.stayId) ||
      STAYS_DATA.find((s) => s.destinationId === destination.id) ||
      STAYS_DATA[0];

    // 3. Resolve transit
    const selectedFlight = FLIGHTS_DATA.find((f) => f.id === payload.flId) || FLIGHTS_DATA[0];
    const selectedTrain = payload.trId ? TRAINS_DATA.find((t) => t.id === payload.trId) : undefined;
    const selectedBus = payload.busId ? BUSES_DATA.find((b) => b.id === payload.busId) : undefined;
    const selectedCab = payload.cabId ? CABS_DATA.find((c) => c.id === payload.cabId) : undefined;

    // 4. Resolve activities
    const selectedActivities = (payload.actIds || [])
      .map((id) => ACTIVITIES_DATA.find((a) => a.id === id))
      .filter((a): a is (typeof ACTIVITIES_DATA)[0] => Boolean(a));

    // 5. Resolve premium experiences
    const selectedPremium = (payload.premIds || [])
      .map((id) => PREMIUM_EXPERIENCES.find((p) => p.id === id))
      .filter((p): p is (typeof PREMIUM_EXPERIENCES)[0] => Boolean(p));

    const durationDays = payload.days || destination.idealDays || 7;
    const companion: CompanionType = payload.comp || 'friends';
    const vibes: VibeType[] =
      payload.vibes && payload.vibes.length > 0 ? payload.vibes : destination.vibeTags;
    const originCity = payload.orig || 'Delhi (DEL)';

    // 6. Generate base itinerary days and override with custom summaries if provided
    const basePlan = generateCustomTripPlan(
      destination.id,
      companion,
      vibes,
      payload.bgt ? `${Math.round(payload.bgt / 1000)}k` : '100k',
      durationDays,
      originCity
    );

    const mergedDays: ItineraryDay[] = basePlan.days.map((day) => {
      const custom = payload.customSummaries?.find((cs) => cs.day === day.dayNumber);
      if (custom) {
        return {
          ...day,
          dayTitle: custom.title || day.dayTitle,
          summary: custom.summary || day.summary,
        };
      }
      return day;
    });

    const isTransportIncluded = payload.privTr ?? basePlan.privateTransportIncluded;
    const transportCost = payload.trCost ?? basePlan.transportCost;

    const costs = calculateTripTotal(
      selectedFlight,
      selectedStay,
      durationDays,
      selectedActivities,
      selectedPremium,
      isTransportIncluded,
      transportCost,
      payload.bgt
    );

    const reconstructedPlan: TripPlan = {
      id: payload.id || `shared-trip-${Date.now()}`,
      destination,
      companion,
      vibes,
      budget: payload.bgt || costs.grandTotal,
      durationDays,
      originCity,
      startDate: payload.sDate || basePlan.startDate,
      endDate: payload.eDate || basePlan.endDate,
      totalPrice: costs.grandTotal,
      selectedStay,
      selectedFlight,
      selectedTransitMode: payload.tMode || 'flight',
      selectedTrain,
      selectedBus,
      selectedCab,
      selectedActivities,
      selectedPremium,
      privateTransportIncluded: isTransportIncluded,
      transportCost,
      days: mergedDays,
    };

    return {
      tripPlan: reconstructedPlan,
      curatorName: payload.curator,
      curatorEmail: payload.curatorEmail,
      isShared: true,
    };
  } catch (error) {
    console.error('Failed to deserialize shared trip payload:', error);
    return null;
  }
}

/**
 * Generates the full shareable URL with the trip payload.
 */
export function generateShareableTripLink(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam',
  curatorEmail?: string
): string {
  const serialized = serializeTripPlan(tripPlan, curatorName, curatorEmail);
  const baseUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  return `${baseUrl}?trip=${serialized}#personalized-trip`;
}

/**
 * Generates a high-quality QR code image data URL for instant mobile companion scanning.
 */
export async function generateTripQrCode(shareUrl: string): Promise<string> {
  try {
    const { default: QRCode } = await import('qrcode');
    const dataUrl = await QRCode.toDataURL(shareUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#181E24',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Helper to calculate split cost per person based on companion group type.
 */
export function getCompanionSplit(
  totalPrice: number,
  companion: CompanionType
): { count: number; perPerson: number; label: string } {
  let count = 1;
  let label = 'Solo Traveller';

  switch (companion) {
    case 'solo':
      count = 1;
      label = 'Solo';
      break;
    case 'couple':
      count = 2;
      label = 'Per Couple (2 pax)';
      break;
    case 'family':
      count = 4;
      label = 'Family (4 pax avg)';
      break;
    case 'friends':
      count = 4;
      label = 'Friends Group (4 pax avg)';
      break;
  }

  const perPerson = Math.round(totalPrice / count);
  return { count, perPerson, label };
}

/**
 * Formats a clean, readable text breakdown optimized for WhatsApp, Slack, iMessage & notes.
 */
export function generateFormattedTripSummary(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): string {
  const shareUrl = generateShareableTripLink(tripPlan, curatorName);
  const split = getCompanionSplit(tripPlan.totalPrice, tripPlan.companion);

  const transitName =
    tripPlan.selectedTransitMode === 'train' && tripPlan.selectedTrain
      ? `🚆 ${tripPlan.selectedTrain.trainName} (${tripPlan.selectedTrain.trainNumber})`
      : tripPlan.selectedTransitMode === 'bus' && tripPlan.selectedBus
        ? `🚌 ${tripPlan.selectedBus.operator} (${tripPlan.selectedBus.busType})`
        : tripPlan.selectedTransitMode === 'cab' && tripPlan.selectedCab
          ? `🚖 ${tripPlan.selectedCab.vehicleName} Private Chauffeur`
          : `✈️ ${tripPlan.selectedFlight.airline} (${tripPlan.selectedFlight.flightNumber})`;

  const highlights = tripPlan.days
    .slice(0, 4)
    .map((d) => `• Day ${d.dayNumber}: ${d.dayTitle}`)
    .join('\n');

  return `🌍 *Wandr Trip Itinerary: ${tripPlan.destination.name}, ${tripPlan.destination.country}*
Curated with love by ${curatorName}

📅 *Duration:* ${tripPlan.durationDays} Days (${tripPlan.startDate} – ${tripPlan.endDate})
👥 *Style:* ${tripPlan.companion.toUpperCase()} • ${tripPlan.vibes.join(', ')}
💰 *Estimated Total:* ₹${tripPlan.totalPrice.toLocaleString('en-IN')} (~₹${split.perPerson.toLocaleString('en-IN')} per person)

🏨 *Stay:* ${tripPlan.selectedStay.name} (${tripPlan.selectedStay.propertyType})
${transitName}

✨ *Itinerary Highlights:*
${highlights}
${tripPlan.durationDays > 4 ? `• +${tripPlan.durationDays - 4} more curated days...\n` : ''}
🔗 *Open Full Interactive Itinerary & Bookings:*
${shareUrl}`;
}

/**
 * Generates WhatsApp Share Link.
 */
export function generateWhatsAppShareUrl(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): string {
  const text = generateFormattedTripSummary(tripPlan, curatorName);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Generates Telegram Share Link.
 */
export function generateTelegramShareUrl(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): string {
  const shareUrl = generateShareableTripLink(tripPlan, curatorName);
  const text = `🌍 Check out this ${tripPlan.durationDays}-day curated trip to ${tripPlan.destination.name} on Wandr!`;
  return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}

/**
 * Generates Email Share Link with subject and preformatted body.
 */
export function generateEmailShareUrl(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): string {
  const subject = `Curated Journey to ${tripPlan.destination.name} (${tripPlan.durationDays} Days) — Wandr Itinerary`;
  const body = generateFormattedTripSummary(tripPlan, curatorName);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generates X (Twitter) Share Link.
 */
export function generateTwitterShareUrl(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): string {
  const shareUrl = generateShareableTripLink(tripPlan, curatorName);
  const text = `Just designed an incredible ${tripPlan.durationDays}-day trip to ${tripPlan.destination.name} on @WandrTravel! Check out our itinerary:`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Triggers native Web Share API (mobile devices, macOS Safari, etc.) with automatic fallback.
 */
export async function triggerNativeShare(
  tripPlan: TripPlan,
  curatorName: string = 'Ayan Alam'
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const shareUrl = generateShareableTripLink(tripPlan, curatorName);
  const title = `${tripPlan.destination.name} Travel Itinerary — Wandr`;
  const text = `Check out our ${tripPlan.durationDays}-day trip to ${tripPlan.destination.name} curated by ${curatorName}.`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      return { success: true, method: 'native' };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareUrl);
    return { success: true, method: 'clipboard' };
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return { success: false, method: 'clipboard' };
  }
}

/**
 * Generates an iCalendar (.ics) standard file content for the entire trip so companions can import to Google / Apple Calendar.
 */
export function generateTripIcsCalendar(tripPlan: TripPlan): string {
  const now = new Date();
  const formatIcsDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const stamp = formatIcsDate(now);
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wandr//AI Travel Curator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Wandr Trip: ${tripPlan.destination.name} (${tripPlan.durationDays}D)`,
    'X-WR-TIMEZONE:UTC',
  ];

  tripPlan.days.forEach((day, index) => {
    // Generate simulated dates starting from current day or next month
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 14 + index); // 2 weeks out
    const dateStr = eventDate.toISOString().slice(0, 10).replace(/-/g, '');

    const eventUid = `wandr-${tripPlan.id}-day-${day.dayNumber}@wandr.travel`;
    const summary = `Day ${day.dayNumber}: ${day.dayTitle} (${tripPlan.destination.name})`;
    const description = `Wandr Itinerary Day ${day.dayNumber}\\n\\n${day.summary}\\n\\nStay: ${tripPlan.selectedStay.name}\\nDestination: ${tripPlan.destination.name}, ${tripPlan.destination.country}`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${eventUid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${tripPlan.destination.name}, ${tripPlan.destination.country}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

/**
 * Downloads the .ics file directly into user's browser.
 */
export function downloadTripIcsCalendar(tripPlan: TripPlan): void {
  const icsData = generateTripIcsCalendar(tripPlan);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    'download',
    `Wandr_${tripPlan.destination.name}_${tripPlan.durationDays}Days.ics`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
