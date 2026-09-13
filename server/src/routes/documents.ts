import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { DataStore } from "../db/store.js";
import { DocumentParser } from "../services/documentParser.js";

export const documentsRouter = Router();

// Multer storage config
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// List documents
documentsRouter.get("/", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u-demo-student-001";
  const docs = DataStore.getDocuments(userId);
  return res.json(docs);
});

// Get document by ID
documentsRouter.get("/:id", (req: Request, res: Response) => {
  const doc = DataStore.getDocumentById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  return res.json(doc);
});

// Upload file
documentsRouter.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userId = (req.body.userId as string) || "u-demo-student-001";
    const subjectName = (req.body.subjectName as string) || "General Study";

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const parsed = await DocumentParser.parseFile(file.path, file.originalname);

    const newDoc = DataStore.createDocument({
      user_id: userId,
      title: parsed.title,
      file_name: file.originalname,
      file_type: file.mimetype || "application/octet-stream",
      file_size: file.size,
      file_path: file.path,
      extracted_text: parsed.extractedText,
      chunk_count: parsed.chunks.length,
      summary: parsed.summary,
      subject_name: subjectName,
    });

    return res.status(201).json(newDoc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to process file" });
  }
});

// Create document from pasted text
documentsRouter.post("/paste", (req: Request, res: Response) => {
  try {
    const { title, text, subjectName, userId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text content is required" });
    }

    const docTitle = title?.trim() || "Pasted Study Material";
    const parsed = DocumentParser.parseText(docTitle, text);

    const newDoc = DataStore.createDocument({
      user_id: userId || "u-demo-student-001",
      title: docTitle,
      file_name: `${docTitle.replace(/\s+/g, "_")}.txt`,
      file_type: "text/plain",
      file_size: Buffer.byteLength(text, "utf8"),
      extracted_text: parsed.extractedText,
      chunk_count: parsed.chunks.length,
      summary: parsed.summary,
      subject_name: subjectName || "General Study",
    });

    return res.status(201).json(newDoc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create document" });
  }
});

// Delete document
documentsRouter.delete("/:id", (req: Request, res: Response) => {
  DataStore.deleteDocument(req.params.id);
  return res.json({ success: true });
});
