import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { DataStore } from "./db/store.js";
import { authRouter } from "./routes/auth.js";
import { documentsRouter } from "./routes/documents.js";
import { notesRouter } from "./routes/notes.js";
import { flashcardsRouter } from "./routes/flashcards.js";
import { quizRouter } from "./routes/quiz.js";
import { tutorRouter } from "./routes/tutor.js";
import { plannerRouter } from "./routes/planner.js";
import { analyticsRouter } from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize in-memory / persisted relational store
DataStore.init();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static uploads serving
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "EduMind AI Study Assistant API",
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/notes", notesRouter);
app.use("/api/flashcards", flashcardsRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/planner", plannerRouter);
app.use("/api/analytics", analyticsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduMind AI Server listening on http://localhost:${PORT}`);
});
