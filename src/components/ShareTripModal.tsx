import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Calendar as CalendarIcon,
  MessageSquare,
  Mail,
  Send,
  Download,
  Users,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Plane,
  Hotel,
} from 'lucide-react';
import { TripPlan, UserProfile } from '../types/travel';
import {
  generateShareableTripLink,
  generateWhatsAppShareUrl,
  generateTelegramShareUrl,
  generateEmailShareUrl,
  generateTwitterShareUrl,
  generateFormattedTripSummary,
  generateTripQrCode,
  downloadTripIcsCalendar,
  triggerNativeShare,
  getCompanionSplit,
} from '../utils/shareableTripLink';
import { WandrLogo } from './WandrLogo';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  userProfile?: UserProfile;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'social' | 'qr' | 'calendar'>('link');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [companionNote, setCompanionNote] = useState<string>(
    'Hey! Check out this itinerary I designed on Wandr. Let me know what you think!'
  );

  const curatorName = userProfile?.name || 'Ayan Alam';
  const shareUrl = generateShareableTripLink(tripPlan, curatorName, userProfile?.email);
  const split = getCompanionSplit(tripPlan.totalPrice, tripPlan.companion);

  // Generate QR code when modal opens or activeTab switches to QR
  useEffect(() => {
    if (isOpen) {
      generateTripQrCode(shareUrl).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const handleCopyFormattedText = async () => {
    try {
      const summaryText = companionNote
        ? `💬 *Message from ${curatorName}:* "${companionNote}"\n\n` +
          generateFormattedTripSummary(tripPlan, curatorName)
        : generateFormattedTripSummary(tripPlan, curatorName);

      await navigator.clipboard.writeText(summaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy formatted text:', err);
    }
  };

  const handleNativeShare = async () => {
    const result = await triggerNativeShare(tripPlan, curatorName);
    if (result.method === 'clipboard' && result.success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#FDFCFB] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden border border-stone-200 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="relative bg-stone-900 text-white p-6 sm:p-7 overflow-hidden border-b border-stone-800">
          <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#FF5722]/20 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#181E24] border border-stone-700/80 flex items-center justify-center shadow-md">
                <Share2 className="w-6 h-6 text-[#FF5722]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#FF5722]/20 text-[#FFA726] border border-[#FF5722]/40">
                    Live Itinerary Share
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mt-1">
                  Share Trip with Companions
                </h3>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  Anyone with this link can view the interactive itinerary, activities, and
                  bookings.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-800/90 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-700/80 transition-colors cursor-pointer shrink-0"
              aria-label="Close share dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-5 p-1 bg-stone-800/60 rounded-2xl max-w-fit border border-stone-700/60 text-xs">
            <button
              onClick={() => setActiveTab('link')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'link'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'social'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp & Apps</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Scan QR</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Sync Calendar</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Trip Summary Preview Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
            <img
              src={tripPlan.destination.coverImage}
              alt={tripPlan.destination.name}
              referrerPolicy="no-referrer"
              className="w-full sm:w-28 h-28 rounded-2xl object-cover ring-1 ring-stone-200 shrink-0"
            />
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 truncate">
                  {tripPlan.destination.name}, {tripPlan.destination.country}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-semibold shrink-0">
                  {tripPlan.durationDays} Days
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light mb-2">
                {tripPlan.startDate} – {tripPlan.endDate} • From {tripPlan.originCity.split(' ')[0]}{' '}
                • Style: {tripPlan.companion}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-1 text-stone-700">
                  <Hotel className="w-3.5 h-3.5 text-[#E05A47]" />
                  <span className="truncate max-w-[120px] font-medium">
                    {tripPlan.selectedStay.name}
                  </span>
                </div>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-stone-700">
                  <Plane className="w-3.5 h-3.5 text-stone-500" />
                  <span className="font-medium">{tripPlan.selectedFlight.airline}</span>
                </div>
                <span className="text-stone-300">•</span>
                <div className="font-serif font-bold text-emerald-800">
                  ₹{tripPlan.totalPrice.toLocaleString('en-IN')}
                  {split.count > 1 && (
                    <span className="text-[10px] text-stone-400 font-normal ml-1">
                      (~₹{split.perPerson.toLocaleString('en-IN')}/person)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: Direct Link & Copy */}
          {activeTab === 'link' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2 uppercase tracking-wider">
                  Direct Shareable URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full bg-[#FAF8F5] text-xs text-stone-700 px-4 py-3 rounded-2xl border border-stone-300/80 focus:outline-none select-all font-mono truncate pr-10"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-5 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 hover:bg-[#E05A47] text-white'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    No login required. Companions can immediately view, inspect days, or duplicate.
                  </span>
                </p>
              </div>

              {/* Companion Personal Note Builder */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#E05A47]" />
                    Custom Companion Invite Message
                  </span>
                  <button
                    onClick={handleCopyFormattedText}
                    className="text-[11px] font-semibold text-[#E05A47] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedText ? 'Copied Full Note!' : 'Copy Formatted Text'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={companionNote}
                  onChange={(e) => setCompanionNote(e.target.value)}
                  placeholder="Add a friendly note for the group chat..."
                  className="w-full text-xs bg-white p-3 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-[#E05A47]"
                />
              </div>

              {/* Native Device Share trigger */}
              <div className="pt-2">
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-stone-600" />
                  <span>Share via Device Menu (AirDrop, iMessage, Slack, Nearby)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WhatsApp, Telegram, Email, Socials */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-stone-600 mb-1">
                Select an app to share the formatted trip itinerary directly with your travel group:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <a
                  href={generateWhatsAppShareUrl(tripPlan, curatorName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">
                        Share on WhatsApp
                      </div>
                      <span className="text-[11px] text-emerald-700">Pre-formatted group text</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Telegram */}
                <a
                  href={generateTelegramShareUrl(tripPlan, curatorName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sky-950 group-hover:text-sky-800">
                        Share on Telegram
                      </div>
                      <span className="text-[11px] text-sky-700">Channel or group share</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Email */}
                <a
                  href={generateEmailShareUrl(tripPlan, curatorName)}
                  className="p-4 rounded-2xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Send via Email</div>
                      <span className="text-[11px] text-stone-500">Full detailed breakdown</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Twitter / X */}
                <a
                  href={generateTwitterShareUrl(tripPlan, curatorName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Post on X (Twitter)</div>
                      <span className="text-[11px] text-stone-500">Share your travel vibe</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Group Cost Split Highlight */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950">
                      Companion Split Estimate: {split.label}
                    </div>
                    <div className="text-[11px] text-amber-800">
                      ₹{split.perPerson.toLocaleString('en-IN')} per traveller (inclusive of stays,
                      transit & activities)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-900 font-serif">
                  {split.count} Pax
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code Phone Scanner */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center text-center p-4 space-y-4 animate-fadeIn">
              <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-md inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Trip QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-stone-400 text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div className="max-w-sm">
                <h5 className="text-sm font-bold text-stone-900">
                  Scan to open on phone instantly
                </h5>
                <p className="text-xs text-stone-500 mt-1">
                  Point any smartphone camera at this code to load the live{' '}
                  {tripPlan.destination.name} itinerary on iOS or Android.
                </p>
              </div>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`Wandr_Trip_${tripPlan.destination.name}_QR.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Image</span>
                </a>
              )}
            </div>
          )}

          {/* TAB 4: Calendar Sync (.ics) */}
          {activeTab === 'calendar' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 bg-blue-50/70 rounded-3xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-xs">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-blue-950">
                      Export Trip to Calendar (.ics)
                    </h5>
                    <p className="text-xs text-blue-800 max-w-sm mt-0.5">
                      Adds all {tripPlan.durationDays} days of activities, check-in details, and
                      excursions directly to Google Calendar, Apple iCal, or Outlook.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadTripIcsCalendar(tripPlan)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ics File</span>
                </button>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
                  Calendar Inclusions:
                </span>
                <ul className="space-y-1.5 text-stone-600 text-[11px]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Daily schedule breakdowns & arrival reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Hotel check-in & accommodation address at {tripPlan.selectedStay.name}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automatic timezone synchronization for {tripPlan.destination.name}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <WandrLogo size="xs" variant="icon-only" />
            <span className="text-[11px]">Designed on Wandr • Real-Time Collaboration</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
