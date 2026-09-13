import { Router, Request, Response } from "express";
import { DataStore } from "../db/store.js";
import { AIService } from "../services/aiService.js";

export const tutorRouter = Router();

// Ask Your Document (Document Grounded RAG)
tutorRouter.post("/ask-document", async (req: Request, res: Response) => {
  try {
    const { documentId, question, history, rawText } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    let docText = rawText || "";
    if (documentId) {
      const doc = DataStore.getDocumentById(documentId);
      if (doc) docText = doc.extracted_text;
    }

    if (!docText) {
      // Fall back to first user document
      const allDocs = DataStore.getDocuments("u-demo-student-001");
      if (allDocs.length > 0) docText = allDocs[0].extracted_text;
    }

    const result = await AIService.askDocument(docText, question, history || []);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to answer question" });
  }
});

// AI Concept Tutor (5 modes: Learn, Practice, Exam, Interview, Doubt)
tutorRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, mode, subject } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await AIService.tutorChat(
      message,
      mode || "learn",
      subject || "Computer Science"
    );

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Tutor failed to respond" });
  }
});

// AI Code Tutor (inspects code, time/space complexity, bugs, improved code)
tutorRouter.post("/code-explain", async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Code snippet is required" });
    }

    const analysis = await AIService.explainCode(code, language || "javascript");
    return res.json(analysis);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Code analysis failed" });
  }
});
