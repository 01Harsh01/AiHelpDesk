import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Check,
  RotateCw,
  Plus,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";
import { StudyTask } from "../types";
import { useAuth } from "../context/AuthContext";
import { useStudy } from "../context/StudyContext";

export const PlannerPage: React.FC = () => {
  const { addXPToUser } = useAuth();
  const { triggerCelebration } = useStudy();

  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [dailyHours, setDailyHours] = useState("2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // New task modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Operating Systems");
  const [newDuration, setNewDuration] = useState(30);
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const list = await api.getTasks();
      setTasks(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
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

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateStudyPlan({
        examDate,
        subjects: ["Operating Systems", "Data Structures", "DBMS"],
        dailyHours: parseFloat(dailyHours) || 2,
      });
      if (res.addedTasks) {
        setTasks((prev) => [...res.addedTasks, ...prev]);
      }
      triggerCelebration();
      alert("AI Study Plan synthesized and mapped to your daily schedule!");
    } catch (e) {
      alert("Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReschedule = async () => {
    setIsRescheduling(true);
    try {
      const res = await api.rescheduleTasks();
      setTasks(res.tasks);
      alert(`Rescheduled ${res.rescheduledCount} overdue tasks to today!`);
    } catch (e) {}
    setIsRescheduling(false);
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const created = await api.addTask({
        title: newTitle,
        subject_name: newSubject,
        duration_minutes: newDuration,
        priority: newPriority,
        category: "practice",
      });
      setTasks((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle("");
    } catch (e) {}
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.scheduled_date === today);
  const upcomingTasks = tasks.filter((t) => t.scheduled_date > today);
  const overdueTasks = tasks.filter((t) => t.scheduled_date < today && !t.is_completed);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Study Planner & Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic calendar mapping based on your exam deadlines and daily hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {overdueTasks.length > 0 && (
            <button
              onClick={handleReschedule}
              disabled={isRescheduling}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRescheduling ? "animate-spin" : ""}`} />
              <span>Reschedule {overdueTasks.length} Missed</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>

      {/* AI Plan Generator Widget */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Exam Sprint Generator
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Upcoming Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Study Hours</label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="1">1 Hour / Day</option>
              <option value="2">2 Hours / Day</option>
              <option value="3">3 Hours / Day</option>
              <option value="4">4+ Hours (Sprint)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Computing Optimal Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Personalized Timetable</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Task Columns: Today / Upcoming / Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Agenda */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Today's Agenda
            </h3>
            <span className="text-xs text-slate-400 font-mono">{todayTasks.length} tasks</span>
          </div>

          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  task.is_completed
                    ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400 line-through"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-500"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-indigo-500 font-bold mb-1">
                  <span>{task.subject_name}</span>
                  <span className="text-slate-400 font-mono">{task.duration_minutes}m</span>
                </div>
                <div className="text-xs font-bold">{task.title}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                  <span className="text-slate-400 capitalize">{task.category}</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${task.priority === "high" ? "text-rose-500" : "text-blue-500"}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Upcoming Days
            </h3>
            <span className="text-xs text-slate-400 font-mono">{upcomingTasks.length} tasks</span>
          </div>

          <div className="space-y-2.5">
            {upcomingTasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                Click "Generate Personalized Timetable" to plan upcoming days.
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold mb-1">
                    <span>{task.subject_name}</span>
                    <span className="text-slate-400 font-mono">{task.scheduled_date}</span>
                  </div>
                  <div className="text-xs font-bold">{task.title}</div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Duration: {task.duration_minutes} min • Priority: {task.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue / Reschedule Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Overdue Review
            </h3>
            <span className="text-xs text-slate-400 font-mono">{overdueTasks.length} tasks</span>
          </div>

          <div className="space-y-2.5">
            {overdueTasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center text-xs text-emerald-500 font-semibold">
                No overdue tasks! You are completely on track. 🎉
              </div>
            ) : (
              overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-500 font-bold mb-1">
                    <span>{task.subject_name}</span>
                    <span className="font-mono">Missed</span>
                  </div>
                  <div className="text-xs font-bold">{task.title}</div>
                  <div className="mt-2 text-right">
                    <button
                      onClick={handleReschedule}
                      className="text-[11px] font-bold text-indigo-500 hover:underline"
                    >
                      Shift to Today →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">Add Study Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Solve 3 Binary Tree questions"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (min)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
