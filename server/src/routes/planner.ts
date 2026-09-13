import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";
import { AIService } from "../services/aiService.js";

export const plannerRouter = Router();

// Get study tasks
plannerRouter.get("/tasks", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const tasks = DataStore.getTasks(userId);
  return res.json(tasks);
});

// Toggle task completed
plannerRouter.post("/tasks/:id/toggle", (req: Request, res: Response) => {
  const task = DataStore.toggleTask(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (task.is_completed) {
    DataStore.addXP(task.user_id, 20);
  }

  return res.json(task);
});

// Add custom study task
plannerRouter.post("/tasks", (req: Request, res: Response) => {
  const { title, subjectName, durationMinutes, priority, category, userId } = req.body;
  if (!title) return res.status(400).json({ error: "Task title is required" });

  const newTask = DataStore.addTask({
    user_id: userId || "u-demo-student-001",
    title,
    subject_name: subjectName || "General",
    duration_minutes: durationMinutes || 30,
    priority: priority || "medium",
    category: category || "revision",
  });

  return res.status(201).json(newTask);
});

// Generate AI Study Plan based on exam date and available time
plannerRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { examDate, subjects, dailyHours, preparationLevel, userId } = req.body;
    const effectiveSubjects = subjects && subjects.length > 0 ? subjects : ["Operating Systems", "DBMS", "DSA"];
    const dailyMinutes = Math.round((parseFloat(dailyHours) || 2) * 60);

    const plan = await AIService.generateStudyPlan(
      examDate || new Date(Date.now() + 86400000 * 14).toISOString(),
      effectiveSubjects,
      dailyMinutes,
      preparationLevel || "intermediate"
    );

    // Populate newly generated daily tasks for student
    const addedTasks = [];
    if (plan.schedule && plan.schedule.length > 0) {
      for (const day of plan.schedule.slice(0, 3)) {
        for (const t of day.tasks) {
          const created = DataStore.addTask({
            user_id: userId || "u-demo-student-001",
            title: t.title,
            subject_name: t.subject,
            duration_minutes: t.duration,
            scheduled_date: day.date,
            priority: t.priority,
            category: t.type,
          });
          addedTasks.push(created);
        }
      }
    }

    return res.json({ plan, addedTasks });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to generate study plan" });
  }
});

// Reschedule overdue tasks
plannerRouter.post("/reschedule", (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || "u-demo-student-001";
  const tasks = DataStore.getTasks(userId);
  const today = new Date().toISOString().split("T")[0];

  let rescheduledCount = 0;
  tasks.forEach((t) => {
    if (!t.is_completed && t.scheduled_date < today) {
      t.scheduled_date = today;
      rescheduledCount++;
    }
  });

  DataStore.persist();
  return res.json({ success: true, rescheduledCount, tasks });
});
