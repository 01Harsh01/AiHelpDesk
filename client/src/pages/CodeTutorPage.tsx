import React, { useState } from "react";
import {
  Code2,
  Sparkles,
  Play,
  RotateCw,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  HardDrive,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { CodeExplanation } from "../types";

export const CodeTutorPage: React.FC = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(`def find_inorder_successor(root, key):
    # Search for the key node
    curr = root
    successor = None
    while curr:
        if key < curr.val:
            successor = curr
            curr = curr.left
        elif key > curr.val:
            curr = curr.right
        else:
            if curr.right:
                successor = find_min(curr.right)
            break
    return successor`);

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CodeExplanation | null>(null);
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: "python", label: "Python" },
    { id: "cpp", label: "C++" },
    { id: "java", label: "Java" },
    { id: "javascript", label: "JavaScript" },
    { id: "c", label: "C" },
    { id: "sql", label: "SQL" },
  ];

  const handleAnalyze = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.explainCode(code, language);
      setAnalysis(res);
    } catch (e) {
      alert("Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5" />
            CS & Engineering Tutor
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Code Tutor & Complexity Inspector
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep algorithmic audit: line-by-line breakdown, Big-O complexity, bug detection, and dry runs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                language === l.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Code Editor / Analysis Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Code Input */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              {language} Source Code
            </span>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Analyze & Explain</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-5 bg-transparent font-mono text-xs sm:text-sm text-slate-200 outline-none resize-none leading-relaxed"
            placeholder="Paste your C++, Java, Python, or SQL code here..."
          />
        </div>

        {/* Right: Detailed Analysis */}
        <div className="lg:col-span-6 space-y-4">
          {analysis ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-5 max-h-[650px] overflow-y-auto">
              {/* Complexity Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Time Complexity</div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      {analysis.timeComplexity}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Space Complexity</div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      {analysis.spaceComplexity}
                    </div>
                  </div>
                </div>
              </div>

              {/* High-level Summary */}
              <div>
                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                  What This Code Does
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Line by line explanation */}
              <div>
                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                  Line-by-Line Breakdown
                </h3>
                <div className="space-y-2">
                  {analysis.lineByLineExplanation.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2"
                    >
                      <span className="font-mono text-indigo-500 font-bold shrink-0">
                        Lines {item.lineRange}:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{item.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bugs & Inefficiencies */}
              {analysis.bugsOrInefficiencies && analysis.bugsOrInefficiencies.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Bugs & Edge Cases Detected
                  </h3>
                  <div className="space-y-1.5">
                    {analysis.bugsOrInefficiencies.map((bug, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-400 font-medium"
                      >
                        ⚠️ {bug}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dry Run Example */}
              <div>
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                  Trace & Dry Run
                </h3>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                  {analysis.dryRunExample}
                </div>
              </div>

              {/* Improved Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Improved & Robust Code
                  </h3>
                  <button
                    onClick={handleCopyImproved}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap">
                  {analysis.improvedCode}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 h-full flex flex-col items-center justify-center space-y-2">
              <Code2 className="w-10 h-10 text-indigo-500/40" />
              <div className="text-sm font-bold text-slate-300">No Code Analyzed Yet</div>
              <p className="text-xs text-slate-500 max-w-xs">
                Paste your code snippet on the left and click "Analyze & Explain" for instant complexity analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
