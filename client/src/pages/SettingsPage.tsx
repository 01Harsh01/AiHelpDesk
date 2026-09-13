import React, { useState } from "react";
import {
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  Volume2,
  Sparkles,
  Shield,
  Save,
  LogOut,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || "Alex Rivera");
  const [educationLevel, setEducationLevel] = useState(user?.education_level || "College / University");
  const [courseBranch, setCourseBranch] = useState(user?.course_branch || "Computer Science & Engineering");
  const [yearSemester, setYearSemester] = useState(user?.year_semester || "3rd Year / 6th Semester");
  const [aiModel, setAiModel] = useState("gemini-1.5-pro");
  const [dailyTarget, setDailyTarget] = useState("90");
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        name,
        education_level: educationLevel,
        course_branch: courseBranch,
        year_semester: yearSemester,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize your academic profile, AI parameters, and dashboard preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Student Profile
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
              <div className="text-[11px] text-purple-400 font-semibold mt-1">
                Level {user?.level || 1} • {user?.xp || 0} XP
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Education Level
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Major / Degree
              </label>
              <input
                type="text"
                value={courseBranch}
                onChange={(e) => setCourseBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Year / Semester
              </label>
              <input
                type="text"
                value={yearSemester}
                onChange={(e) => setYearSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              AI Engine Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Preferred AI Provider
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              >
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Recommended)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="builtin-heuristic">Local Built-in Semantic Heuristic (Zero Cost)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Daily Study Goal (Minutes)
              </label>
              <input
                type="number"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Sound */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Preferences & Theme
            </h2>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</div>
              <div className="text-[11px] text-slate-400">Current: {theme.toUpperCase()} mode</div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              <span>Toggle to {theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Sound Effects & Pomodoro Chimes</div>
              <div className="text-[11px] text-slate-400">Play celebratory audio cues upon quiz completion</div>
            </div>
            <input
              type="checkbox"
              checked={sounds}
              onChange={(e) => setSounds(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>
        </div>

        {/* Save & Logout Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              logout();
              onNavigate("landing");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
