import React from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Heart,
  User,
  Radio,
  Sparkles,
  Plane,
  Crown,
} from 'lucide-react';
import { UserProfile } from '../types/travel';
import { UserAvatar } from './UserAvatar';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  userProfile: UserProfile;
  liveModeActive: boolean;
  setLiveModeActive: (active: boolean) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenSaved,
  userProfile,
  liveModeActive,
  setLiveModeActive,
}) => {
  const totalSaved =
    userProfile.savedStayIds.length +
    userProfile.savedDestinationIds.length +
    userProfile.savedActivityIds.length;

  const isPremium = !!userProfile.isPremium;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-lg border-t border-stone-200/90 py-2 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {/* 1. Explore */}
        <button
          onClick={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-center transition-colors ${
            activeTab === 'explore' ? 'text-[#E05A47]' : 'text-stone-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        {/* 2. Stays */}
        <button
          onClick={() => {
            setActiveTab('stays');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-center transition-colors ${
            activeTab === 'stays' ? 'text-[#E05A47]' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stays</span>
        </button>

        {/* 3. Travel / Transit Hub */}
        <button
          onClick={() => {
            setActiveTab('travel');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-center transition-colors ${
            activeTab === 'travel' ? 'text-[#E05A47]' : 'text-stone-500'
          }`}
        >
          <Plane className="w-5 h-5" />
          <span className="text-[10px] font-medium">Travel</span>
        </button>

        {/* 4. Trips (Itinerary) */}
        <button
          onClick={() => {
            setActiveTab('trips');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-center transition-colors ${
            activeTab === 'trips' ? 'text-[#E05A47]' : 'text-stone-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">Trips</span>
        </button>

        {/* 5. Premium */}
        <button
          onClick={() => {
            setActiveTab('premium');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 text-center transition-colors ${
            activeTab === 'premium' ? 'text-amber-600' : 'text-stone-500'
          }`}
        >
          <Crown className={`w-5 h-5 ${isPremium ? 'text-amber-500' : 'text-stone-500'}`} />
          <span className="text-[10px] font-medium">{isPremium ? 'VIP' : 'Premium'}</span>
        </button>

        {/* 6. Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-1 p-1 text-center text-stone-600 active:scale-95 transition-transform cursor-pointer"
          aria-label="Open Account"
        >
          <div className="relative">
            <UserAvatar
              src={userProfile.avatar}
              alt={userProfile.name}
              size="xs"
              className="w-5 h-5 ring-1.5 ring-stone-900/20"
              showOnlineStatus={true}
            />
          </div>
          <span className="text-[10px] font-medium">Account</span>
        </button>
      </div>
    </div>
  );
};
