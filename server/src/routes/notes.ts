import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";
import { AIService } from "../services/aiService.js";

export const notesRouter = Router();

// List all notes for user
notesRouter.get("/", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const notes = DataStore.getNotes(userId);
  return res.json(notes);
});

// Get note by ID
notesRouter.get("/:id", (req: Request, res: Response) => {
  const note = DataStore.getNoteById(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  return res.json(note);
});

// Generate Notes using AI
notesRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { documentId, rawText, formatType, subjectName, userId } = req.body;

    let textToAnalyze = rawText || "";
    let docTitle = "";

    if (documentId) {
      const doc = DataStore.getDocumentById(documentId);
      if (doc) {
        textToAnalyze = doc.extracted_text;
        docTitle = doc.title;
      }
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return res.status(400).json({ error: "No study text provided for notes generation." });
    }

    const effectiveSubject = subjectName || "General Study";
    const effectiveFormat = formatType || "Detailed Notes";

    const aiNote = await AIService.generateNotes(
      textToAnalyze,
      effectiveFormat,
      effectiveSubject,
      docTitle
    );

    const savedNote = DataStore.createNote({
      user_id: userId || "u-demo-student-001",
      document_id: documentId || null,
      subject_name: effectiveSubject,
      title: aiNote.title,
      format_type: aiNote.formatType,
      content_markdown: aiNote.contentMarkdown,
      key_takeaways: aiNote.keyTakeaways,
      tags: aiNote.tags,
    });

    // Reward XP for generating notes
    DataStore.addXP(userId || "u-demo-student-001", 30);

    return res.status(201).json(savedNote);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to generate notes" });
  }
});

// Update note (edit content/bookmark)
notesRouter.put("/:id", (req: Request, res: Response) => {
  const updated = DataStore.updateNote(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Note not found" });
  return res.json(updated);
});

// Delete note
notesRouter.delete("/:id", (req: Request, res: Response) => {
  DataStore.deleteNote(req.params.id);
  return res.json({ success: true });
});
