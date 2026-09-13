import React, { useState, useEffect } from "react";
import { Search, X, FileText, Layers, HelpCircle, Folder, ArrowRight } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { api } from "../../services/api";

interface SearchModalProps {
  onNavigate: (page: string, targetId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const { isSearchOpen, closeSearch } = useStudy();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    documents: any[];
    notes: any[];
    flashcards: any[];
    quizzes: any[];
  }>({ documents: [], notes: [], flashcards: [], quizzes: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else {
          setQuery("");
          useStudy;
        }
      }
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ documents: [], notes: [], flashcards: [], quizzes: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data);
      } catch (e) {}
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const totalResults =
    results.documents.length +
    results.notes.length +
    results.flashcards.length +
    results.quizzes.length;

  const handleSelect = (type: string, id: string) => {
    closeSearch();
    if (type === "document") onNavigate("library");
    else if (type === "note") onNavigate("notes");
    else if (type === "flashcard") onNavigate("flashcards");
    else if (type === "quiz") onNavigate("quiz");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500" />
          <input
            autoFocus
            type="text"
            placeholder="Search documents, notes, flashcards, quizzes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
              Searching across all materials...
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords like "deadlock", "BST", "normalization", or "handshake"
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matches found for "{query}". Try a different topic or keyword.
            </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500" /> AI Notes
              </div>
              <div className="space-y-1">
                {results.notes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect("note", n.id)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-400">
                        {n.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{n.subtitle}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flashcards */}
          {results.flashcards.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Flashcards
              </div>
              <div className="space-y-1">
                {results.flashcards.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect("flashcard", c.id)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-400">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-400">Topic: {c.subtitle}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {results.quizzes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-pink-500" /> Quizzes
              </div>
              <div className="space-y-1">
                {results.quizzes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => handleSelect("quiz", q.id)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-pink-400">
                        {q.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{q.subtitle}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {results.documents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-indigo-500" /> Documents
              </div>
              <div className="space-y-1">
                {results.documents.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect("document", d.id)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-400">
                        {d.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{d.subtitle}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
          <span>EduMind AI Search Engine</span>
        </div>
      </div>
    </div>
  );
};
