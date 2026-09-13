import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  Copy,
  Download,
  Bookmark,
  Share2,
  Edit3,
  Check,
  RotateCw,
  Search,
  Upload,
  BookOpen,
} from "lucide-react";
import { api } from "../services/api";
import { NoteItem, DocumentItem } from "../types";
import { useStudy } from "../context/StudyContext";
import { useAuth } from "../context/AuthContext";

export const NotesPage: React.FC = () => {
  const { triggerCelebration } = useStudy();
  const { addXPToUser } = useAuth();

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [sourceMode, setSourceMode] = useState<"document" | "paste">("document");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [subjectName, setSubjectName] = useState("Operating Systems");
  const [formatType, setFormatType] = useState("Exam Notes");

  const formats = [
    "Quick Summary",
    "Detailed Notes",
    "Exam Notes",
    "Beginner Explanation",
    "Important Points",
    "Formula Sheet",
    "Interview Notes",
  ];

  useEffect(() => {
    loadNotesAndDocs();
  }, []);

  const loadNotesAndDocs = async () => {
    try {
      const [fetchedNotes, fetchedDocs] = await Promise.all([
        api.getNotes(),
        api.getDocuments(),
      ]);
      setNotes(fetchedNotes);
      setDocuments(fetchedDocs);
      if (fetchedNotes.length > 0 && !selectedNote) {
        setSelectedNote(fetchedNotes[0]);
        setEditedMarkdown(fetchedNotes[0].content_markdown);
      }
      if (fetchedDocs.length > 0 && !selectedDocId) {
        setSelectedDocId(fetchedDocs[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newNote = await api.generateNotes({
        documentId: sourceMode === "document" ? selectedDocId : undefined,
        rawText: sourceMode === "paste" ? pastedText : undefined,
        formatType,
        subjectName,
      });

      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setEditedMarkdown(newNote.content_markdown);
      setShowGenModal(false);
      setPastedText("");
      triggerCelebration();
      addXPToUser(30);
    } catch (err) {
      alert("Failed to generate notes. Please check your input.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedNote) return;
    try {
      const updated = await api.updateNote(selectedNote.id, {
        content_markdown: editedMarkdown,
      });
      setSelectedNote(updated);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setIsEditing(false);
    } catch (e) {}
  };

  const handleCopy = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content_markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Structured Notes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform study materials into high-yield summaries, formula sheets, and exam notes.
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate New Notes</span>
        </button>
      </div>

      {/* Main Split View: Left List / Right Note Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Notes List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setEditedMarkdown(note.content_markdown);
                  setIsEditing(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedNote?.id === note.id
                    ? "bg-indigo-600/10 border-indigo-500 shadow-md"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-indigo-500 font-bold mb-1">
                  <span>{note.subject_name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                    {note.format_type}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {note.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Note Viewer / Editor */}
        <div className="lg:col-span-8">
          {selectedNote ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/40">
                <div>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                    {selectedNote.subject_name} • {selectedNote.format_type}
                  </span>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? "View" : "Edit"}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedMarkdown}
                      onChange={(e) => setEditedMarkdown(e.target.value)}
                      className="w-full h-[450px] p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 outline-none resize-none focus:border-indigo-500 leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm space-y-4">
                    <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0 border-none">
                      {selectedNote.content_markdown}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
              Select a note or generate a new one.
            </div>
          )}
        </div>
      </div>

      {/* Note Generation Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-200">Generate Structured Notes</h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Source Tab: Pick Document vs Paste Text */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setSourceMode("document")}
                className={`py-2 rounded-lg transition-all ${
                  sourceMode === "document" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                From Uploaded Material
              </button>
              <button
                onClick={() => setSourceMode("paste")}
                className={`py-2 rounded-lg transition-all ${
                  sourceMode === "paste" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Paste Lecture Text
              </button>
            </div>

            {sourceMode === "document" ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Study Material
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title} ({doc.file_name})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Paste Study Material / Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste lecture text, textbook excerpt, or notes here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Format</label>
                <select
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  {formats.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Notes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
