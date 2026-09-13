import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Flame,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { api } from "../services/api";
import { Topic, AchievementItem } from "../types";
import { useAuth } from "../context/AuthContext";

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [weakTopics, setWeakTopics] = useState<Topic[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topics, achs] = await Promise.all([
          api.getWeakTopics(),
          api.getAchievements(),
        ]);
        setWeakTopics(topics);
        setAchievements(achs);
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const weeklyStudyHours = [
    { day: "Mon", minutes: 65 },
    { day: "Tue", minutes: 90 },
    { day: "Wed", minutes: 45 },
    { day: "Thu", minutes: 80 },
    { day: "Fri", minutes: 55 },
    { day: "Sat", minutes: 110 },
    { day: "Sun", minutes: 75 },
  ];

  const maxMin = Math.max(...weeklyStudyHours.map((d) => d.minutes));

  const subjectsPerformance = [
    { name: "Data Structures & Algorithms", accuracy: 82, color: "bg-indigo-500" },
    { name: "Database Management Systems", accuracy: 76, color: "bg-emerald-500" },
    { name: "Computer Networks", accuracy: 68, color: "bg-amber-500" },
    { name: "Operating Systems", accuracy: 61, color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learning Progress & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed breakdown of your study hours, subject mastery, weak topics, and RPG badges.
        </p>
      </div>

      {/* Top Gamification & Level Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-black text-2xl text-white">
            Lvl {user?.level || 3}
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              RPG Student Status
            </div>
            <div className="text-xl font-extrabold text-white mt-0.5">
              Scholar • Level {user?.level || 3}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {user?.xp || 640} Total XP Earned across 24 focus sessions and quizzes
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-xs text-amber-400 font-bold flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-current" /> Streak
            </div>
            <div className="text-lg font-black text-white">{user?.current_streak || 7} Days</div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Avg Accuracy
            </div>
            <div className="text-lg font-black text-white">80%</div>
          </div>
        </div>
      </div>

      {/* Charts Grid: Study Time & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Time Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Weekly Study Time Distribution
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Minutes spent in focused learning per day</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              8.6 Hours This Week
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyStudyHours.map((item, idx) => {
              const heightPercent = Math.round((item.minutes / maxMin) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-slate-400 font-mono">{item.minutes}m</span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-500 hover:brightness-110 cursor-pointer"
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.day}: ${item.minutes} mins`}
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Subject Performance Mastery
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Aggregated from quizzes & flashcard reviews</p>

          <div className="space-y-4 pt-2">
            {subjectsPerformance.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{sub.name}</span>
                  <span className="text-slate-900 dark:text-white font-mono font-bold">
                    {sub.accuracy}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all duration-700`}
                    style={{ width: `${sub.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Weak Topics Alert & Revision Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detected Weak Topics (Requires Revision)
              </h3>
              <p className="text-[11px] text-slate-400">
                Topics where your quiz accuracy or flashcard recall fell below 65%.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("revision")}
            className="text-xs text-indigo-500 font-bold hover:underline"
          >
            Open Revision Center →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {weakTopics.map((topic) => {
            const isCritical = topic.mastery_percentage < 50;
            return (
              <div
                key={topic.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                    <span className={isCritical ? "text-rose-500" : "text-amber-500"}>
                      {isCritical ? "🔴 Critical Gap" : "🟡 Needs Practice"}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {topic.mastery_percentage}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {topic.name}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("revision")}
                  className="w-full mt-4 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-500 dark:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <span>Start Revision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Achievements Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Milestone Badges & Achievements
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                ach.unlocked
                  ? "bg-amber-500/5 border-amber-500/30 text-slate-900 dark:text-white shadow-sm"
                  : "bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/60 opacity-40 grayscale"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold">{ach.title}</div>
              <div className="text-[10px] text-slate-400 mt-1 leading-tight">{ach.description}</div>
              {ach.unlocked && (
                <span className="inline-block text-[9px] text-emerald-500 font-bold uppercase mt-2">
                  Unlocked ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
