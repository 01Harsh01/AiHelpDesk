import React, { useState, useEffect } from "react";
import {
  MessageSquareText,
  Send,
  Sparkles,
  FileText,
  BookOpen,
  ArrowRight,
  HelpCircle,
  RotateCw,
  Lightbulb,
} from "lucide-react";
import { api } from "../services/api";
import { DocumentItem } from "../types";
import { useStudy } from "../context/StudyContext";

interface DocChatPageProps {
  onNavigate: (page: string) => void;
}

export const DocChatPage: React.FC<DocChatPageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      sender: "user" | "ai";
      text: string;
      citations?: Array<{ page: number; excerpt: string }>;
      suggestedQuestions?: string[];
    }>
  >([
    {
      sender: "ai",
      text: "Hello! Select any of your uploaded study materials and ask questions. Every answer is grounded directly in your syllabus with page citations.",
      suggestedQuestions: [
        "Explain deadlock in simple words",
        "What are the four necessary Coffman conditions?",
        "How does Banker's Algorithm calculate safe state?",
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const list = await api.getDocuments();
        setDocuments(list);
        if (list.length > 0) setSelectedDocId(list[0].id);
      } catch (e) {}
    };
    fetchDocs();
  }, []);

  const activeDoc = documents.find((d) => d.id === selectedDocId);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    setInputQuery("");
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setLoading(true);

    try {
      const res = await api.askDocument({
        documentId: selectedDocId,
        question: textToSend,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.answer,
          citations: res.citations,
          suggestedQuestions: res.suggestedQuestions,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I was unable to analyze this document query. Please check that the document contains text content.",
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Document Grounded Q&A (RAG)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ask Your Document
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Query your textbook or lecture slides. The AI verifies and cites exact sections.
          </p>
        </div>

        {/* Document Selector */}
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Active Document Status Bar */}
        {activeDoc && (
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Active: <strong className="text-slate-800 dark:text-slate-200">{activeDoc.file_name}</strong>
              </span>
              <span className="text-[10px] text-slate-400">({activeDoc.chunk_count} indexed chunks)</span>
            </div>
            <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              Answer based strictly on uploaded material
            </span>
          </div>
        )}

        {/* Messages Scroll Area */}
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

                {/* Citations Card */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700/80 text-[11px] text-indigo-400">
                    <span className="font-bold flex items-center gap-1 mb-1">
                      <BookOpen className="w-3 h-3" /> Cited Sources:
                    </span>
                    {m.citations.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2 rounded-lg bg-indigo-500/5 dark:bg-indigo-950/40 border border-indigo-500/20 text-slate-600 dark:text-slate-300 font-mono text-[10px] mt-1"
                      >
                        Section {c.page}: "{c.excerpt}"
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Questions */}
              {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 max-w-2xl">
                  {m.suggestedQuestions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-2 animate-pulse">
              <RotateCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI is reading and verifying against your document...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => handleSend("Explain deadlock in simple words.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
            >
              Explain simpler
            </button>
            <button
              onClick={() => handleSend("Give me a 10-marks university exam style answer.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
            >
              Exam-style answer
            </button>
            <button
              onClick={() => onNavigate("quiz")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 font-medium hover:bg-pink-500/20"
            >
              Create Quiz from this
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Ask any question about ${activeDoc?.title || "this document"}...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
