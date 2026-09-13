import React, { useState } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Award,
  Briefcase,
  Lightbulb,
  RotateCw,
} from "lucide-react";
import { api } from "../services/api";

export const TutorPage: React.FC = () => {
  const [mode, setMode] = useState<"learn" | "practice" | "exam" | "interview" | "doubt">("learn");
  const [subject, setSubject] = useState("Operating Systems");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; suggestions?: string[] }>
  >([
    {
      sender: "ai",
      text: "👋 Welcome to your dedicated AI Concept Tutor! Select a pedagogical mode above and ask anything about your coursework.",
      suggestions: [
        "Explain recursion with a real-life analogy",
        "Teach me DBMS 3NF vs BCNF normalization",
        "How does the Banker's Algorithm prevent deadlock?",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const modes = [
    { id: "learn", label: "Learn Mode", desc: "Step-by-step teaching", icon: BookOpen },
    { id: "practice", label: "Practice Mode", desc: "AI quizzes you", icon: HelpCircle },
    { id: "exam", label: "Exam Mode", desc: "Marking-scheme answers", icon: Award },
    { id: "interview", label: "Interview Mode", desc: "Technical interview prep", icon: Briefcase },
    { id: "doubt", label: "Doubt Mode", desc: "Deep concept clarification", icon: Lightbulb },
  ];

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || inputMessage;
    if (!textToSend.trim() || loading) return;

    setInputMessage("");
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setLoading(true);

    try {
      const res = await api.chatTutor(textToSend, mode, subject);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.reply,
          suggestions: res.suggestions,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I experienced an error answering your query. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Concept Tutor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Adaptive interactive tutor configured with 5 distinct pedagogical modes.
          </p>
        </div>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="Operating Systems">Operating Systems</option>
          <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
          <option value="Database Management Systems">Database Management Systems</option>
          <option value="Computer Networks">Computer Networks</option>
        </select>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 font-bold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-indigo-400"}`} />
                {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-bold">{m.label}</div>
                <div className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                  {m.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Conversation Box */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 max-w-2xl">
                  {m.suggestions.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(s)}
                      className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-2 animate-pulse">
              <RotateCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI Tutor is preparing {mode} instruction...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask a question in ${mode.toUpperCase()} mode...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || loading}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
