import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Sparkles,
  Luggage,
  ShieldCheck,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  Compass,
  FileText,
  Shirt,
  Smartphone,
  HeartPulse,
  Tag,
  Check,
  Copy,
} from 'lucide-react';
import { TripPlan } from '../types/travel';
import {
  ChecklistItem,
  ChecklistCategory,
  generatePreTripChecklist,
  PreTripChecklistData,
} from '../utils/preTripChecklistEngine';

interface PreTripChecklistProps {
  tripPlan: TripPlan;
  className?: string;
}

export const PreTripChecklist: React.FC<PreTripChecklistProps> = ({ tripPlan, className = '' }) => {
  const [checklistData, setChecklistData] = useState<PreTripChecklistData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChecklistCategory | 'all'>('all');
  const [showUnpackedOnly, setShowUnpackedOnly] = useState<boolean>(false);
  const [showLuggageTips, setShowLuggageTips] = useState<boolean>(false);
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistCategory>('clothing');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  // Storage key based on destination ID
  const storageKey = `wandr_checklist_${tripPlan?.destination?.id || 'default'}`;

  // Initialize or load checklist from storage / generator
  useEffect(() => {
    if (!tripPlan || !tripPlan.destination) return;

    const baseData = generatePreTripChecklist(tripPlan);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        // Merge saved packed states & custom items
        const savedPackedMap = new Map<string, boolean>();
        const savedCustomItems: ChecklistItem[] = [];

        if (Array.isArray(parsedSaved.items)) {
          parsedSaved.items.forEach((item: ChecklistItem) => {
            if (item.isCustom) {
              savedCustomItems.push(item);
            } else {
              savedPackedMap.set(item.id, item.packed);
            }
          });
        }

        const mergedItems = baseData.items.map((item) => ({
          ...item,
          packed: savedPackedMap.has(item.id) ? !!savedPackedMap.get(item.id) : false,
        }));

        const finalItems = [...mergedItems, ...savedCustomItems];
        const packedCount = finalItems.filter((i) => i.packed).length;
        const readiness = Math.round((packedCount / Math.max(1, finalItems.length)) * 100);

        setChecklistData({
          ...baseData,
          items: finalItems,
          packedItemsCount: packedCount,
          totalItemsCount: finalItems.length,
          readinessPercentage: readiness,
        });
        return;
      }
    } catch {
      // Storage error fallback
    }

    setChecklistData(baseData);
  }, [
    tripPlan.destination?.id,
    tripPlan.durationDays,
    tripPlan.companion,
    tripPlan.selectedActivities?.length,
  ]);

  // Persist changes to localStorage
  const saveToStorage = (updatedItems: ChecklistItem[]) => {
    if (!checklistData) return;
    const packedCount = updatedItems.filter((i) => i.packed).length;
    const readiness = Math.round((packedCount / Math.max(1, updatedItems.length)) * 100);

    const updatedData: PreTripChecklistData = {
      ...checklistData,
      items: updatedItems,
      packedItemsCount: packedCount,
      totalItemsCount: updatedItems.length,
      readinessPercentage: readiness,
    };

    setChecklistData(updatedData);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    } catch {
      // Ignore
    }
  };

  const toggleItemPacked = (id: string) => {
    if (!checklistData) return;
    const updated = checklistData.items.map((it) =>
      it.id === id ? { ...it, packed: !it.packed } : it
    );
    saveToStorage(updated);
  };

  const handlePackAll = () => {
    if (!checklistData) return;
    const updated = checklistData.items.map((it) => ({ ...it, packed: true }));
    saveToStorage(updated);
  };

  const handleResetAll = () => {
    if (!checklistData) return;
    const updated = checklistData.items.map((it) => ({ ...it, packed: false }));
    saveToStorage(updated);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !checklistData) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle.trim(),
      category: newItemCategory,
      categoryLabel:
        newItemCategory === 'documents'
          ? 'Documents & Wallet'
          : newItemCategory === 'clothing'
            ? 'Clothing & Apparel'
            : newItemCategory === 'activity_gear'
              ? 'Activity & Experience Gear'
              : newItemCategory === 'electronics'
                ? 'Electronics & Gadgets'
                : 'Health & Toiletries',
      reasonTag: 'Personal Traveler Item',
      isEssential: false,
      packed: false,
      isCustom: true,
    };

    const updated = [newItem, ...checklistData.items];
    saveToStorage(updated);
    setNewItemTitle('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id: string) => {
    if (!checklistData) return;
    const updated = checklistData.items.filter((it) => it.id !== id);
    saveToStorage(updated);
  };

  const handleCopyToClipboard = () => {
    if (!checklistData) return;
    const lines = [
      `🎒 Pre-Trip Packing List for ${checklistData.destinationName} (${checklistData.durationDays} Days)`,
      `Progress: ${checklistData.packedItemsCount}/${checklistData.totalItemsCount} Packed (${checklistData.readinessPercentage}%)\n`,
    ];

    const grouped: Record<string, ChecklistItem[]> = {};
    checklistData.items.forEach((it) => {
      const cat = it.categoryLabel;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(it);
    });

    Object.entries(grouped).forEach(([cat, list]) => {
      lines.push(`\n📌 ${cat.toUpperCase()}:`);
      list.forEach((item) => {
        lines.push(`${item.packed ? '[x]' : '[ ]'} ${item.title} (${item.reasonTag})`);
      });
    });

    lines.push(`\nGenerated with Wandr`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!checklistData) return null;

  // Filter items
  const filteredItems = checklistData.items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (showUnpackedOnly && item.packed) {
      return false;
    }
    return true;
  });

  const categoriesConfig: {
    key: ChecklistCategory | 'all';
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: 'all',
      label: 'All Items',
      icon: <Luggage className="w-3.5 h-3.5" />,
      count: checklistData.items.length,
    },
    {
      key: 'documents',
      label: 'Documents & Wallet',
      icon: <FileText className="w-3.5 h-3.5" />,
      count: checklistData.items.filter((i) => i.category === 'documents').length,
    },
    {
      key: 'clothing',
      label: 'Climate & Apparel',
      icon: <Shirt className="w-3.5 h-3.5" />,
      count: checklistData.items.filter((i) => i.category === 'clothing').length,
    },
    {
      key: 'activity_gear',
      label: 'Activity Gear',
      icon: <Compass className="w-3.5 h-3.5" />,
      count: checklistData.items.filter((i) => i.category === 'activity_gear').length,
    },
    {
      key: 'electronics',
      label: 'Tech & Power',
      icon: <Smartphone className="w-3.5 h-3.5" />,
      count: checklistData.items.filter((i) => i.category === 'electronics').length,
    },
    {
      key: 'health_toiletries',
      label: 'Health & Toiletries',
      icon: <HeartPulse className="w-3.5 h-3.5" />,
      count: checklistData.items.filter((i) => i.category === 'health_toiletries').length,
    },
  ];

  // Readiness status badge calculation
  const getReadinessMessage = (pct: number) => {
    if (pct === 100) {
      return {
        title: 'Ready for Takeoff! 🛫',
        desc: 'Everything is packed and verified. Have an unforgettable journey!',
        badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        barColor: 'bg-emerald-500',
      };
    }
    if (pct >= 75) {
      return {
        title: 'Almost Packed! 🎒',
        desc: 'Just a few final essentials remaining before departure.',
        badgeClass: 'bg-teal-950 text-teal-300 border-teal-800',
        barColor: 'bg-teal-500',
      };
    }
    if (pct >= 40) {
      return {
        title: 'Great Momentum ✨',
        desc: 'Your travel kit is shaping up nicely.',
        badgeClass: 'bg-amber-950 text-amber-300 border-amber-800',
        barColor: 'bg-amber-500',
      };
    }
    return {
      title: 'Checklist Generated 📋',
      desc: 'Tailored to your destination climate, flights, and booked experiences.',
      badgeClass: 'bg-stone-800 text-stone-300 border-stone-700',
      barColor: 'bg-[#E05A47]',
    };
  };

  const statusInfo = getReadinessMessage(checklistData.readinessPercentage);

  return (
    <div
      id="pre-trip-checklist-section"
      className={`bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-2xs mb-10 overflow-hidden relative ${className}`}
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-50/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Smart Pre-Trip Preparation</span>
            </span>
            <span className="text-[10px] text-stone-400 font-light hidden sm:inline">
              • Customized for {checklistData.destinationName} ({checklistData.durationDays} Days)
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Pre-Trip Packing & Readiness</span>
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5 max-w-xl">
            Auto-curated packing essentials based on local climate, airline baggage rules, and
            planned activities.
          </p>
        </div>

        {/* Action Buttons: Luggage Rules, Copy, Print */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLuggageTips(!showLuggageTips)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLuggageTips
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80'
            }`}
          >
            <Luggage className="w-3.5 h-3.5 text-amber-500" />
            <span>Luggage Guide & Limits</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showLuggageTips ? 'rotate-180' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80 transition-colors cursor-pointer relative"
            title="Copy checklist to clipboard"
            aria-label="Copy checklist to clipboard"
          >
            {copiedToast ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/80 transition-colors cursor-pointer"
            title="Print or save as PDF"
            aria-label="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LUGGAGE ADVISOR COLLAPSIBLE DRAWER */}
      <AnimatePresence>
        {showLuggageTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="my-5 p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900 mb-1">
                  <Luggage className="w-4 h-4 text-[#E05A47]" />
                  <span>Cabin & Checked Allowance</span>
                </div>
                <p className="text-stone-600 font-light leading-relaxed mb-2">
                  {checklistData.luggageAdvice.carryOnLimits}
                </p>
                <p className="text-stone-600 font-light leading-relaxed">
                  {checklistData.luggageAdvice.checkedBagAdvice}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-rose-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-rose-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Aviation Baggage Warnings</span>
                </div>
                <ul className="space-y-1 text-stone-600 font-light">
                  {checklistData.luggageAdvice.prohibitedInChecked.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Smart Packing Hacks</span>
                </div>
                <ul className="space-y-1 text-stone-600 font-light">
                  {checklistData.luggageAdvice.packingHacks.slice(0, 3).map((hack, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hack}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* READINESS PROGRESS HERO BAR */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-stone-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          {/* Circular Percentage Meter */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  checklistData.readinessPercentage === 100 ? 'text-emerald-400' : 'text-[#E05A47]'
                } transition-all duration-500`}
                strokeDasharray={`${checklistData.readinessPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-serif text-white">
              {checklistData.readinessPercentage}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                {statusInfo.title}
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                {checklistData.packedItemsCount} of {checklistData.totalItemsCount} Packed
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light mt-0.5">{statusInfo.desc}</p>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex items-center gap-2 relative z-10 self-end sm:self-center">
          <button
            type="button"
            onClick={handlePackAll}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pack All</span>
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH / TOGGLE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoriesConfig.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                    : 'bg-[#FAF8F5] hover:bg-stone-100 text-stone-600 border border-stone-200/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200/70 text-stone-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unpacked only toggle + Add item trigger */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUnpackedOnly}
              onChange={(e) => setShowUnpackedOnly(e.target.checked)}
              className="rounded text-[#E05A47] focus:ring-[#E05A47] border-stone-300 w-3.5 h-3.5"
            />
            <span>Unpacked only</span>
          </label>

          <button
            type="button"
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-700" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* ADD CUSTOM ITEM DRAWER */}
      <AnimatePresence>
        {isAddingItem && (
          <motion.form
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onSubmit={handleAddCustomItem}
            className="mb-4 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="e.g. Scuba logbook, Travel journal, Extra camera battery..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="flex-1 w-full bg-white border border-amber-300/80 rounded-xl px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
            />

            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as ChecklistCategory)}
              className="w-full sm:w-auto bg-white border border-amber-300/80 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="clothing">Climate & Apparel</option>
              <option value="activity_gear">Activity Gear</option>
              <option value="documents">Documents & Wallet</option>
              <option value="electronics">Tech & Power</option>
              <option value="health_toiletries">Health & Toiletries</option>
            </select>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* CHECKLIST ITEMS LIST */}
      <div className="space-y-2 mt-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF8F5] rounded-2xl border border-stone-200/70 text-stone-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-serif font-bold text-stone-800">
              {showUnpackedOnly ? 'All items in this category are packed!' : 'No items found.'}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {showUnpackedOnly
                ? 'Uncheck "Unpacked only" to view all packed items.'
                : 'Click "Add Item" to add your custom items.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isNotesExpanded = expandedNotesId === item.id;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  item.packed
                    ? 'bg-emerald-50/40 border-emerald-200/60'
                    : 'bg-[#FAF8F5] hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Interactive Checkbox & Item Label */}
                  <button
                    type="button"
                    onClick={() => toggleItemPacked(item.id)}
                    className="flex-1 flex items-start gap-3 text-left transition-colors cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        item.packed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'border-stone-300 bg-white hover:border-stone-400'
                      }`}
                    >
                      {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold leading-tight ${
                            item.packed
                              ? 'line-through text-stone-400 font-normal'
                              : 'text-stone-900'
                          }`}
                        >
                          {item.title}
                        </span>

                        {item.isEssential && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-0.5 shrink-0">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Essential
                          </span>
                        )}

                        {/* Climate/Activity Custom Tag */}
                        <span
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                            item.reasonTag.includes('Tropical') ||
                            item.reasonTag.includes('Climate')
                              ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                              : item.reasonTag.includes('Trek') ||
                                  item.reasonTag.includes('Water') ||
                                  item.reasonTag.includes('Tour')
                                ? 'bg-sky-50 text-sky-900 border border-sky-200/80'
                                : item.reasonTag.includes('Border') ||
                                    item.reasonTag.includes('Flight')
                                  ? 'bg-purple-50 text-purple-900 border border-purple-200/80'
                                  : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          <Tag className="w-2.5 h-2.5 opacity-70" />
                          <span>{item.reasonTag}</span>
                        </span>
                      </div>

                      {/* Small Category Label */}
                      <span className="text-[10px] text-stone-400 font-light block mt-0.5">
                        {item.categoryLabel}
                      </span>
                    </div>
                  </button>

                  {/* Right Actions: Notes toggle or Custom Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.notes && (
                      <button
                        type="button"
                        onClick={() => setExpandedNotesId(isNotesExpanded ? null : item.id)}
                        className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer flex items-center gap-1 ${
                          isNotesExpanded
                            ? 'bg-stone-200 text-stone-800'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                        }`}
                        title="View packing note"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {item.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete custom item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Notes Section */}
                {item.notes && isNotesExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 pl-8 text-[11px] text-stone-600 font-light flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item.notes}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER SUMMARY & PERSISTENCE NOTICE */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400 font-light">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Autosaved locally to your browser. Your packing progress will remain intact.</span>
        </div>
        <span>
          {checklistData.totalItemsCount - checklistData.packedItemsCount} items remaining to pack
        </span>
      </div>
    </div>
  );
};
