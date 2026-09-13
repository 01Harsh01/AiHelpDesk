import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";

export const analyticsRouter = Router();

// Dashboard Summary API
analyticsRouter.get("/dashboard", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const user = DataStore.findUserById(userId) || DataStore.findUserById("u-demo-student-001");
  const tasks = DataStore.getTasks(user.id);
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const dueFlashcards = DataStore.getDueFlashcards(user.id).length;
  const weakTopics = DataStore.getWeakTopics();
  const sessions = DataStore.getStudySessions(user.id);

  // Calculate today's study minutes
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMinutes = sessions
    .filter((s) => s.created_at?.startsWith(todayStr))
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 45); // default baseline 45min active

  // Calculate overall quiz accuracy
  const quizzes = DataStore.getQuizzes(user.id);
  let totalAccuracy = 0;
  let gradedCount = 0;
  quizzes.forEach((q) => {
    if (q.last_accuracy !== null && q.last_accuracy !== undefined) {
      totalAccuracy += q.last_accuracy;
      gradedCount++;
    }
  });
  const avgQuizAccuracy = gradedCount > 0 ? Math.round(totalAccuracy / gradedCount) : 80;

  // Continue Learning Items
  const continueItems = [
    {
      id: "cl-1",
      title: "Data Structures & Algorithms",
      type: "Course",
      progress: 72,
      topic: "Binary Search Trees Deletion",
      lastAccessed: "2h ago",
      color: "indigo",
    },
    {
      id: "cl-2",
      title: "Operating Systems",
      type: "Notes & Flashcards",
      progress: 48,
      topic: "Coffman Deadlock Conditions",
      lastAccessed: "Yesterday",
      color: "pink",
    },
    {
      id: "cl-3",
      title: "Database Systems",
      type: "Quiz Deck",
      progress: 64,
      topic: "3NF vs BCNF Decomposition",
      lastAccessed: "2 days ago",
      color: "emerald",
    },
  ];

  // Dynamic AI Recommendation based on weakest topic
  const topWeakTopic = weakTopics[0] || { name: "Binary Search Trees", mastery_percentage: 42 };
  const aiRecommendation = {
    topic: topWeakTopic.name,
    masteryPercentage: topWeakTopic.mastery_percentage,
    headline: `You are struggling with ${topWeakTopic.name} (${topWeakTopic.mastery_percentage}% mastery).`,
    actionText: `Spend 20 minutes revising the core principles and take the recommended adaptive practice quiz.`,
    recommendedSubject: "Operating Systems",
  };

  return res.json({
    user,
    overview: {
      todayStudyMinutes: todayMinutes,
      completedTasks,
      totalTasks: tasks.length,
      quizAccuracy: avgQuizAccuracy,
      currentStreak: user.current_streak,
      xp: user.xp,
      level: user.level,
      dueFlashcards,
      weakTopicsCount: weakTopics.length,
    },
    continueLearning: continueItems,
    todayStudyPlan: tasks,
    aiRecommendation,
    weakTopics: weakTopics.slice(0, 5),
  });
});

// Weak topics list
analyticsRouter.get("/weak-topics", (req: Request, res: Response) => {
  const weakTopics = DataStore.getWeakTopics();
  return res.json(weakTopics);
});

// Log Pomodoro Session
analyticsRouter.post("/pomodoro", (req: Request, res: Response) => {
  const { durationMinutes, subjectName, taskName, userId } = req.body;
  const user_id = userId || "u-demo-student-001";
  const mins = parseInt(durationMinutes) || 25;
  const xp = Math.round(mins * 1.2);

  const session = DataStore.logStudySession({
    user_id,
    subject_name: subjectName || "Focus Study",
    task_name: taskName || "Pomodoro Session",
    duration_minutes: mins,
    mode: "pomodoro",
    xp_awarded: xp,
  });

  const xpResult = DataStore.addXP(user_id, xp);

  return res.status(201).json({ session, xpEarned: xp, newLevel: xpResult?.newLevel });
});

// Notifications
analyticsRouter.get("/notifications", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const notifs = DataStore.getNotifications(userId);
  return res.json(notifs);
});

analyticsRouter.post("/notifications/read", (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || "u-demo-student-001";
  DataStore.markNotificationsRead(userId);
  return res.json({ success: true });
});

// Achievements
analyticsRouter.get("/achievements", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const achievements = DataStore.getAchievements(userId);
  return res.json(achievements);
});

// Global Search
analyticsRouter.get("/search", (req: Request, res: Response) => {
  const query = (req.query.q as string) || "";
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const results = DataStore.searchAll(userId, query);
  return res.json(results);
});
