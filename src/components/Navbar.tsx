import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  Radio,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Crown,
  Plane,
  Train,
  Bus,
  Car,
} from 'lucide-react';
import { UserProfile } from '../types/travel';
import { WandrLogo } from './WandrLogo';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  onPlanTripClick: () => void;
  userProfile: UserProfile;
  liveModeActive: boolean;
  setLiveModeActive: (active: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenProfile,
  onOpenSaved,
  onPlanTripClick,
  userProfile,
  liveModeActive,
  setLiveModeActive,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalSaved =
    userProfile.savedStayIds.length +
    userProfile.savedDestinationIds.length +
    userProfile.savedActivityIds.length;

  const isPremium = !!userProfile.isPremium;

  const navItems = [
    { id: 'explore', label: 'Explore' },
    { id: 'trips', label: 'Trips' },
    { id: 'stays', label: 'Stays' },
    { id: 'travel', label: 'Travel & Transit' },
    { id: 'activities', label: 'Activities' },
    { id: 'inspiration', label: 'Journal' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-250 ${
          scrolled
            ? 'bg-[#FDFCFB]/95 backdrop-blur-md border-b border-stone-200/70 shadow-2xs py-2.5'
            : 'bg-gradient-to-b from-[#FDFCFB]/80 to-transparent backdrop-blur-xs py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand & Primary Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center text-left focus:outline-none cursor-pointer select-none"
              aria-label="Wandr Home"
            >
              <WandrLogo size="md" variant="horizontal" withTagline={true} animated={true} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-0.5 bg-stone-100/80 p-1 rounded-full border border-stone-200/60 text-xs font-medium">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-white/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions, Subtle Premium CTA, & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 h-9 px-3 rounded-full bg-white/90 border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all text-xs font-medium shadow-2xs cursor-pointer"
              aria-label="Search destinations, stays, or transit"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-stone-100 text-stone-500 rounded border border-stone-200/60 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Subtle Premium CTA / Status */}
            {isPremium ? (
              <button
                onClick={() => {
                  setActiveTab('premium');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-amber-50/80 border border-amber-300/70 text-amber-900 text-xs font-semibold shadow-2xs hover:bg-amber-100/80 cursor-pointer transition-all active:scale-98"
                title="Wandr VIP Benefits Active"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{userProfile.premiumTier || 'VIP Member'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('premium');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/90 border border-stone-200/80 hover:border-amber-400/80 text-stone-700 hover:text-amber-900 hover:bg-amber-50/40 text-xs font-medium shadow-2xs transition-all cursor-pointer active:scale-98 group"
                title="View Wandr Membership Benefits (₹300/mo)"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Premium</span>
                <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded font-semibold">
                  ₹300/mo
                </span>
              </button>
            )}

            {/* Wishlist / Saved */}
            <button
              onClick={onOpenSaved}
              className="relative flex items-center justify-center h-9 w-9 rounded-full bg-white/90 border border-stone-200/80 text-stone-600 hover:text-[#E05A47] hover:border-stone-300 transition-all shadow-2xs cursor-pointer"
              title="Saved Items"
              aria-label="View Saved Items"
            >
              <Heart className="w-3.5 h-3.5" />
              {totalSaved > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E05A47] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalSaved}
                </span>
              )}
            </button>

            {/* User Profile / Account Button */}
            <button
              onClick={onOpenProfile}
              className="group flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full bg-white border border-stone-200/90 hover:border-[#E05A47]/60 hover:shadow-xs transition-all cursor-pointer select-none active:scale-98"
              aria-label="User Account"
              title="Open Account Profile"
            >
              <div className="relative">
                <UserAvatar
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  size="sm"
                  className="w-7 h-7 ring-1.5 ring-stone-900/10 group-hover:ring-[#E05A47]"
                  showOnlineStatus={true}
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-stone-800 group-hover:text-[#E05A47] transition-colors leading-none">
                  {userProfile.name}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>

            {/* Primary Action Button: Plan Trip */}
            <button
              onClick={onPlanTripClick}
              className="group inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-stone-900 text-stone-50 text-xs font-medium shadow-2xs hover:bg-[#E05A47] active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E05A47] group-hover:text-white transition-colors" />
              <span className="font-medium">Plan Trip</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-900 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-stone-950/40 backdrop-blur-xs md:hidden pt-16 px-4 animate-fadeIn">
          <div className="bg-[#FDFCFB] rounded-3xl p-5 border border-stone-200 shadow-xl flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
            {/* Account Quick Card in Mobile Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="p-3.5 bg-stone-900 text-stone-50 rounded-2xl flex items-center justify-between shadow-xs text-left cursor-pointer group mb-1 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    size="md"
                    className="w-11 h-11 ring-2 ring-[#E05A47]"
                    showOnlineStatus={true}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{userProfile.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-medium">
                      Account
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-light truncate block max-w-[180px]">
                    {userProfile.email}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400 -rotate-90" />
            </button>

            {/* Quick Travel Mode Shortcuts in Mobile Menu */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 mb-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 mb-2">
                Quick Travel Modes
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('travel');
                    setMobileMenuOpen(false);
                    const el = document.getElementById('travel-hub');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-stone-200/80 text-stone-800 text-[11px] font-medium active:scale-95"
                >
                  <Plane className="w-4 h-4 text-[#E05A47]" />
                  <span>Flights</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('travel');
                    setMobileMenuOpen(false);
                    const el = document.getElementById('travel-hub');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-stone-200/80 text-stone-800 text-[11px] font-medium active:scale-95"
                >
                  <Train className="w-4 h-4 text-emerald-700" />
                  <span>Trains</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('travel');
                    setMobileMenuOpen(false);
                    const el = document.getElementById('travel-hub');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-stone-200/80 text-stone-800 text-[11px] font-medium active:scale-95"
                >
                  <Bus className="w-4 h-4 text-amber-700" />
                  <span>Buses</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('travel');
                    setMobileMenuOpen(false);
                    const el = document.getElementById('travel-hub');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-stone-200/80 text-stone-800 text-[11px] font-medium active:scale-95"
                >
                  <Car className="w-4 h-4 text-stone-700" />
                  <span>Cabs</span>
                </button>
              </div>
            </div>

            {/* Subtle Mobile Premium Card */}
            <button
              onClick={() => {
                setActiveTab('premium');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between text-xs font-semibold shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>
                  {isPremium
                    ? `${userProfile.premiumTier || 'VIP Member'} Active`
                    : 'Wandr Premium Membership'}
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-normal">
                {isPremium ? 'Perks Active →' : '₹300/mo • 0% Fees →'}
              </span>
            </button>

            <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-1 pt-2">
              Menu
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-left text-xs font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setLiveModeActive(!liveModeActive);
                  setActiveTab('trips');
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium border ${
                  liveModeActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-stone-700 border-stone-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Trip Companion ({liveModeActive ? 'Active' : 'Off'})</span>
              </button>

              <button
                onClick={() => {
                  onPlanTripClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#E05A47] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Design My Custom Trip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
