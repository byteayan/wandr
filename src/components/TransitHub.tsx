import React, { useState } from 'react';
import {
  Plane,
  Train,
  Bus,
  Car,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { FlightSearch } from './FlightSearch';
import { TrainSearch } from './TrainSearch';
import { BusSearch } from './BusSearch';
import { CabsSearch } from './CabsSearch';
import {
  FlightOption,
  TrainOption,
  TrainClassOption,
  BusOption,
  CabOption,
  TravelMode,
} from '../types/travel';

interface TransitHubProps {
  initialMode?: TravelMode;
  onSelectFlight: (flight: FlightOption) => void;
  onSelectTrain: (train: TrainOption, selectedClass?: TrainClassOption) => void;
  onSelectBus: (bus: BusOption) => void;
  onSelectCab: (cab: CabOption) => void;
  selectedFlightId?: string;
  selectedTrainId?: string;
  selectedBusId?: string;
  selectedCabId?: string;
  selectedTransitMode?: 'flight' | 'train' | 'bus' | 'cab';
}

export const TransitHub: React.FC<TransitHubProps> = ({
  initialMode = 'flights',
  onSelectFlight,
  onSelectTrain,
  onSelectBus,
  onSelectCab,
  selectedFlightId,
  selectedTrainId,
  selectedBusId,
  selectedCabId,
  selectedTransitMode = 'flight',
}) => {
  const [activeMode, setActiveMode] = useState<TravelMode>(initialMode);

  const travelModes: {
    id: TravelMode;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge?: string;
  }[] = [
    {
      id: 'flights',
      label: 'Flights',
      sublabel: 'Airlines & Direct Routes',
      icon: Plane,
      accentColor: 'text-[#E05A47]',
      badge: 'Zero Markup',
    },
    {
      id: 'trains',
      label: 'Trains',
      sublabel: 'Vande Bharat & Rail',
      icon: Train,
      accentColor: 'text-emerald-700',
      badge: 'Confirmed Berths',
    },
    {
      id: 'buses',
      label: 'Buses',
      sublabel: 'Luxury Volvo Sleepers',
      icon: Bus,
      accentColor: 'text-amber-800',
      badge: 'GPS Tracking',
    },
    {
      id: 'cabs',
      label: 'Cabs & Chauffeurs',
      sublabel: 'Private Airport & City',
      icon: Car,
      accentColor: 'text-stone-800',
      badge: 'Fixed Pricing',
    },
  ];

  return (
    <section id="travel-hub" className="py-14 sm:py-20 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#E05A47]" />
            Multi-Modal Travel & Transit
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            How would you like to travel?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-2">
            Seamlessly search and compare flights, high-speed rail, luxury sleepers, and verified private chauffeurs in one place.
          </p>
        </div>

        {/* Primary Travel-Options 4-Card Selector (Balanced, Highly Accessible) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {travelModes.map((mode) => {
            const isSelected = activeMode === mode.id;
            const Icon = mode.icon;

            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                }}
                className={`relative group text-left p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-1 ring-stone-900'
                    : 'bg-white text-stone-900 border-stone-200/90 hover:border-stone-400 hover:shadow-2xs active:scale-[0.99]'
                }`}
              >
                {/* Top Row: Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : 'bg-[#FAF8F5] text-stone-700 group-hover:scale-105 border border-stone-200/70'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#E05A47]' : mode.accentColor}`} />
                  </div>

                  {mode.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {mode.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Title and Subtitle */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight">
                      {mode.label}
                    </h3>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47] inline-block" />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 font-light line-clamp-1 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {mode.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Travel Mode Search Interface */}
        <div className="animate-fadeIn">
          {activeMode === 'flights' && (
            <FlightSearch
              onSelectFlight={onSelectFlight}
              selectedFlightId={selectedFlightId}
            />
          )}

          {activeMode === 'trains' && (
            <TrainSearch
              onSelectTrain={onSelectTrain}
              selectedTrainId={selectedTrainId}
            />
          )}

          {activeMode === 'buses' && (
            <BusSearch
              onSelectBus={onSelectBus}
              selectedBusId={selectedBusId}
            />
          )}

          {activeMode === 'cabs' && (
            <CabsSearch
              onSelectCab={onSelectCab}
              selectedCabId={selectedCabId}
            />
          )}
        </div>
      </div>
    </section>
  );
};
