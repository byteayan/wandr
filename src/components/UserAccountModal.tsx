import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Calendar,
  Heart,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Hotel,
  Ticket,
  MapPin,
  LogOut,
  Sliders,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Crown,
  Plane,
  Share2,
  Download,
  FileText,
  Calendar as CalendarIcon,
  ChevronDown,
  Check,
  WifiOff,
  Camera,
  Edit3,
  Phone,
  MessageSquare,
  Headphones,
  Upload,
  Trash2,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, Destination, StayItem, TripFeedbackData } from '../types/travel';
import { DESTINATIONS, STAYS_DATA, ACTIVITIES_DATA } from '../data/travelData';
import { WandrLogo } from './WandrLogo';
import { UserAvatar } from './UserAvatar';
import { PRESET_AVATARS, DEFAULT_AVATAR_URL } from '../utils/avatarUtils';
import {
  downloadUpcomingTripPdf,
  downloadUpcomingTripIcs,
  UpcomingTripItem,
} from '../utils/tripExportService';

interface UserAccountModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onViewItinerary: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectStay: (stay: StayItem) => void;
  onOpenFeedback?: (trip: TripFeedbackData) => void;
  onOpenShare?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onViewItinerary,
  onSelectDestination,
  onSelectStay,
  onOpenFeedback,
  onOpenShare,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved' | 'settings'>('upcoming');
  const [savedSubTab, setSavedSubTab] = useState<'stays' | 'destinations' | 'activities'>('stays');
  const [showPhotoPreview, setShowPhotoPreview] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState<string>(userProfile.name);
  const [editEmail, setEditEmail] = useState<string>(userProfile.email);
  const [editPhone, setEditPhone] = useState<string>(userProfile.phone || '+91 98765 43210');
  const [editAvatar, setEditAvatar] = useState<string>(userProfile.avatar || DEFAULT_AVATAR_URL);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Offline Export States
  const [openExportMenuId, setOpenExportMenuId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<{
    tripId: string;
    type: 'pdf' | 'ics';
  } | null>(null);
  const [exportNotice, setExportNotice] = useState<{
    tripId: string;
    text: string;
  } | null>(null);

  // Concierge Support Modal State
  const [supportModalTrip, setSupportModalTrip] = useState<UpcomingTripItem | null>(null);
  const [supportActionNotice, setSupportActionNotice] = useState<string | null>(null);
  const [callbackRequested, setCallbackRequested] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleExportPdf = (trip: UpcomingTripItem) => {
    setIsExporting({ tripId: trip.id, type: 'pdf' });
    try {
      downloadUpcomingTripPdf(trip, userProfile);
      setExportNotice({ tripId: trip.id, text: 'PDF Voucher downloaded!' });
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(null);
      setOpenExportMenuId(null);
    }
  };

  const handleExportIcs = (trip: UpcomingTripItem) => {
    setIsExporting({ tripId: trip.id, type: 'ics' });
    try {
      downloadUpcomingTripIcs(trip, userProfile);
      setExportNotice({ tripId: trip.id, text: 'Calendar (.ics) downloaded!' });
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('ICS export failed:', err);
    } finally {
      setIsExporting(null);
      setOpenExportMenuId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: editName.trim() || 'Ayan',
      email: editEmail.trim() || 'ayanalamxnaruto@gmail.com',
      phone: editPhone.trim() || '+91 98765 43210',
      avatar: editAvatar || DEFAULT_AVATAR_URL,
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setIsEditingProfile(false);
    setSaveSuccessMessage('Profile details & photo updated successfully!');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleRemoveSavedStay = (stayId: string) => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        savedStayIds: userProfile.savedStayIds.filter((id) => id !== stayId),
      });
    }
  };

  const handleRemoveSavedDestination = (destId: string) => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        savedDestinationIds: userProfile.savedDestinationIds.filter((id) => id !== destId),
      });
    }
  };

  const handleRemoveSavedActivity = (activityId: string) => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        savedActivityIds: userProfile.savedActivityIds.filter((id) => id !== activityId),
      });
    }
  };

  const handleRequestCallback = () => {
    setCallbackRequested(true);
    setSupportActionNotice('Your priority callback request has been logged. Senior Concierge Wayan will call in 3 mins.');
    setTimeout(() => {
      setSupportActionNotice(null);
    }, 6000);
  };

  const savedStays = STAYS_DATA.filter((s) => userProfile.savedStayIds.includes(s.id));
  const savedDests = DESTINATIONS.filter((d) => userProfile.savedDestinationIds.includes(d.id));
  const savedActivities = ACTIVITIES_DATA.filter((a) => userProfile.savedActivityIds.includes(a.id));

  return (
    <>
      <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-[#FDFCFB] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden border border-stone-200 shadow-2xl flex flex-col animate-fadeIn">
          {/* Modal Header & User Profile Banner */}
          <div className="relative bg-stone-900 text-white overflow-hidden p-5 sm:p-8">
            {/* Subtle Gradient Backlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#FF5722]/20 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Interactive Profile Photo Container */}
                <div className="relative group shrink-0">
                  <div
                    onClick={() => setShowPhotoPreview(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-3 ring-[#FF5722]/80 group-hover:ring-[#FF5722] transition-all shadow-lg bg-stone-800 cursor-pointer"
                    title="Click to view full photo"
                  >
                    <UserAvatar
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      size="custom"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                    />
                  </div>

                  {/* Change Photo Badge button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(true);
                      setActiveTab('settings');
                    }}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white shadow-md border-2 border-stone-900 cursor-pointer transition-transform active:scale-95"
                    title="Change Profile Photo & Details"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                      {userProfile.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FFA726] text-[10px] font-semibold tracking-wide flex items-center gap-1">
                      <Crown className="w-3 h-3 text-[#FFA726]" />
                      {userProfile.isPremium ? userProfile.premiumTier || 'VIP Member' : 'Wandr Explorer'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-light flex items-center gap-2 flex-wrap">
                    <span>{userProfile.email}</span>
                    {userProfile.phone && (
                      <>
                        <span>•</span>
                        <span>{userProfile.phone}</span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(!isEditingProfile);
                        if (!isEditingProfile) setActiveTab('settings');
                      }}
                      className="text-[#FFA726] hover:text-[#FFB74D] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingProfile ? 'Close Editor' : 'Edit Profile & Avatar'}</span>
                    </button>
                    <span className="text-stone-500">•</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified VIP
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success toast inside modal */}
            {saveSuccessMessage && (
              <div className="mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            {/* Account Fast Stats Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-4 border-t border-stone-800/80">
              <div
                onClick={() => setActiveTab('upcoming')}
                className="bg-stone-800/50 hover:bg-stone-800/80 rounded-xl p-2.5 text-center border border-stone-700/50 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">Upcoming</span>
                <span className="text-base sm:text-lg font-bold text-white">{userProfile.upcomingTrips.length} Journey</span>
              </div>
              <div
                onClick={() => setActiveTab('past')}
                className="bg-stone-800/50 hover:bg-stone-800/80 rounded-xl p-2.5 text-center border border-stone-700/50 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">Past Trips</span>
                <span className="text-base sm:text-lg font-bold text-white">{userProfile.pastTrips.length} Completed</span>
              </div>
              <div
                onClick={() => setActiveTab('saved')}
                className="bg-stone-800/50 hover:bg-stone-800/80 rounded-xl p-2.5 text-center border border-stone-700/50 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">Saved</span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {userProfile.savedStayIds.length + userProfile.savedDestinationIds.length + userProfile.savedActivityIds.length} Items
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex border-b border-stone-200 bg-[#FDFCFB] px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('upcoming');
                setIsEditingProfile(false);
              }}
              className={`py-3.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'border-[#E05A47] text-[#E05A47]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Upcoming Trips ({userProfile.upcomingTrips.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('past');
                setIsEditingProfile(false);
              }}
              className={`py-3.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'past'
                  ? 'border-[#E05A47] text-[#E05A47]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Past Memories ({userProfile.pastTrips.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('saved');
                setIsEditingProfile(false);
              }}
              className={`py-3.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'border-[#E05A47] text-[#E05A47]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Wishlist & Saved (
              {userProfile.savedStayIds.length + userProfile.savedDestinationIds.length + userProfile.savedActivityIds.length}
              )
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsEditingProfile(true);
              }}
              className={`py-3.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#E05A47] text-[#E05A47]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Edit Profile
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
            {/* 1. Upcoming Trips */}
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {/* Offline Travel Helper Notice */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                      <WifiOff className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-amber-900 leading-snug">
                      <span className="font-bold">Offline Access:</span> Export your confirmed trip details as a PDF voucher or sync to your calendar (.ics) for full access when offline or in transit.
                    </p>
                  </div>
                </div>

                {userProfile.upcomingTrips.length === 0 ? (
                  <div className="text-center py-10">
                    <Plane className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-stone-700">No upcoming trips planned yet.</p>
                    <button
                      onClick={() => {
                        onClose();
                        onViewItinerary();
                      }}
                      className="mt-3 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-[#E05A47] transition-all cursor-pointer"
                    >
                      Plan Your Next Journey
                    </button>
                  </div>
                ) : (
                  userProfile.upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-3xl p-5 border border-stone-200/90 flex flex-col lg:flex-row items-start lg:items-center gap-5 justify-between shadow-2xs relative"
                    >
                      <div className="flex items-center gap-4 w-full lg:w-auto">
                        <img
                          src={trip.coverImage}
                          alt={trip.destinationName}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-lg font-serif font-bold text-stone-900">
                              {trip.destinationName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-medium flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" />
                              <span>{trip.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-light">
                            {trip.dates} ({trip.days} Days) • {trip.companion}
                          </p>
                          <p className="text-xs font-serif font-bold text-stone-900 mt-1">
                            ₹{trip.totalCost.toLocaleString('en-IN')} All-Inclusive
                          </p>

                          {/* Export feedback message */}
                          {exportNotice && exportNotice.tripId === trip.id && (
                            <div className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-fadeIn">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{exportNotice.text}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
                        <button
                          onClick={() => {
                            onClose();
                            onViewItinerary();
                          }}
                          className="flex-1 lg:flex-none px-4 py-2 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          View Itinerary
                        </button>

                        {/* Export Dropdown / Action Menu */}
                        <div className="relative flex-1 lg:flex-none">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenExportMenuId(openExportMenuId === trip.id ? null : trip.id)
                            }
                            className={`w-full lg:w-auto px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap ${
                              openExportMenuId === trip.id
                                ? 'bg-stone-800 text-white'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90'
                            }`}
                            title="Export trip for offline access (PDF or Calendar)"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Export Offline</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${
                                openExportMenuId === trip.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Popover Menu */}
                          {openExportMenuId === trip.id && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-2 z-30 animate-fadeIn">
                              <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
                                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                                  Offline Export Options
                                </span>
                              </div>

                              {/* 1. PDF Export */}
                              <button
                                type="button"
                                onClick={() => handleExportPdf(trip)}
                                disabled={isExporting?.tripId === trip.id}
                                className="w-full px-3 py-2 rounded-xl text-left hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer group disabled:opacity-50"
                              >
                                <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 shrink-0 mt-0.5">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                                    <span>Download PDF Voucher</span>
                                    {isExporting?.tripId === trip.id && isExporting.type === 'pdf' && (
                                      <span className="text-[10px] text-amber-600 font-normal">Building...</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">
                                    Formatted multi-page guide with schedules, voucher ID & emergency desk.
                                  </p>
                                </div>
                              </button>

                              {/* 2. ICS Calendar Sync */}
                              <button
                                type="button"
                                onClick={() => handleExportIcs(trip)}
                                disabled={isExporting?.tripId === trip.id}
                                className="w-full px-3 py-2 rounded-xl text-left hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer group disabled:opacity-50 mt-1"
                              >
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 shrink-0 mt-0.5">
                                  <CalendarIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                                    <span>Sync to Calendar (.ics)</span>
                                    {isExporting?.tripId === trip.id && isExporting.type === 'ics' && (
                                      <span className="text-[10px] text-amber-600 font-normal">Exporting...</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">
                                    Add all daily activities to Google Calendar, Apple iCal or Outlook.
                                  </p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        {onOpenShare && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenShare();
                            }}
                            className="flex-1 lg:flex-none px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Share2 className="w-3 h-3 text-[#E05A47]" />
                            <span>Share</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSupportModalTrip(trip)}
                          className="flex-1 lg:flex-none px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                          <Headphones className="w-3.5 h-3.5 text-stone-500" />
                          <span>Support</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. Past Trips */}
            {activeTab === 'past' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProfile.pastTrips.map((past) => {
                  const dest = DESTINATIONS.find((d) => d.name.toLowerCase().includes(past.destinationName.toLowerCase().split(' ')[0])) || DESTINATIONS[0];

                  return (
                    <div
                      key={past.id}
                      className="bg-white rounded-2xl p-4 border border-stone-200/90 flex flex-col justify-between shadow-2xs gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={past.coverImage}
                          alt={past.destinationName}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-stone-100"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-serif font-bold text-stone-900 truncate">
                            {past.destinationName}
                          </h5>
                          <p className="text-[11px] text-stone-500 font-light">{past.dates}</p>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-medium">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{past.rating}.0 • Completed</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenFeedback) {
                              onOpenFeedback({
                                tripId: past.id,
                                destinationName: past.destinationName,
                                country: past.country,
                                coverImage: past.coverImage,
                                dates: past.dates,
                              });
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-700 border border-stone-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#E05A47]" />
                          <span>Review</span>
                        </button>

                        <button
                          onClick={() => {
                            onSelectDestination(dest);
                            onClose();
                          }}
                          className="py-2 px-3 rounded-xl bg-[#E05A47] hover:bg-[#c94b39] text-white text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="Plan this destination again"
                        >
                          <span>Rebook</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Saved Wishlist */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-stone-200 pb-2">
                  <button
                    onClick={() => setSavedSubTab('stays')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      savedSubTab === 'stays' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Hotels & Stays ({savedStays.length})
                  </button>
                  <button
                    onClick={() => setSavedSubTab('destinations')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      savedSubTab === 'destinations' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Destinations ({savedDests.length})
                  </button>
                  <button
                    onClick={() => setSavedSubTab('activities')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      savedSubTab === 'activities' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Activities ({savedActivities.length})
                  </button>
                </div>

                {/* Stays SubTab */}
                {savedSubTab === 'stays' && (
                  <div className="space-y-3">
                    {savedStays.length === 0 ? (
                      <p className="text-xs text-stone-500 py-6 text-center">No saved stays yet. Browse villas and click the heart icon to save!</p>
                    ) : (
                      savedStays.map((stay) => (
                        <div
                          key={stay.id}
                          className="p-3 bg-white rounded-2xl border border-stone-200/90 flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={stay.images[0]}
                              alt={stay.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="text-xs font-serif font-bold text-stone-900">{stay.name}</h5>
                              <span className="text-[11px] text-stone-500 font-light">
                                ₹{stay.pricePerNight.toLocaleString('en-IN')}/night • {stay.propertyType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onSelectStay(stay);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                            >
                              Select Stay
                            </button>
                            <button
                              onClick={() => handleRemoveSavedStay(stay.id)}
                              className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Destinations SubTab */}
                {savedSubTab === 'destinations' && (
                  <div className="space-y-3">
                    {savedDests.length === 0 ? (
                      <p className="text-xs text-stone-500 py-6 text-center">No saved destinations yet.</p>
                    ) : (
                      savedDests.map((dest) => (
                        <div
                          key={dest.id}
                          className="p-3 bg-white rounded-2xl border border-stone-200/90 flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={dest.coverImage}
                              alt={dest.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="text-xs font-serif font-bold text-stone-900">
                                {dest.name}, {dest.country}
                              </h5>
                              <span className="text-[11px] text-stone-500 font-light">
                                {dest.estimatedBudget} • {dest.bestTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onSelectDestination(dest);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                            >
                              Plan Trip
                            </button>
                            <button
                              onClick={() => handleRemoveSavedDestination(dest.id)}
                              className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Activities SubTab */}
                {savedSubTab === 'activities' && (
                  <div className="space-y-3">
                    {savedActivities.length === 0 ? (
                      <p className="text-xs text-stone-500 py-6 text-center">No saved experiences yet.</p>
                    ) : (
                      savedActivities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 bg-white rounded-2xl border border-stone-200/90 flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={act.image}
                              alt={act.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h5 className="text-xs font-serif font-bold text-stone-900">{act.title}</h5>
                              <span className="text-[11px] text-stone-500 font-light">
                                ₹{act.price.toLocaleString('en-IN')} • {act.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onClose();
                                onViewItinerary();
                              }}
                              className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                            >
                              Explore
                            </button>
                            <button
                              onClick={() => handleRemoveSavedActivity(act.id)}
                              className="p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. Edit Profile & Avatar Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveProfile} className="space-y-5 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">
                    Select Profile Avatar
                  </h4>
                  <p className="text-xs text-stone-500 font-light mb-3">
                    Choose one of our hand-curated traveler styles, or upload your own picture.
                  </p>

                  {/* Preset Avatar Selection Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = editAvatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditAvatar(preset.url)}
                          className={`relative p-1 rounded-2xl transition-all cursor-pointer text-center group ${
                            isSelected
                              ? 'ring-3 ring-[#E05A47] bg-[#E05A47]/10'
                              : 'hover:ring-2 hover:ring-stone-300 bg-stone-50'
                          }`}
                        >
                          <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden shadow-xs">
                            <UserAvatar
                              src={preset.url}
                              alt={preset.name}
                              size="custom"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[10px] text-stone-600 block mt-1 truncate font-medium">
                            {preset.name.split(' ')[0]}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E05A47] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Upload & URL options */}
                  <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#E05A47]" />
                      <span>Upload Custom Photo File</span>
                    </button>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl.trim()) {
                            setEditAvatar(customAvatarUrl.trim());
                            setCustomAvatarUrl('');
                          }
                        }}
                        disabled={!customAvatarUrl.trim()}
                        className="px-3 py-2 bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-semibold rounded-xl disabled:opacity-50 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Phone (VIP Hotline Sync)</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E05A47]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setActiveTab('upcoming');
                    }}
                    className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#E05A47] hover:bg-[#c94b39] text-white text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Full Photo Zoom Lightbox */}
      {showPhotoPreview && (
        <div
          onClick={() => setShowPhotoPreview(false)}
          className="fixed inset-0 z-60 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700/80 shadow-2xl p-5 text-center cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-stone-300">
              <span className="text-xs font-semibold text-white tracking-wide">Profile Photo</span>
              <button
                onClick={() => setShowPhotoPreview(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-4 rounded-2xl overflow-hidden ring-1 ring-stone-700 shadow-inner bg-black flex items-center justify-center max-h-[65vh]">
              <UserAvatar
                src={userProfile.avatar}
                alt={userProfile.name}
                size="custom"
                className="w-full h-auto max-h-[65vh] object-contain rounded-2xl"
              />
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
              <span className="font-medium text-white">{userProfile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoPreview(false);
                  setActiveTab('settings');
                  setIsEditingProfile(true);
                }}
                className="text-[#FFA726] hover:underline font-medium cursor-pointer"
              >
                Change Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Concierge Support Drawer / Dialog */}
      {supportModalTrip && (
        <div
          onClick={() => setSupportModalTrip(null)}
          className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl overflow-hidden border border-stone-200 shadow-2xl p-6 text-stone-900 cursor-default"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-stone-900 text-[#FFA726]">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-stone-900">
                    24/7 Wandr Concierge Desk
                  </h4>
                  <span className="text-[11px] text-stone-500 font-light">
                    Trip: {supportModalTrip.destinationName} ({supportModalTrip.dates})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSupportModalTrip(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {supportActionNotice && (
              <div className="my-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{supportActionNotice}</span>
              </div>
            )}

            <div className="my-4 space-y-2.5 text-xs">
              {/* WhatsApp VIP Channel */}
              <a
                href={`https://wa.me/919876543210?text=Hi%20Wandr%20VIP%20Concierge,%20I%20need%20assistance%20for%20my%20trip%20to%20${encodeURIComponent(
                  supportModalTrip.destinationName
                )}%20(Voucher%20ID:%20${supportModalTrip.id}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between shadow-xs transition-colors cursor-pointer block"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold block">VIP WhatsApp Support Channel</span>
                    <span className="text-[10px] text-emerald-100">Live human agent replies in ~45 seconds</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>

              {/* Instant 5-Min Callback */}
              <button
                type="button"
                onClick={handleRequestCallback}
                disabled={callbackRequested}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-between transition-colors cursor-pointer disabled:opacity-60 text-left"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-[#E05A47] shrink-0" />
                  <div>
                    <span className="font-bold block">
                      {callbackRequested ? 'Callback Scheduled (Priority Queue #1)' : 'Request 5-Minute Phone Callback'}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Our destination specialist will call {userProfile.phone || '+91 98765 43210'}
                    </span>
                  </div>
                </div>
                <Clock className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Direct Urgent Hotline */}
              <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-stone-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Global Emergency Hotline</span>
                    <span className="text-[10px] text-stone-500">+91 98765 43210 (Toll-Free Priority)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  24/7 OPEN
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSupportModalTrip(null)}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
