import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  Flame,
  Zap,
  ArrowRight,
  Plus,
  FileText,
  Layers,
  Sparkles,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStudy } from "../context/StudyContext";
import { api } from "../services/api";
import { DashboardOverview, StudyTask } from "../types";

interface DashboardPageProps {
  onNavigate: (page: string, targetId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, addXPToUser } = useAuth();
  const { openPomodoro, triggerCelebration } = useStudy();

  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api.getDashboard();
        setDashboardData(data);
        setTasks(data.todayStudyPlan || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleTaskToggle = async (taskId: string) => {
    try {
      const updated = await api.toggleTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: updated.is_completed } : t))
      );
      if (updated.is_completed) {
        addXPToUser(20);
        triggerCelebration();
      }
    } catch (e) {}
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Student"} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's continue your learning journey. You're on a roll!
          </p>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openPomodoro}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/15 to-orange-500/15 hover:from-rose-500/25 hover:to-orange-500/25 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Pomodoro Focus</span>
          </button>
          <button
            onClick={() => onNavigate("library")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Material</span>
          </button>
        </div>
      </div>

      {/* Today's Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Study Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Study Time</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {dashboardData?.overview?.todayStudyMinutes || 45}m
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target: 90m / day</div>
        </div>

        {/* Tasks Completed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasks Done</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedCount} / {tasks.length}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">
            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}% completed
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Quiz Accuracy</span>
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {dashboardData?.overview?.quizAccuracy || 80}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Last 5 quizzes</div>
        </div>

        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Study Streak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-500">
            {dashboardData?.overview?.currentStreak || 7} Days
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Keep it alive today!</div>
        </div>

        {/* XP Earned */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-indigo-400">Total XP</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {user?.xp || dashboardData?.overview?.xp || 640}
          </div>
          <div className="text-[11px] text-purple-400 font-semibold mt-1">
            Level {user?.level || 3} • Scholar
          </div>
        </div>
      </div>

      {/* Dynamic AI Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Dynamic AI Recommendation
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {dashboardData?.aiRecommendation?.headline ||
                "You are struggling with Binary Search Trees (42% mastery)."}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dashboardData?.aiRecommendation?.actionText ||
                "Spend 20 minutes revising BST deletion and complete the recommended quiz."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("revision")}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <span>Start Revision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("quiz")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
            >
              Take Practice Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Upload Material", icon: Plus, page: "library", color: "text-indigo-500" },
            { label: "Generate Notes", icon: FileText, page: "notes", color: "text-emerald-500" },
            { label: "Smart Flashcards", icon: Layers, page: "flashcards", color: "text-amber-500" },
            { label: "Generate Quiz", icon: HelpCircle, page: "quiz", color: "text-pink-500" },
            { label: "Ask Documents", icon: Sparkles, page: "docchat", color: "text-purple-500" },
            { label: "Study Plan", icon: Calendar, page: "planner", color: "text-blue-500" },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(action.page)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group text-center"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform ${action.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Continue Learning & Today's Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Continue Learning Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Continue Learning</h2>
            <button
              onClick={() => onNavigate("library")}
              className="text-xs text-indigo-500 hover:underline font-semibold"
            >
              View all materials
            </button>
          </div>

          <div className="space-y-3">
            {(dashboardData?.continueLearning || []).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate("notes")}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 cursor-pointer shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-indigo-500 font-semibold">{item.type}</div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Current Topic: {item.topic}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.progress}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.lastAccessed}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Study Plan Tasks */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Study Plan</h2>
            <button
              onClick={() => onNavigate("planner")}
              className="text-xs text-indigo-500 hover:underline font-semibold"
            >
              Manage Plan
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All daily study tasks completed! 🎉
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskToggle(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.is_completed
                      ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400 line-through"
                      : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        task.is_completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-400 dark:border-slate-600"
                      }`}
                    >
                      {task.is_completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{task.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {task.subject_name} • {task.duration_minutes} min
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === "high"
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}

            <button
              onClick={() => onNavigate("planner")}
              className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Full Study Timetable</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
