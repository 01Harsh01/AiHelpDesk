import React from "react";
import {
  GraduationCap,
  Sparkles,
  FileText,
  Layers,
  HelpCircle,
  MessageSquareText,
  Calendar,
  BarChart3,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Code2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { demoLogin } = useAuth();

  const handleDemoClick = async () => {
    await demoLogin();
    onNavigate("dashboard");
  };

  const features = [
    {
      icon: FileText,
      title: "AI Structured Notes",
      desc: "Turn messy PDFs, PPTs, or lecture recordings into high-yield summaries, formula sheets, and exam notes.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Layers,
      title: "Smart Flashcards",
      desc: "Automatically extracts key terms into interactive 3D flashcards backed by SuperMemo SM-2 spaced repetition.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: HelpCircle,
      title: "AI Quiz & Adaptive Practice",
      desc: "Generates custom MCQs and automatically increases questions from topics where you struggle.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: MessageSquareText,
      title: "Ask Your Document (RAG)",
      desc: "Grounded conversational AI that answers questions strictly using your uploaded syllabus and cites exact pages.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Calendar,
      title: "AI Study Planner",
      desc: "Enter your exam date and daily hours; our scheduler maps out daily tasks and auto-reschedules when you miss one.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: RotateCcw,
      title: "Weakness Detection",
      desc: "Identifies knowledge gaps from quiz mistakes and flashcard reviews to build your daily revision agenda.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Code2,
      title: "AI Code Tutor",
      desc: "Paste C++, Python, Java, or SQL code for instant complexity analysis, dry runs, and bug detection.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: BarChart3,
      title: "Deep Progress Analytics",
      desc: "Interactive mastery heatmaps, study streaks, Pomodoro time tracking, and RPG gamification levels.",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e15] text-white selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              EduMind AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo-preview" className="hover:text-white transition-colors">
              Live Preview
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Why EduMind
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate("signup")}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Get Started Free</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            The Ultimate College & School AI Companion
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Study Smarter. Learn Faster.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Remember Longer.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one AI study platform combining <strong>Notion + Quizlet + ChatGPT + Google Classroom</strong>.
            Instantly turn your PDFs, slides, and notes into structured summaries, interactive 3D flashcards, adaptive quizzes, and grounded Q&A.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("signup")}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleDemoClick}
              className="px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-base border border-slate-700/80 flex items-center gap-3 transition-all"
            >
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Explore Student Workspace</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grounded in Uploaded Materials
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SM-2 Spaced Repetition Engine
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real Adaptive Quizzing
            </div>
          </div>
        </div>

        {/* Interactive Animated Dashboard Teaser Preview */}
        <div id="demo-preview" className="max-w-6xl mx-auto mt-16 relative z-10">
          <div className="p-3 rounded-3xl bg-slate-800/40 border border-slate-700/60 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 overflow-hidden">
              {/* Fake Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-500">edumind.ai/dashboard</span>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-semibold">
                  Live Interactive Workspace
                </span>
              </div>

              {/* Teaser Content Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                          AI Recommendation
                        </div>
                        <div className="font-bold text-lg text-white mt-1">
                          You are struggling with Binary Search Trees (42% mastery)
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Spend 20 minutes revising BST deletion and complete the recommended adaptive quiz.
                        </div>
                      </div>
                      <button
                        onClick={handleDemoClick}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shrink-0 ml-4"
                      >
                        Revise Now
                      </button>
                    </div>
                  </div>

                  {/* Active Subjects Progress */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200">Data Structures</span>
                        <span className="text-indigo-400">72%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="w-[72%] h-full bg-indigo-500 rounded-full" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block">Binary Trees & Heaps</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200">Operating Systems</span>
                        <span className="text-pink-400">48%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="w-[48%] h-full bg-pink-500 rounded-full" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block">Coffman Deadlocks & Paging</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Teaser Stats */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
                      <span>Today's Study Session</span>
                      <span className="text-amber-400 font-bold">🔥 7-Day Streak</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white">45 min</div>
                    <div className="text-xs text-slate-400 mt-1">Daily Target: 90 min (50% done)</div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Level 3 Scholar</span>
                      <span className="text-purple-400 font-mono font-bold">640 XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                    </div>
                  </div>

                  <button
                    onClick={handleDemoClick}
                    className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Open Student Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineered for High Academic Performance
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Everything you need to master your syllabus in one interconnected platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Accelerate Your Academic Journey?
          </h2>
          <p className="mt-4 text-slate-300 text-sm max-w-xl mx-auto">
            Join thousands of university and high school students who are scoring higher while studying in less time.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleDemoClick}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Launch Live App in Demo Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        EduMind AI Study Assistant © 2026 • Built for Students Worldwide
      </footer>
    </div>
  );
};
