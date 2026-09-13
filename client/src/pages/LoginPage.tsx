import React, { useState } from "react";
import { GraduationCap, Zap, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("alex.rivera@university.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      onNavigate("dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin();
      onNavigate("dashboard");
    } catch (err: any) {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] flex flex-col justify-center items-center p-6 text-white relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div
          className="flex items-center justify-center gap-3 mb-8 cursor-pointer"
          onClick={() => onNavigate("landing")}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              EduMind AI
            </div>
            <div className="text-xs text-indigo-400 font-medium">Smart Student Platform</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back 👋</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your EduMind student account.</p>

          <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-300">
              Returning user? <span className="font-semibold text-white">Alex Rivera</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30 transition-colors"
            >
              Quick Sign In
            </button>
          </div>
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[11px] text-slate-500 uppercase font-semibold">Or with credentials</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#forgot" className="text-[11px] text-indigo-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Signing In..." : "Sign In to EduMind"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-indigo-400 font-bold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
