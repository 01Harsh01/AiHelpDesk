import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Layers,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import { Flashcard, Topic } from "../types";
import { useStudy } from "../context/StudyContext";
import { useAuth } from "../context/AuthContext";

interface RevisionPageProps {
  onNavigate: (page: string) => void;
}

export const RevisionPage: React.FC<RevisionPageProps> = ({ onNavigate }) => {
  const { addXPToUser } = useAuth();
  const { triggerCelebration } = useStudy();

  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [weakTopics, setWeakTopics] = useState<Topic[]>([]);
  const [activeReviewCard, setActiveReviewCard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDue = async () => {
      try {
        const [cards, topics] = await Promise.all([
          api.getDueCards(),
          api.getWeakTopics(),
        ]);
        setDueCards(cards);
        setWeakTopics(topics);
        if (cards.length > 0) setActiveReviewCard(cards[0]);
      } catch (e) {}
      setLoading(false);
    };
    fetchDue();
  }, []);

  const handleRate = async (rating: "again" | "hard" | "good" | "easy") => {
    if (!activeReviewCard) return;

    try {
      const res = await api.reviewCard(activeReviewCard.id, rating);
      if (res.xpEarned) {
        addXPToUser(res.xpEarned);
      }

      // Remove from due list
      const remaining = dueCards.filter((c) => c.id !== activeReviewCard.id);
      setDueCards(remaining);
      setIsFlipped(false);

      if (remaining.length > 0) {
        setActiveReviewCard(remaining[0]);
      } else {
        setActiveReviewCard(null);
        triggerCelebration();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <RotateCcw className="w-3.5 h-3.5" />
            Spaced Repetition & Weakness Focus
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Revision Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review knowledge items right before memory decay sets in.
          </p>
        </div>

        <button
          onClick={() => onNavigate("quiz")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Launch Adaptive Practice</span>
        </button>
      </div>

      {/* Due Today Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {dueCards.length}
            </div>
            <div className="text-xs text-slate-400 font-semibold">Flashcards Due Today</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {weakTopics.length}
            </div>
            <div className="text-xs text-slate-400 font-semibold">Weak Topics Identified</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">1</div>
            <div className="text-xs text-slate-400 font-semibold">Diagnostic Quiz Due</div>
          </div>
        </div>
      </div>

      {/* Active Spaced Repetition Review Queue */}
      {activeReviewCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>
              Reviewing Due Flashcard ({dueCards.length} left in queue)
            </span>
            <span className="text-indigo-500 font-mono font-bold">SM-2 Active</span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-72 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 p-8 shadow-xl flex flex-col justify-between cursor-pointer select-none transition-all hover:border-indigo-500/60"
          >
            <div className="flex justify-between text-xs text-indigo-500 font-bold uppercase tracking-wider">
              <span>Topic: {activeReviewCard.topic}</span>
              <span>{isFlipped ? "Answer Side" : "Prompt Side (Click to Flip)"}</span>
            </div>

            <div className="text-center px-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? activeReviewCard.back_text : activeReviewCard.front_text}
              </h3>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isFlipped ? "Rate below to set next review interval" : "Click to check answer"}
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRate("again")}
                className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs border border-rose-500/30"
              >
                Again (&lt;1d)
              </button>
              <button
                onClick={() => handleRate("hard")}
                className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs border border-amber-500/30"
              >
                Hard (2d)
              </button>
              <button
                onClick={() => handleRate("good")}
                className="py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-bold text-xs border border-blue-500/30"
              >
                Good (4d)
              </button>
              <button
                onClick={() => handleRate("easy")}
                className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold text-xs border border-emerald-500/30"
              >
                Easy (7d)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            All Due Items Reviewed!
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You have no pending spaced repetition flashcards for today. Check out weak topics below or take an adaptive practice quiz.
          </p>
        </div>
      )}

      {/* Weak Topics Queue */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Targeted Revision Needed
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {weakTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{topic.name}</div>
                <div className="text-[11px] text-rose-500 font-semibold mt-0.5">
                  {topic.mastery_percentage}% Accuracy
                </div>
              </div>

              <button
                onClick={() => onNavigate("quiz")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <span>Drill</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
