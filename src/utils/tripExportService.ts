import jsPDF from 'jspdf';
import { UserProfile, TripPlan } from '../types/travel';
import { DESTINATIONS, STAYS_DATA, ACTIVITIES_DATA, FLIGHTS_DATA } from '../data/travelData';
import { generateCustomTripPlan } from './tripPlannerEngine';

export interface UpcomingTripItem {
  id: string;
  destinationName: string;
  country: string;
  coverImage: string;
  dates: string;
  days: number;
  companion: string;
  status: 'Confirmed' | 'Designing' | 'Completed';
  totalCost: number;
}

/**
 * Generates an iCalendar (.ics) format file for an upcoming trip.
 */
export function generateUpcomingTripIcs(trip: UpcomingTripItem, userProfile?: UserProfile): string {
  const now = new Date();
  const formatIcsDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const stamp = formatIcsDate(now);
  const destination =
    DESTINATIONS.find((d) => d.name.toLowerCase() === trip.destinationName.toLowerCase()) ||
    DESTINATIONS[0];

  // Try to generate customized days
  const companionType =
    trip.companion.toLowerCase() === 'solo'
      ? 'solo'
      : trip.companion.toLowerCase() === 'couple'
        ? 'couple'
        : trip.companion.toLowerCase() === 'family'
          ? 'family'
          : 'friends';

  const plan = generateCustomTripPlan(
    destination.id,
    companionType,
    destination.vibeTags,
    '100k',
    trip.days,
    'Delhi (DEL)'
  );

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wandr//AI Travel Curator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Wandr Trip: ${trip.destinationName} (${trip.days} Days)`,
    'X-WR-TIMEZONE:UTC',
  ];

  // Add overall trip event
  const startEventDate = new Date();
  startEventDate.setDate(startEventDate.getDate() + 14); // 2 weeks out simulated or parsed
  const endEventDate = new Date(startEventDate);
  endEventDate.setDate(startEventDate.getDate() + trip.days);

  const formatSimpleDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');

  icsContent.push(
    'BEGIN:VEVENT',
    `UID:wandr-trip-${trip.id}-main@wandr.travel`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${formatSimpleDate(startEventDate)}`,
    `DTEND;VALUE=DATE:${formatSimpleDate(endEventDate)}`,
    `SUMMARY:✈️ Journey to ${trip.destinationName}, ${trip.country} (Wandr Itinerary)`,
    `DESCRIPTION:Wandr Confirmed Journey\\nTraveller: ${userProfile?.name || 'Ayan'}\\nDates: ${trip.dates}\\nDuration: ${trip.days} Days\\nTotal Cost: INR ${trip.totalCost.toLocaleString('en-IN')}\\nSupport: concierge@wandr.travel`,
    `LOCATION:${trip.destinationName}, ${trip.country}`,
    'STATUS:CONFIRMED',
    'END:VEVENT'
  );

  // Add day-by-day sub events
  plan.days.forEach((day, idx) => {
    const curDate = new Date(startEventDate);
    curDate.setDate(curDate.getDate() + idx);
    const dateStr = formatSimpleDate(curDate);

    const eventUid = `wandr-${trip.id}-day-${day.dayNumber}@wandr.travel`;
    const summary = `Day ${day.dayNumber}: ${day.dayTitle} (${trip.destinationName})`;
    const description = `Wandr Daily Itinerary\\n\\n${day.summary}\\n\\nActivities: ${day.activities.map((a) => `${a.time} - ${a.title}`).join(', ')}`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${eventUid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${trip.destinationName}, ${trip.country}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

/**
 * Triggers instant download of the .ics calendar file.
 */
export function downloadUpcomingTripIcs(trip: UpcomingTripItem, userProfile?: UserProfile): void {
  const icsData = generateUpcomingTripIcs(trip, userProfile);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    'download',
    `Wandr_${trip.destinationName.replace(/\s+/g, '_')}_${trip.days}D.ics`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a clean, multi-page offline PDF Travel Voucher & Itinerary Document.
 */
export function downloadUpcomingTripPdf(trip: UpcomingTripItem, userProfile?: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const destination =
    DESTINATIONS.find((d) => d.name.toLowerCase() === trip.destinationName.toLowerCase()) ||
    DESTINATIONS[0];

  const companionType =
    trip.companion.toLowerCase() === 'solo'
      ? 'solo'
      : trip.companion.toLowerCase() === 'couple'
        ? 'couple'
        : trip.companion.toLowerCase() === 'family'
          ? 'family'
          : 'friends';

  const plan = generateCustomTripPlan(
    destination.id,
    companionType,
    destination.vibeTags,
    '100k',
    trip.days,
    'Delhi (DEL)'
  );

  const matchedStay = STAYS_DATA.find((s) => s.destinationId === destination.id) || STAYS_DATA[0];
  const matchedFlight = FLIGHTS_DATA[0];

  const guestName = userProfile?.name || 'Ayan Alam';
  const guestEmail = userProfile?.email || 'ayanalamxnaruto@gmail.com';
  const voucherCode = `WNDR-${trip.destinationName.toUpperCase().slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;

  let y = margin;

  // --- PAGE 1: HEADER BANNER ---
  // Dark luxury header background
  doc.setFillColor(24, 30, 36);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'F');

  // Coral accent line
  doc.setFillColor(224, 90, 71);
  doc.rect(margin, y + 36, contentWidth, 2, 'F');

  // Wandr Brand title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('WANDR', margin + 8, y + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('AI TRAVEL CURATOR & LUXURY CONCIERGE', margin + 8, y + 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL TRIP VOUCHER & OFFLINE ITINERARY', margin + 8, y + 27);

  // Status & Voucher Reference on Right
  doc.setFillColor(16, 185, 129); // emerald
  doc.roundedRect(pageWidth - margin - 38, y + 8, 30, 6, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('● CONFIRMED', pageWidth - margin - 23, y + 12.2, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Voucher ID: ${voucherCode}`, pageWidth - margin - 8, y + 22, { align: 'right' });
  doc.text(
    `Issued: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    pageWidth - margin - 8,
    y + 28,
    { align: 'right' }
  );

  y += 44;

  // --- TRIP OVERVIEW & TRAVELLER CARD ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

  // Column 1: Guest Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('PRIMARY TRAVELLER', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${guestName}`, margin + 6, y + 15);
  doc.text(`Email: ${guestEmail}`, margin + 6, y + 21);
  doc.text(`Status: Verified VIP Explorer`, margin + 6, y + 27);

  // Vertical separator
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 60, y + 5, margin + 60, y + 31);

  // Column 2: Destination & Dates
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('JOURNEY DETAILS', margin + 66, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Destination: ${trip.destinationName}, ${trip.country}`, margin + 66, y + 15);
  doc.text(`Travel Dates: ${trip.dates} (${trip.days} Days)`, margin + 66, y + 21);
  doc.text(
    `Travel Style: ${trip.companion} • ${destination.vibeTags.slice(0, 3).join(', ')}`,
    margin + 66,
    y + 27
  );

  // Column 3: Total Cost
  doc.line(margin + 125, y + 5, margin + 125, y + 31);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('TOTAL AMOUNT', margin + 131, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(224, 90, 71);
  doc.text(`INR ${trip.totalCost.toLocaleString('en-IN')}`, margin + 131, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('All-Inclusive Package', margin + 131, y + 23);
  doc.text('GST & Local Taxes Paid', margin + 131, y + 28);

  y += 42;

  // --- ACCOMMODATION & FLIGHT SUMMARY ---
  doc.setFillColor(254, 243, 199); // amber-100/50
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('CONFIRMED STAY & TRANSIT HIGHLIGHTS', margin + 6, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text(
    `Hotel: ${matchedStay.name} (${matchedStay.propertyType}) • ${matchedStay.location} • Includes Daily Gourmet Breakfast`,
    margin + 6,
    y + 12
  );
  doc.text(
    `Transit: ${matchedFlight.airline} (${matchedFlight.flightNumber}) • Non-stop • Includes 20kg Baggage & Private Airport Chauffeur`,
    margin + 6,
    y + 17
  );

  y += 28;

  // --- DAY-BY-DAY ITINERARY SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(24, 30, 36);
  doc.text('DETAILED DAY-BY-DAY CURATED SCHEDULE', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Keep this schedule offline during transit and flights.', margin + 95, y);

  y += 5;

  plan.days.forEach((day, index) => {
    // Check if we need a new page
    if (y > pageHeight - 45) {
      // Add Footer on current page
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Wandr Travel • ${trip.destinationName} Offline Guide • Page 1`,
        margin,
        pageHeight - 8
      );
      doc.text(
        `Concierge Support: +91 98765 43210 (24/7 WhatsApp)`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );

      doc.addPage();
      y = margin + 5;

      // Page 2 mini header
      doc.setFillColor(24, 30, 36);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `WANDR ITINERARY: ${trip.destinationName.toUpperCase()} (CONTINUED)`,
        margin + 6,
        y + 9
      );
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text(`Voucher: ${voucherCode}`, pageWidth - margin - 6, y + 9, { align: 'right' });

      y += 20;
    }

    // Day Header Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(224, 90, 71);
    doc.text(`DAY ${day.dayNumber}`, margin + 4, y + 5.5);

    doc.setTextColor(30, 41, 59);
    doc.text(`: ${day.dayTitle}`, margin + 18, y + 5.5);

    y += 12;

    // Day Summary text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const summaryLines = doc.splitTextToSize(day.summary, contentWidth - 8);
    doc.text(summaryLines, margin + 4, y);
    y += summaryLines.length * 3.8 + 2;

    // Day Activities
    day.activities.forEach((act) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${act.time} — ${act.title}`, margin + 6, y);

      if (act.location) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(
          `(${act.location})`,
          margin + 6 + doc.getTextWidth(`• ${act.time} — ${act.title} `),
          y
        );
      }
      y += 4;
    });

    y += 3;
  });

  // --- OFFLINE ASSISTANCE & EMERGENCY INFO ---
  if (y > pageHeight - 50) {
    doc.addPage();
    y = margin + 5;
  }

  y += 4;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  doc.text('24/7 OFFLINE ASSISTANCE & LOCAL EMERGENCY CONTACTS', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text(
    `• Wandr Global WhatsApp Concierge: +91 98765 43210 (Priority VIP Desk)`,
    margin + 6,
    y + 12
  );
  doc.text(`• Local Tourist Police & Emergency in ${trip.country}: 112 / 110`, margin + 6, y + 17);
  doc.text(
    `• Hotel Front Desk (${matchedStay.name}): +62 361 849 8988 • Check-in: 14:00 | Check-out: 12:00`,
    margin + 6,
    y + 22
  );

  // Footer on final page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Wandr Travel Experience • ${trip.destinationName} • Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 8
    );
    doc.text('Designed for Seamless Offline Travel', pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  // Save the PDF
  const filename = `Wandr_Trip_${trip.destinationName.replace(/\s+/g, '_')}_${trip.days}Days.pdf`;
  doc.save(filename);
}
