import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  Sun,
  CloudRain,
  MapPin,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Compass,
  ArrowRight,
  Shield,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Ambulance,
  Building,
  Check,
} from 'lucide-react';
import { TripPlan, TripFeedbackData } from '../types/travel';

interface LiveTripModeProps {
  tripPlan: TripPlan;
  onOpenFeedback?: (trip: TripFeedbackData) => void;
}

export const LiveTripMode: React.FC<LiveTripModeProps> = ({ tripPlan, onOpenFeedback }) => {
  const [weatherAlertAccepted, setWeatherAlertAccepted] = useState<boolean>(false);
  const [showQrPass, setShowQrPass] = useState<boolean>(false);

  // Driver Call State
  const [isCallingDriver, setIsCallingDriver] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [callConnected, setCallConnected] = useState<boolean>(false);

  // SOS Emergency Modal State
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [sosSent, setSosSent] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallingDriver) {
      const timer = setTimeout(() => {
        setCallConnected(true);
      }, 2000);

      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setCallDuration(0);
      setCallConnected(false);
    }
  }, [isCallingDriver]);

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const liveTimeline = [
    {
      time: '10:00 AM',
      title: 'Driver Pickup at Komaneka Villa Lobby',
      status: 'completed',
      location: 'Ubud Valley Gate',
      driver: 'Wayan Putra (Toyota Innova Zenix • DK 4021 AA)',
      icon: '🚗',
    },
    {
      time: '11:00 AM',
      title: 'Tukad Cepung Secret Cave Waterfall Trek',
      status: 'in-progress',
      location: 'Bangli Rainforest',
      guide: 'Ketut (Local Naturalist Guide)',
      icon: '🌿',
    },
    {
      time: '01:30 PM',
      title: 'Curated Bamboo Organic Farm Lunch',
      status: 'upcoming',
      location: 'Tegalalang Terrace',
      icon: '🍽️',
    },
    {
      time: '04:00 PM',
      title: weatherAlertAccepted
        ? 'Balinese Herbal Spa (Moved earlier for comfort)'
        : '120-Min Balinese Couple Herbal & Frangipani Spa',
      status: 'upcoming',
      location: 'Wandr Sanctuary Spa',
      icon: '💆',
    },
    {
      time: weatherAlertAccepted ? '06:45 PM' : '05:30 PM',
      title: weatherAlertAccepted
        ? 'Clear-Sky Uluwatu Sunset & Kecak Dance (Adjusted for dry window)'
        : 'Sunset Cliffside Lookout',
      status: 'upcoming',
      location: 'Uluwatu Amphitheatre',
      icon: '🌅',
    },
    {
      time: '08:00 PM',
      title: 'Private Candlelight 5-Course Dinner',
      status: 'upcoming',
      location: 'Cliffside Table 4',
      icon: '🍷',
    },
  ];

  return (
    <section className="bg-stone-950 text-stone-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Live Trip Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-stone-800/80 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
                  LIVE TRIP MODE ACTIVE
                </span>
                <span className="text-xs text-stone-400">• Day 3 of 7 in Bali</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50">
                Real-Time Journey Assistant
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQrPass(true)}
              className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-[#E05A47]" />
              <span>Digital Villa & Flight Pass</span>
            </button>

            <button
              onClick={() => {
                if (onOpenFeedback) {
                  onOpenFeedback({
                    tripId: tripPlan.id,
                    destinationName: tripPlan.destination.name,
                    country: tripPlan.destination.country,
                    coverImage: tripPlan.destination.coverImage,
                    dates: `${tripPlan.startDate} – ${tripPlan.endDate}`,
                    durationDays: tripPlan.durationDays,
                    companion: tripPlan.companion,
                  });
                }
              }}
              className="px-4 py-2 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white text-xs font-medium transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Trip</span>
            </button>
          </div>
        </div>

        {/* Dynamic Weather Optimization Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-stone-900 rounded-3xl p-6 border border-amber-500/30 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  AI WEATHER REROUTE ADVICE
                </span>
                <span className="text-xs text-stone-400">Rain forecast: 03:45 PM – 05:15 PM</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100 mt-1">
                Move Ubud Jungle Spa ahead to 04:00 PM; swap Sunset Lookout to dry 06:45 PM window.
              </h3>
              <p className="text-xs text-stone-400 font-light mt-1 max-w-2xl">
                Our weather radar detected sudden tropical cloud cover over Uluwatu cliffs. We rearranged your afternoon so you stay dry indoors during peak shower.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {weatherAlertAccepted ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Schedule Updated
              </span>
            ) : (
              <button
                onClick={() => setWeatherAlertAccepted(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98"
              >
                Accept Auto-Adjustment
              </button>
            )}
          </div>
        </div>

        {/* Live Status Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Real-Time Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E05A47]" />
              <span>Today&apos;s Live Flow (Oct 14, 2026)</span>
            </h3>

            <div className="space-y-4">
              {liveTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl border transition-all ${
                    item.status === 'in-progress'
                      ? 'bg-stone-900/90 border-[#E05A47]/60 shadow-lg ring-1 ring-[#E05A47]/40'
                      : item.status === 'completed'
                      ? 'bg-stone-900/40 border-stone-800/60 opacity-80'
                      : 'bg-stone-900/60 border-stone-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl p-2 rounded-2xl bg-stone-800/80 border border-stone-700/60 shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-400">
                            {item.time}
                          </span>
                          {item.status === 'in-progress' && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E05A47]/20 border border-[#E05A47]/40 text-[#E05A47] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              NOW HAPPENING
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-serif font-bold text-stone-100 mt-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                          <MapPin className="w-3 h-3 text-[#E05A47]" />
                          <span>{item.location}</span>
                        </div>
                        {item.driver && (
                          <div className="mt-2 text-xs text-stone-300 bg-stone-800/60 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 border border-stone-700/50">
                            <span>Assigned:</span>
                            <span className="font-semibold text-white">{item.driver}</span>
                          </div>
                        )}
                        {item.guide && (
                          <div className="mt-2 text-xs text-stone-300 bg-stone-800/60 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 border border-stone-700/50">
                            <span>Naturalist:</span>
                            <span className="font-semibold text-white">{item.guide}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Live Action Widgets */}
          <div className="space-y-6">
            {/* Live Weather Forecast Mini */}
            <div className="bg-stone-900/70 rounded-3xl p-6 border border-stone-800/80">
              <div className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-3 flex items-center justify-between">
                <span>LOCAL UBUD WEATHER</span>
                <span className="text-amber-400">Live 28°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-8 h-8 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-stone-100">Tropical Breeze</div>
                    <div className="text-xs text-stone-400">UV Index: 6 (Moderate)</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-mono">
                  Humidity 74%
                </span>
              </div>
            </div>

            {/* Chauffeur On-Duty Contact Card */}
            <div className="bg-stone-900/70 rounded-3xl p-6 border border-stone-800/80">
              <div className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-3">
                ASSIGNED CHAUFFEUR
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-stone-800/80 border border-stone-700/60 flex items-center justify-center font-bold text-lg">
                    🚗
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-stone-100">Wayan Putra</h4>
                    <span className="text-xs text-stone-400 font-light">Toyota Innova • DK 4021 AA</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCallingDriver(true)}
                    className="p-3 rounded-full bg-[#E05A47] text-white hover:bg-[#c94b39] transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Call Driver"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                  <a
                    href="https://wa.me/6281239482901?text=Hi%20Wayan,%20I'm%20waiting%20at%20the%20villa%20lobby."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trip Feedback & Review Card */}
            <div className="bg-gradient-to-br from-stone-900/95 to-stone-950 p-6 rounded-3xl border border-amber-500/30 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-stone-100">
                Completed Your Journey?
              </h4>
              <p className="text-xs text-stone-400 font-light mt-1 mb-4">
                Share your feedback on the AI itinerary & villa stays to earn <span className="text-amber-400 font-semibold">₹1,000 Travel Credit</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onOpenFeedback) {
                    onOpenFeedback({
                      tripId: tripPlan.id,
                      destinationName: tripPlan.destination.name,
                      country: tripPlan.destination.country,
                      coverImage: tripPlan.destination.coverImage,
                      dates: `${tripPlan.startDate} – ${tripPlan.endDate}`,
                      durationDays: tripPlan.durationDays,
                      companion: tripPlan.companion,
                    });
                  }
                }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rate AI Journey & Unlock Credit</span>
              </button>
            </div>

            {/* Emergency & Safe Wandr SOS Button */}
            <div className="bg-gradient-to-br from-stone-900/90 to-stone-950 p-6 rounded-3xl border border-stone-800 text-center">
              <Shield className="w-8 h-8 text-[#E05A47] mx-auto mb-2" />
              <h4 className="text-sm font-serif font-bold text-stone-100">Need Urgent Help?</h4>
              <p className="text-xs text-stone-400 font-light mb-4">
                Our local bilingual emergency team in Bali is available 24/7.
              </p>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(true)}
                className="w-full py-2.5 rounded-full bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-200 font-medium text-xs border border-stone-700 hover:border-red-600/50 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#E05A47]" />
                <span>SOS Emergency Assistance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Calling Overlay Modal */}
      {isCallingDriver && (
        <div className="fixed inset-0 z-60 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-sm w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl p-6 text-center text-white">
            <div className="w-20 h-20 rounded-full bg-stone-800 border-2 border-[#E05A47] mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg relative">
              🚗
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900" />
            </div>

            <h3 className="text-lg font-serif font-bold text-white">Wayan Putra</h3>
            <p className="text-xs text-stone-400 mt-0.5">Toyota Innova Zenix • DK 4021 AA</p>
            <p className="text-xs text-stone-500 font-mono mt-1">+62 812 3948 2901</p>

            <div className="my-6">
              {callConnected ? (
                <div className="text-sm font-mono text-emerald-400 font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Call Connected: {formatCallTime(callDuration)}</span>
                </div>
              ) : (
                <div className="text-xs text-amber-400 animate-pulse font-medium">
                  Connecting to Wayan Putra...
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  isMuted ? 'bg-amber-500/30 text-amber-300' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  isSpeaker ? 'bg-blue-500/30 text-blue-300' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
                title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsCallingDriver(false)}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-transform active:scale-95 cursor-pointer shadow-lg shadow-red-600/40"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              VoIP Secured via Wandr Fleet Network
            </p>
          </div>
        </div>
      )}

      {/* SOS Emergency Modal */}
      {showEmergencyModal && (
        <div
          onClick={() => setShowEmergencyModal(false)}
          className="fixed inset-0 z-60 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-stone-900 rounded-3xl overflow-hidden border border-red-500/40 shadow-2xl p-6 text-white cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    Wandr 24/7 Bali SOS Emergency
                  </h3>
                  <span className="text-[11px] text-stone-400">Bali Province Bilingual Rapid Response</span>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sosSent && (
              <div className="my-3 p-3 bg-red-950/70 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GPS coordinates dispatched to Wandr Bali Hub. Duty manager is dialling your mobile now.</span>
              </div>
            )}

            <div className="my-4 space-y-2.5 text-xs">
              <button
                type="button"
                onClick={() => setSosSent(true)}
                className="w-full p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-between shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <div className="text-left">
                    <span className="block text-sm">One-Tap SOS Dispatch</span>
                    <span className="text-[10px] font-normal text-red-100">Transmits Live GPS coordinates to Bali Response Desk</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-2xl bg-stone-800 border border-stone-700">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Tourist Police</span>
                  <span className="text-sm font-bold text-white block mt-0.5">110 / +62 361 224111</span>
                  <span className="text-[10px] text-stone-400">English Supported</span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-800 border border-stone-700">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">BIMC Medical Rescue</span>
                  <span className="text-sm font-bold text-white block mt-0.5">+62 361 761263</span>
                  <span className="text-[10px] text-stone-400">24/7 International Hospital</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-5 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital QR Boarding Pass Modal */}
      {showQrPass && (
        <div
          onClick={() => setShowQrPass(false)}
          className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-[#FAF8F5] text-stone-900 rounded-3xl overflow-hidden border border-stone-200 shadow-2xl p-6 text-center cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                WANDR DIGITAL BOARDING PASS
              </span>
              <button
                onClick={() => setShowQrPass(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-stone-300 shadow-inner flex items-center justify-center">
              <QrCode className="w-36 h-36 text-stone-900" />
            </div>

            <div className="mt-4">
              <h4 className="text-base font-serif font-bold text-stone-900">
                {tripPlan.destination.name} Unified Pass
              </h4>
              <p className="text-xs text-stone-500 font-mono mt-0.5">Voucher: WNDR-BALI-8842-VIP</p>
              <p className="text-xs text-stone-600 mt-2">
                Valid for Komaneka Villa express check-in, Tukad Cepung Sanctuary entry, and VIP Lounge access.
              </p>
            </div>

            <button
              onClick={() => setShowQrPass(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
