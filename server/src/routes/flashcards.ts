import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";
import { AIService } from "../services/aiService.js";
import { SpacedRepetitionRating } from "../services/spacedRepetition.js";

export const flashcardsRouter = Router();

// List decks for user
flashcardsRouter.get("/decks", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const decks = DataStore.getDecks(userId);
  return res.json(decks);
});

// Get cards for a specific deck
flashcardsRouter.get("/decks/:id/cards", (req: Request, res: Response) => {
  const cards = DataStore.getDeckCards(req.params.id);
  return res.json(cards);
});

// Get flashcards due for revision today
flashcardsRouter.get("/due", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const dueCards = DataStore.getDueFlashcards(userId);
  return res.json(dueCards);
});

// Generate new flashcard deck using AI
flashcardsRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { documentId, rawText, subjectName, topic, count, difficulty, userId } = req.body;

    let textToAnalyze = rawText || "";
    if (documentId) {
      const doc = DataStore.getDocumentById(documentId);
      if (doc) textToAnalyze = doc.extracted_text;
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return res.status(400).json({ error: "No study text provided to generate flashcards." });
    }

    const effectiveSubject = subjectName || "General Topic";
    const effectiveTopic = topic || "Key Principles";
    const numCards = parseInt(count) || 6;
    const diff = difficulty || "medium";

    const aiCards = await AIService.generateFlashcards(textToAnalyze, numCards, diff, effectiveTopic);

    const { deck, cards } = DataStore.createDeckWithCards(
      {
        user_id: userId || "u-demo-student-001",
        subject_name: effectiveSubject,
        title: `${effectiveSubject}: ${effectiveTopic} Deck`,
        description: `AI generated flashcard deck covering ${effectiveTopic}.`,
      },
      aiCards
    );

    // Reward XP
    DataStore.addXP(userId || "u-demo-student-001", 35);

    return res.status(201).json({ deck, cards });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to generate flashcards" });
  }
});

// Review flashcard rating with SM-2 spaced repetition
flashcardsRouter.post("/review/:cardId", (req: Request, res: Response) => {
  try {
    const { rating, userId } = req.body as { rating: SpacedRepetitionRating; userId?: string };
    if (!["again", "hard", "good", "easy"].includes(rating)) {
      return res.status(400).json({ error: "Invalid rating. Must be again, hard, good, or easy." });
    }

    const updatedCard = DataStore.reviewFlashcard(req.params.cardId, rating);
    if (!updatedCard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    // Award XP for revision
    const xpReward = rating === "easy" ? 15 : rating === "good" ? 10 : 5;
    const xpResult = DataStore.addXP(userId || "u-demo-student-001", xpReward);

    return res.json({ card: updatedCard, xpEarned: xpReward, newLevel: xpResult?.newLevel });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to review flashcard" });
  }
});
