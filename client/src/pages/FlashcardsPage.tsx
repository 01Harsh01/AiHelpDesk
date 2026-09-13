import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Bookmark,
  RotateCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import { FlashcardDeck, Flashcard, DocumentItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { useStudy } from "../context/StudyContext";

export const FlashcardsPage: React.FC = () => {
  const { addXPToUser } = useAuth();
  const { triggerCelebration } = useStudy();

  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Deck generation modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [subjectName, setSubjectName] = useState("Operating Systems");
  const [topic, setTopic] = useState("Deadlocks & Synchronization");
  const [cardCount, setCardCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const [fetchedDecks, fetchedDocs] = await Promise.all([
        api.getDecks(),
        api.getDocuments(),
      ]);
      setDecks(fetchedDecks);
      setDocuments(fetchedDocs);
      if (fetchedDocs.length > 0) setSelectedDocId(fetchedDocs[0].id);

      if (fetchedDecks.length > 0) {
        setSelectedDeckId(fetchedDecks[0].id);
        const fetchedCards = await api.getDeckCards(fetchedDecks[0].id);
        setCards(fetchedCards);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDeck = async (deckId: string) => {
    setSelectedDeckId(deckId);
    setCurrentIndex(0);
    setIsFlipped(false);
    try {
      const deckCards = await api.getDeckCards(deckId);
      setCards(deckCards);
    } catch (e) {}
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const handleReviewRating = async (rating: "again" | "hard" | "good" | "easy") => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      const res = await api.reviewCard(currentCard.id, rating);
      if (res.xpEarned) {
        addXPToUser(res.xpEarned);
      }

      // If user hit Easy or Good on last card, celebrate!
      if (currentIndex === cards.length - 1 && (rating === "easy" || rating === "good")) {
        triggerCelebration();
      }

      // Advance to next card
      if (currentIndex < cards.length - 1) {
        handleNext();
      } else {
        alert("Deck review completed! Great job maintaining your spaced repetition schedule.");
      }
    } catch (e) {}
  };

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateFlashcards({
        documentId: selectedDocId,
        subjectName,
        topic,
        count: cardCount,
        difficulty,
      });

      setDecks((prev) => [res.deck, ...prev]);
      setSelectedDeckId(res.deck.id);
      setCards(res.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowGenModal(false);
      triggerCelebration();
      addXPToUser(35);
    } catch (err) {
      alert("Failed to generate deck");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Flashcards & Spaced Repetition
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SuperMemo SM-2 algorithm schedules cards right when you're about to forget them.
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate Deck with AI</span>
        </button>
      </div>

      {/* Decks Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => handleSelectDeck(deck.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
              selectedDeckId === deck.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <span>{deck.title}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
              {deck.card_count || 0}
            </span>
          </button>
        ))}
      </div>

      {/* 3D Flashcard Stage */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Deck Progress Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span className="font-mono text-indigo-500 font-bold">
              {Math.round(((currentIndex + 1) / cards.length) * 100)}%
            </span>
          </div>

          {/* 3D Flip Card Element */}
          <div
            className="w-full h-80 perspective-1000 cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-3xl shadow-2xl ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/20 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-indigo-500 font-bold uppercase tracking-wider">
                  <span>Topic: {currentCard.topic || "Core Concept"}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                    Front • Click to flip
                  </span>
                </div>

                <div className="text-center px-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentCard.front_text}
                  </h3>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Click anywhere to reveal the explanation
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/40 text-white flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  <span>Answer & Explanation</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    Back
                  </span>
                </div>

                <div className="text-center px-4 overflow-y-auto max-h-48">
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                    {currentCard.back_text}
                  </p>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Rate your recall difficulty below to schedule the next review
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Prev / Next / Shuffle */}
          <div className="flex items-center justify-between px-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* SuperMemo SM-2 Spaced Repetition Rating Buttons */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              Spaced Repetition Rating (SM-2 Engine)
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleReviewRating("again")}
                className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition-all text-center"
              >
                <div className="font-extrabold">Again</div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">&lt; 1 day</div>
              </button>

              <button
                onClick={() => handleReviewRating("hard")}
                className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all text-center"
              >
                <div className="font-extrabold">Hard</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">2 days</div>
              </button>

              <button
                onClick={() => handleReviewRating("good")}
                className="py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 text-xs font-bold transition-all text-center"
              >
                <div className="font-extrabold">Good</div>
                <div className="text-[10px] text-blue-400 font-mono mt-0.5">4 days</div>
              </button>

              <button
                onClick={() => handleReviewRating("easy")}
                className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold transition-all text-center"
              >
                <div className="font-extrabold">Easy</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">7 days</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          No flashcards in this deck. Click "Generate Deck with AI" to generate cards.
        </div>
      )}

      {/* Deck Generator Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">Create Flashcards Deck</h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                From Document
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic Focus</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Card Count
                </label>
                <select
                  value={cardCount}
                  onChange={(e) => setCardCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 Cards</option>
                  <option value={10}>10 Cards</option>
                  <option value={15}>15 Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Terms...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Create Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
