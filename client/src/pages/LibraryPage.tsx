import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  FileText,
  Upload,
  Search,
  Plus,
  Trash2,
  BookOpen,
  Layers,
  HelpCircle,
  MessageSquareText,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { api } from "../services/api";
import { DocumentItem } from "../types";
import { useStudy } from "../context/StudyContext";

interface LibraryPageProps {
  onNavigate: (page: string, targetId?: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const { triggerCelebration } = useStudy();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "paste">("file");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Operating Systems");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const list = await api.getDocuments();
      setDocuments(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async () => {
    setIsUploading(true);
    try {
      if (uploadMode === "file" && fileToUpload) {
        const newDoc = await api.uploadDocument(fileToUpload, selectedSubject);
        setDocuments((prev) => [newDoc, ...prev]);
      } else if (uploadMode === "paste" && pasteContent.trim()) {
        const newDoc = await api.pasteDocument(pasteTitle || "Pasted Lecture Notes", pasteContent, selectedSubject);
        setDocuments((prev) => [newDoc, ...prev]);
      }
      setShowUploadModal(false);
      setFileToUpload(null);
      setPasteTitle("");
      setPasteContent("");
      triggerCelebration();
    } catch (err: any) {
      alert(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this study material?")) return;
    try {
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (e) {}
  };

  const folders = [
    { id: "all", label: "All Materials" },
    { id: "Operating Systems", label: "Operating Systems" },
    { id: "Data Structures & Algorithms", label: "Data Structures" },
    { id: "Database Management Systems", label: "DBMS" },
    { id: "Computer Networks", label: "Computer Networks" },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesFolder = selectedFolder === "all" || doc.subject_name === selectedFolder;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Material Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            All your uploaded textbooks, lecture slides, and notes organized by subject.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                selectedFolder === f.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-2">
                <span>{doc.subject_name || "Coursework"}</span>
                <button
                  onClick={(e) => handleDelete(doc.id, e)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {doc.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {doc.file_name} • {(doc.file_size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate("docchat")}
                className="text-indigo-500 font-bold hover:underline flex items-center gap-1"
              >
                <MessageSquareText className="w-3.5 h-3.5" /> Ask AI
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("notes")}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Generate Notes"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("flashcards")}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Flashcards"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("quiz")}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Quiz"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">Upload Study Material</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 text-xs">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setUploadMode("file")}
                className={`py-2 rounded-lg transition-all ${
                  uploadMode === "file" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Upload File (PDF/PPT/DOC/TXT)
              </button>
              <button
                onClick={() => setUploadMode("paste")}
                className={`py-2 rounded-lg transition-all ${
                  uploadMode === "paste" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Paste Lecture Text
              </button>
            </div>

            {uploadMode === "file" ? (
              <div className="p-6 border-2 border-dashed border-slate-700 rounded-2xl text-center space-y-2 cursor-pointer hover:border-indigo-500 transition-colors">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => e.target.files && setFileToUpload(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <span className="text-xs font-bold text-indigo-400">
                    {fileToUpload ? fileToUpload.name : "Click to select a file from device"}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Supports PDF, DOCX, PPTX, TXT, and Markdown up to 25MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Material Title (e.g. Chapter 4 Deadlocks)"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
                <textarea
                  rows={5}
                  placeholder="Paste study text, lecture transcripts, or notes..."
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Category</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="General Studies">General Studies</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Material...</span>
                  </>
                ) : (
                  <span>Upload & Index</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
