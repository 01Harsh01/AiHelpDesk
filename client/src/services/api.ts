import {
  User,
  DocumentItem,
  NoteItem,
  Flashcard,
  FlashcardDeck,
  Quiz,
  QuizAttemptResult,
  StudyTask,
  DashboardOverview,
  NotificationItem,
  AchievementItem,
  Topic,
  CodeExplanation,
} from "../types";

const API_BASE = "/api";

function getHeaders(isJson: boolean = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("edumind_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const api = {
  // --- AUTH ---
  async demoLogin(): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Demo login failed");
    return res.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  async register(formData: any): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // --- DOCUMENTS ---
  async getDocuments(): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/documents`, { headers: getHeaders() });
    return res.json();
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async uploadDocument(file: File, subjectName: string): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectName", subjectName);

    const token = localStorage.getItem("edumind_token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    return res.json();
  },

  async pasteDocument(title: string, text: string, subjectName: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/paste`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ title, text, subjectName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create document");
    }
    return res.json();
  },

  async deleteDocument(id: string): Promise<void> {
    await fetch(`${API_BASE}/documents/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // --- NOTES ---
  async getNotes(): Promise<NoteItem[]> {
    const res = await fetch(`${API_BASE}/notes`, { headers: getHeaders() });
    return res.json();
  },

  async generateNotes(params: {
    documentId?: string;
    rawText?: string;
    formatType: string;
    subjectName: string;
  }): Promise<NoteItem> {
    const res = await fetch(`${API_BASE}/notes/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate notes");
    }
    return res.json();
  },

  async updateNote(id: string, updates: Partial<NoteItem>): Promise<NoteItem> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteNote(id: string): Promise<void> {
    await fetch(`${API_BASE}/notes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  // --- FLASHCARDS ---
  async getDecks(): Promise<FlashcardDeck[]> {
    const res = await fetch(`${API_BASE}/flashcards/decks`, { headers: getHeaders() });
    return res.json();
  },

  async getDeckCards(deckId: string): Promise<Flashcard[]> {
    const res = await fetch(`${API_BASE}/flashcards/decks/${deckId}/cards`, { headers: getHeaders() });
    return res.json();
  },

  async getDueCards(): Promise<Flashcard[]> {
    const res = await fetch(`${API_BASE}/flashcards/due`, { headers: getHeaders() });
    return res.json();
  },

  async generateFlashcards(params: {
    documentId?: string;
    rawText?: string;
    subjectName: string;
    topic: string;
    count: number;
    difficulty: string;
  }): Promise<{ deck: FlashcardDeck; cards: Flashcard[] }> {
    const res = await fetch(`${API_BASE}/flashcards/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate deck");
    }
    return res.json();
  },

  async reviewCard(
    cardId: string,
    rating: "again" | "hard" | "good" | "easy"
  ): Promise<{ card: Flashcard; xpEarned: number }> {
    const res = await fetch(`${API_BASE}/flashcards/review/${cardId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ rating }),
    });
    return res.json();
  },

  // --- QUIZZES ---
  async getQuizzes(): Promise<Quiz[]> {
    const res = await fetch(`${API_BASE}/quiz`, { headers: getHeaders() });
    return res.json();
  },

  async getQuiz(id: string): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quiz/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async generateQuiz(params: {
    documentId?: string;
    rawText?: string;
    subjectName: string;
    topic: string;
    difficulty: string;
    questionCount: number;
    questionType: string;
    isAdaptive?: boolean;
  }): Promise<{ quiz: Quiz; questions: any[] }> {
    const res = await fetch(`${API_BASE}/quiz/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate quiz");
    }
    return res.json();
  },

  async submitQuiz(
    quizId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<QuizAttemptResult> {
    const res = await fetch(`${API_BASE}/quiz/${quizId}/submit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ answers, timeSpentSeconds }),
    });
    return res.json();
  },

  // --- TUTOR & DOCUMENT RAG ---
  async askDocument(params: {
    documentId?: string;
    question: string;
    rawText?: string;
  }): Promise<{
    answer: string;
    citations: Array<{ page: number; excerpt: string }>;
    suggestedQuestions: string[];
  }> {
    const res = await fetch(`${API_BASE}/tutor/ask-document`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async chatTutor(
    message: string,
    mode: "learn" | "practice" | "exam" | "interview" | "doubt",
    subject?: string
  ): Promise<{ reply: string; suggestions: string[] }> {
    const res = await fetch(`${API_BASE}/tutor/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, mode, subject }),
    });
    return res.json();
  },

  async explainCode(code: string, language: string): Promise<CodeExplanation> {
    const res = await fetch(`${API_BASE}/tutor/code-explain`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ code, language }),
    });
    return res.json();
  },

  // --- PLANNER ---
  async getTasks(): Promise<StudyTask[]> {
    const res = await fetch(`${API_BASE}/planner/tasks`, { headers: getHeaders() });
    return res.json();
  },

  async toggleTask(id: string): Promise<StudyTask> {
    const res = await fetch(`${API_BASE}/planner/tasks/${id}/toggle`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  async addTask(task: Partial<StudyTask>): Promise<StudyTask> {
    const res = await fetch(`${API_BASE}/planner/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async generateStudyPlan(params: {
    examDate: string;
    subjects: string[];
    dailyHours: number;
    preparationLevel?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/planner/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async rescheduleTasks(): Promise<any> {
    const res = await fetch(`${API_BASE}/planner/reschedule`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- ANALYTICS & DASHBOARD ---
  async getDashboard(): Promise<DashboardOverview> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getHeaders() });
    return res.json();
  },

  async getWeakTopics(): Promise<Topic[]> {
    const res = await fetch(`${API_BASE}/analytics/weak-topics`, { headers: getHeaders() });
    return res.json();
  },

  async logPomodoro(params: {
    durationMinutes: number;
    subjectName?: string;
    taskName?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/pomodoro`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/analytics/notifications`, { headers: getHeaders() });
    return res.json();
  },

  async markNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/analytics/notifications/read`, {
      method: "POST",
      headers: getHeaders(),
    });
  },

  async getAchievements(): Promise<AchievementItem[]> {
    const res = await fetch(`${API_BASE}/analytics/achievements`, { headers: getHeaders() });
    return res.json();
  },

  async search(query: string): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
