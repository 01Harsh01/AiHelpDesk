import React from "react";
import {
  LayoutDashboard,
  FileText,
  Layers,
  HelpCircle,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Code2,
  Calendar,
  FolderOpen,
  BarChart3,
  Settings,
  Flame,
  Clock,
  LogOut,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { openPomodoro } = useStudy();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "notes", label: "AI Notes", icon: FileText },
    { id: "flashcards", label: "Smart Flashcards", icon: Layers },
    { id: "quiz", label: "AI Quizzes", icon: HelpCircle },
    { id: "docchat", label: "Ask Document", icon: MessageSquareText, badge: "RAG" },
    { id: "revision", label: "Revision Center", icon: RotateCcw, badge: "Due" },
    { id: "tutor", label: "AI Tutor", icon: Sparkles },
    { id: "codetutor", label: "Code Tutor", icon: Code2 },
    { id: "planner", label: "Study Planner", icon: Calendar },
    { id: "library", label: "Study Library", icon: FolderOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const levelNames = ["Beginner", "Learner", "Scholar", "Expert", "Master"];
  const currentLevelName = levelNames[(user?.level || 1) - 1] || "Scholar";
  const xpCurrent = user?.xp || 0;
  const xpNext = (user?.level || 1) * 250;
  const xpProgress = Math.min(100, Math.round((xpCurrent % 250) / 2.5));

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col justify-between bg-slate-900/95 dark:bg-[#0f111a]/95 text-slate-200 border-r border-slate-800 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate("dashboard")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              EduMind AI
            </div>
            <div className="text-xs text-indigo-400/90 font-medium">Smart Study Platform</div>
          </div>
        </div>

        {/* User Card & XP Status */}
        {user && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 dark:bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={
                    user.avatar_url ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 object-cover"
                />
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-white truncate max-w-[90px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-purple-400 font-medium">
                    Lvl {user.level || 1} • {currentLevelName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{user.current_streak || 1}d</span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                <span>{xpCurrent} XP</span>
                <span>{xpNext} XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions: Pomodoro & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={openPomodoro}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 text-xs font-semibold transition-all group"
        >
          <Clock className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
          <span>Start Pomodoro Timer</span>
        </button>

        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}
      </div>
    </aside>
  );
};
