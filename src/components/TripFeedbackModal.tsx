import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  X,
  Sparkles,
  Heart,
  MessageSquare,
  Award,
  CheckCircle2,
  Calendar,
  Send,
  Gift,
  Zap,
} from 'lucide-react';
import { TripFeedbackData, TripFeedbackSubmission } from '../types/travel';

interface TripFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: TripFeedbackData | null;
  onSubmitFeedback?: (feedback: TripFeedbackSubmission) => void;
}

const RATING_LABELS: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Disappointing', emoji: '😕' },
  2: { label: 'Could Be Better', emoji: '😐' },
  3: { label: 'Good Experience', emoji: '🙂' },
  4: { label: 'Very Impressive', emoji: '😃' },
  5: { label: 'Exceptional & Flawless!', emoji: '🤩' },
};

const POPULAR_FEEDBACK_TAGS = [
  '🎯 Spot-on Vibe Matching',
  '🏡 Pristine Stay & Luxury Villa',
  '⚡ High-Speed Seamless Transit',
  '💰 Great Value & Transparent Fare',
  '🚗 Punctual Verified Chauffeur',
  '🌊 Incredible Hidden Gem Spots',
  '🍱 Superb Dining Recommendations',
  '📱 Effortless Live Companion GPS',
  '✨ Stress-Free Zero Hassle',
  '🛡️ Reliable 24/7 Concierge',
];

export const TripFeedbackModal: React.FC<TripFeedbackModalProps> = ({
  isOpen,
  onClose,
  tripData,
  onSubmitFeedback,
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [aiPlanningRating, setAiPlanningRating] = useState<number>(5);
  const [stayRating, setStayRating] = useState<number>(5);
  const [transitRating, setTransitRating] = useState<number>(5);
  const [activitiesRating, setActivitiesRating] = useState<number>(5);

  const [selectedTags, setSelectedTags] = useState<string[]>([
    '🎯 Spot-on Vibe Matching',
    '🏡 Pristine Stay & Luxury Villa',
  ]);
  const [comments, setComments] = useState<string>('');
  const [favoriteMemory, setFavoriteMemory] = useState<string>('');
  const [recommendationScore, setRecommendationScore] = useState<
    'definitely' | 'likely' | 'neutral' | 'unlikely'
  >('definitely');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen || !tripData) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submission: TripFeedbackSubmission = {
      tripId: tripData.tripId,
      overallRating,
      aiPlanningRating,
      stayRating,
      transitRating,
      activitiesRating,
      selectedTags,
      comments,
      recommendationScore,
      favoriteMemory,
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitFeedback) {
        onSubmitFeedback(submission);
      }
    }, 800);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const activeStarScore = hoverRating !== null ? hoverRating : overallRating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FDFCFB] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden border border-stone-200/90 shadow-2xl flex flex-col my-auto"
        >
          {/* Header */}
          <div className="relative p-5 sm:p-6 bg-gradient-to-br from-[#1C1A18] to-stone-900 text-white border-b border-stone-800 shrink-0">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close feedback"
              aria-label="Close feedback"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 pr-8">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white/20 shrink-0">
                <img
                  src={tripData.coverImage}
                  alt={tripData.destinationName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Journey Completed
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
                  How was your trip to {tripData.destinationName}?
                </h3>
                <p className="text-xs text-stone-400 font-light flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>{tripData.dates}</span>
                  {tripData.companion && <span>• {tripData.companion}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* 1. Overall Star Rating */}
              <div className="text-center bg-[#FAF8F5] p-5 rounded-3xl border border-stone-200/80">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  Overall AI Experience Rating
                </label>

                {/* Stars Row */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= activeStarScore;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setOverallRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-stone-200/60 transition-transform active:scale-90 cursor-pointer"
                        title={`${star} Stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-stone-300 fill-stone-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Rating Label & Dynamic Reaction */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-serif font-bold text-stone-900">
                  <span className="text-base leading-none">
                    {RATING_LABELS[activeStarScore]?.emoji}
                  </span>
                  <span>{RATING_LABELS[activeStarScore]?.label}</span>
                </div>
              </div>

              {/* 2. Sub-Category Dimension Ratings */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                  Category Breakdown
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* AI Planning */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E05A47]" />
                      AI Route & Timing
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAiPlanningRating(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= aiPlanningRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stays & Luxury Villas */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-stone-600" />
                      Stay & Hospitality
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStayRating(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= stayRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transit & Chauffeur */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-stone-600" />
                      Transit & Chauffeur
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTransitRating(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= transitRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated Activities */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-stone-600" />
                      Activities & Excursions
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActivitiesRating(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= activitiesRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Quick Highlight Tags */}
              <div>
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">
                  What stood out most?
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {POPULAR_FEEDBACK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white shadow-2xs scale-98'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/70'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Detailed Text Comments */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                    Share Your Thoughts & Comments
                  </label>
                  <span className="text-[10px] text-stone-400">Helps refine future AI trips</span>
                </div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="What was the highlight of your journey? Did the pacing match your vibe? Any hidden gems you discovered?"
                  rows={3}
                  className="w-full p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 resize-none"
                />
              </div>

              {/* 5. Highlight Memory (Optional) */}
              <div>
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                  One unforgettable moment / favorite memory (Optional)
                </label>
                <input
                  type="text"
                  value={favoriteMemory}
                  onChange={(e) => setFavoriteMemory(e.target.value)}
                  placeholder="e.g. Sunrise view at the mountain villa, Private cave waterfall trek"
                  className="w-full p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              {/* 6. Recommendation Question */}
              <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-stone-700">
                  Would you recommend Wandr AI to friends?
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'definitely', label: 'Definitely ✨' },
                    { id: 'likely', label: 'Likely 👍' },
                    { id: 'neutral', label: 'Neutral' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setRecommendationScore(opt.id as 'definitely' | 'likely' | 'neutral')
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        recommendationScore === opt.id
                          ? 'bg-emerald-800 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-light">
                  <Gift className="w-3.5 h-3.5 text-[#E05A47]" />
                  <span>Unlocks ₹1,000 Travel Credit</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Skip
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all shadow-2xs flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Thank You & Reward Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-10 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-2xl font-serif font-bold text-stone-900 mb-1">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 font-light max-w-sm mx-auto">
                  Your insights help Wandr AI refine future personalized itineraries, route
                  algorithms, and luxury partner curation.
                </p>
              </div>

              {/* Reward Banner */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-4 rounded-2xl border border-amber-200/80 max-w-sm mx-auto text-amber-950">
                <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>₹1,000 Loyalty Credit Added</span>
                </div>
                <p className="text-[11px] text-amber-900/80 font-light">
                  Applied to your next flight, luxury villa, or Vande Bharat booking.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-stone-900 hover:bg-[#E05A47] text-white text-xs font-medium transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
