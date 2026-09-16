import React from 'react';
import { ShieldCheck, Eye, Headphones, CheckCircle2, RefreshCw } from 'lucide-react';

export const TrustTransparency: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'Zero Hidden Markups',
      desc: 'Transparent line-item invoices showing exact airfares, stay tariffs, and vehicle fuel with 5% GST explicitly shown.',
    },
    {
      icon: ShieldCheck,
      title: '100% Hand-Vetted Stays',
      desc: 'Every villa, riad, and boutique suite is inspected for aesthetic beauty, cleanliness, fast Wi-Fi, and hospitality.',
    },
    {
      icon: Headphones,
      title: '24/7 Live On-Trip Concierge',
      desc: 'Direct bilingual WhatsApp helpline available during your trip for table bookings, luggage queries, and quick reroutes.',
    },
    {
      icon: RefreshCw,
      title: 'Flexible Unified Cancellation',
      desc: 'One-click cancellation terms across your flights, stay, and activities with zero administrative processing penalties.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity First
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Built on radical travel transparency.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light mt-2">
            We don’t believe in confusing travel agent commissions or fake discounts. Just clean,
            intelligent travel design.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-900 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#E05A47]" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 mb-2">{p.title}</h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">{p.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Wandr Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
