import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";
import { AIService } from "../services/aiService.js";

export const quizRouter = Router();

// List quizzes
quizRouter.get("/", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const quizzes = DataStore.getQuizzes(userId);
  return res.json(quizzes);
});

// Get quiz with questions
quizRouter.get("/:id", (req: Request, res: Response) => {
  const quiz = DataStore.getQuizWithQuestions(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  return res.json(quiz);
});

// Generate quiz (standard or adaptive)
quizRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const {
      documentId,
      rawText,
      subjectName,
      topic,
      difficulty,
      questionCount,
      questionType,
      isAdaptive,
      userId,
    } = req.body;

    let textToAnalyze = rawText || "";
    if (documentId) {
      const doc = DataStore.getDocumentById(documentId);
      if (doc) textToAnalyze = doc.extracted_text;
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      // Default fallback subject text if user directly clicked quick quiz
      textToAnalyze = `Core concepts of ${subjectName || "Computer Science"} and ${topic || "Fundamentals"}. Covers invariants, algorithms, performance, trade-offs, and critical exam scenarios.`;
    }

    const effectiveSubject = subjectName || "Computer Science";
    const effectiveTopic = topic || "Key Concepts";
    const count = parseInt(questionCount) || 5;
    const diff = difficulty || "medium";
    const qType = questionType || "mcq";

    // If adaptive, find user's current weak topics to weigh questions
    let weakTopicsList: string[] = [];
    if (isAdaptive) {
      weakTopicsList = DataStore.getWeakTopics().map((t) => t.name);
    }

    const aiQuestions = await AIService.generateQuiz(
      textToAnalyze,
      count,
      diff,
      qType,
      effectiveTopic,
      weakTopicsList
    );

    const { quiz, questions } = DataStore.createQuiz(
      {
        user_id: userId || "u-demo-student-001",
        subject_name: effectiveSubject,
        topic: effectiveTopic,
        title: isAdaptive ? `Adaptive Practice: ${effectiveTopic}` : `${effectiveSubject}: ${effectiveTopic} Quiz`,
        difficulty: diff,
        is_adaptive: !!isAdaptive,
        time_limit_minutes: Math.max(5, count * 2),
      },
      aiQuestions
    );

    return res.status(201).json({ quiz, questions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to generate quiz" });
  }
});

// Submit quiz attempt
quizRouter.post("/:id/submit", (req: Request, res: Response) => {
  try {
    const { answers, timeSpentSeconds, userId } = req.body;
    const quiz = DataStore.getQuizWithQuestions(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    const totalQuestions = quiz.questions.length;
    const gradedAnswers: any[] = [];
    const weakTopicsIdentified: string[] = [];

    quiz.questions.forEach((q: any) => {
      const studentAns = answers ? answers[q.id] : null;
      const isCorrect =
        studentAns &&
        studentAns.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

      if (isCorrect) {
        score++;
      } else {
        if (q.topic && !weakTopicsIdentified.includes(q.topic)) {
          weakTopicsIdentified.push(q.topic);
        }
      }

      gradedAnswers.push({
        questionId: q.id,
        questionText: q.question_text,
        userAnswer: studentAns || "Not answered",
        correctAnswer: q.correct_answer,
        isCorrect: !!isCorrect,
        explanation: q.explanation,
        topic: q.topic,
      });
    });

    const accuracyPercentage = Math.round((score / Math.max(1, totalQuestions)) * 100);

    // Save attempt and update topic mastery
    const attempt = DataStore.recordQuizAttempt({
      quiz_id: quiz.id,
      user_id: userId || "u-demo-student-001",
      score,
      total_questions: totalQuestions,
      accuracy_percentage: accuracyPercentage,
      time_spent_seconds: timeSpentSeconds || 180,
      answers: gradedAnswers,
      weak_topics_identified: weakTopicsIdentified,
    });

    // Reward XP
    const xpReward = score * 15 + (accuracyPercentage === 100 ? 50 : 10);
    const xpResult = DataStore.addXP(userId || "u-demo-student-001", xpReward);

    return res.json({
      attempt,
      score,
      totalQuestions,
      accuracyPercentage,
      timeSpentSeconds: timeSpentSeconds || 180,
      gradedAnswers,
      weakTopicsIdentified,
      xpEarned: xpReward,
      newLevel: xpResult?.newLevel,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to submit quiz" });
  }
});
