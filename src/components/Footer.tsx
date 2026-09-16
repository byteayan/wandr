import React from 'react';
import { Sparkles, ArrowRight, Compass, Heart, Globe } from 'lucide-react';
import { WandrLogo } from './WandrLogo';

interface FooterProps {
  onPlanTripClick: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlanTripClick, onNavigateTab }) => {
  return (
    <footer className="bg-[#1C1A18] text-stone-100 pt-20 pb-12 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big Final CTA Section */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-8 sm:p-16 border border-stone-800/80 text-center relative overflow-hidden mb-20 shadow-2xl">
          {/* Subtle Ambient Glow Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E05A47]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold uppercase tracking-[0.18em] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#E05A47]" />
              The New Way to Travel
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-stone-50 leading-tight mb-4">
              Stop planning. <br className="hidden sm:inline" />
              Start Wandring.
            </h2>

            <p className="text-base sm:text-lg text-stone-400 font-light mb-8">
              Your next adventure is closer than you think. Tell us your vibe and let our AI engine orchestrate the flights, villas, and memory-making.
            </p>

            <button
              onClick={onPlanTripClick}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E05A47] hover:bg-[#c94b39] active:scale-98 text-white font-medium text-base shadow-xl shadow-[#E05A47]/20 transition-all cursor-pointer"
            >
              <span>Design my trip</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-16 border-b border-stone-800/80 text-xs">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <WandrLogo size="md" variant="horizontal" theme="white" withTagline={true} />
            <p className="text-stone-400 max-w-sm font-light leading-relaxed">
              “Don’t just book a trip. Design the experience.” <br />
              Wandr is the AI-powered travel platform uniting bespoke discovery, flights, and vetted sanctuaries under one unified journey.
            </p>
            <div className="flex items-center gap-2 text-stone-500 text-[11px] font-light">
              <span>Curated globally with craft & passion</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <button onClick={() => onNavigateTab('explore')} className="hover:text-white transition-colors cursor-pointer">
                  Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('stays')} className="hover:text-white transition-colors cursor-pointer">
                  Villas & Stays
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('travel')} className="hover:text-white transition-colors cursor-pointer">
                  Trains, Flights & Buses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('activities')} className="hover:text-white transition-colors cursor-pointer">
                  Expeditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('premium')} className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <span>Go Premium</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold">VIP</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Experiences */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Vibes
            </h4>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>Romantic Escapes</li>
              <li>Adventure & Highlands</li>
              <li>Culinary & Street Food</li>
              <li>Quiet Wellness & Spas</li>
              <li>Private Pool Sanctuary</li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-300 mb-3">
              Wandr Care
            </h4>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>24/7 On-Trip Concierge</li>
              <li>Transparent Pricing Guarantee</li>
              <li>Unified Free Cancellation</li>
              <li>Safety & Verified Stays</li>
              <li>Contact: hello@wandr.travel</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs font-light">
          <div>
            © {new Date().getFullYear()} WANDR Travel Tech Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Booking Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
