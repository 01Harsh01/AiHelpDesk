import React, { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export const PomodoroModal: React.FC = () => {
  const { isPomodoroOpen, closePomodoro, triggerCelebration } = useStudy();
  const { addXPToUser } = useAuth();

  const [mode, setMode] = useState<"standard" | "deep" | "shortBreak">("standard");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("Operating Systems");
  const [taskName, setTaskName] = useState("Deep Focus Revision");
  const [completedSessions, setCompletedSessions] = useState(0);

  const initialTime =
    mode === "standard" ? 25 * 60 : mode === "deep" ? 50 * 60 : 5 * 60;

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    setCompletedSessions((prev) => prev + 1);
    triggerCelebration();

    const durationMinutes = mode === "standard" ? 25 : mode === "deep" ? 50 : 5;
    if (mode !== "shortBreak") {
      try {
        const res = await api.logPomodoro({
          durationMinutes,
          subjectName: selectedSubject,
          taskName: taskName,
        });
        if (res.xpEarned) {
          addXPToUser(res.xpEarned);
        }
      } catch (e) {}
    }

    // Switch to break or work
    if (mode !== "shortBreak") {
      setMode("shortBreak");
    } else {
      setMode("standard");
    }
  };

  if (!isPomodoroOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative overflow-hidden text-white">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Pomodoro Focus Zone
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={closePomodoro}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-5 p-1 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode("standard")}
            className={`py-2 rounded-xl transition-all ${
              mode === "standard" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            25 / 5 Min
          </button>
          <button
            onClick={() => setMode("deep")}
            className={`py-2 rounded-xl transition-all ${
              mode === "deep" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            50 / 10 Min
          </button>
          <button
            onClick={() => setMode("shortBreak")}
            className={`py-2 rounded-xl transition-all ${
              mode === "shortBreak" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            5 Min Break
          </button>
        </div>

        {/* Timer Circle Display */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="95"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="95"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={596}
                strokeDashoffset={596 - (596 * progress) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  mode === "standard"
                    ? "text-rose-500"
                    : mode === "deep"
                    ? "text-indigo-500"
                    : "text-emerald-500"
                }`}
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-5xl font-black tracking-tight">{formattedTime}</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                {mode === "shortBreak" ? "Rest & Recharge" : "Focus Session"}
              </span>
            </div>
          </div>
        </div>

        {/* Subject & Task Config */}
        {mode !== "shortBreak" && (
          <div className="space-y-2 mb-6 text-xs">
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="What task are you working on?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setTimeLeft(initialTime);
              setIsRunning(false);
            }}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2.5 transition-all transform active:scale-95 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={handleSessionComplete}
            className="p-3 rounded-2xl bg-slate-800 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Complete Early (+XP)"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* XP Status Callout */}
        <div className="mt-5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Completing this session awards <strong className="text-amber-400">+{mode === "deep" ? 60 : 30} XP</strong> & records to study analytics!
          </span>
        </div>
      </div>
    </div>
  );
};
