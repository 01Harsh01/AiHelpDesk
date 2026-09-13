import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  FileText,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { NotificationItem } from "../../types";

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { openSearch, openPomodoro } = useStudy();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const list = await api.getNotifications();
        setNotifications(list);
      } catch (e) {}
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {}
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar Trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={openSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs transition-all shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search docs, notes, flashcards, quizzes...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-300">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickOpen(!isQuickOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {isQuickOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setIsQuickOpen(false)}
            >
              <button
                onClick={() => onNavigate("library")}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
              >
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Upload Study Material</span>
              </button>
              <button
                onClick={() => onNavigate("notes")}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Generate Notes</span>
              </button>
              <button
                onClick={() => onNavigate("flashcards")}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Create Flashcard Deck</span>
              </button>
              <button
                onClick={() => onNavigate("quiz")}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
              >
                <HelpCircle className="w-4 h-4 text-pink-500" />
                <span>Generate AI Quiz</span>
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
              <button
                onClick={openPomodoro}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10 font-semibold"
              >
                <Clock className="w-4 h-4" />
                <span>Start Focus Timer</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`py-2.5 px-2 rounded-lg text-xs transition-colors ${
                        !n.read ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                        {n.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
        </button>

        {/* Profile Avatar */}
        {user && (
          <button
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={
                user.avatar_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          </button>
        )}
      </div>
    </header>
  );
};
