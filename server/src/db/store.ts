import fs from "fs";
import path from "path";
import { seedData } from "./seedData.js";
import { calculateSM2, SpacedRepetitionRating } from "../services/spacedRepetition.js";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

export interface DataStoreShape {
  users: any[];
  userSettings: any[];
  subjects: any[];
  topics: any[];
  documents: any[];
  notes: any[];
  flashcardDecks: any[];
  flashcards: any[];
  quizzes: any[];
  quizQuestions: any[];
  quizAttempts: any[];
  studyPlans: any[];
  studyTasks: any[];
  studySessions: any[];
  achievements: any[];
  notifications: any[];
}

export class DataStore {
  private static data: DataStoreShape = {
    users: [],
    userSettings: [],
    subjects: [],
    topics: [],
    documents: [],
    notes: [],
    flashcardDecks: [],
    flashcards: [],
    quizzes: [],
    quizQuestions: [],
    quizAttempts: [],
    studyPlans: [],
    studyTasks: [],
    studySessions: [],
    achievements: [],
    notifications: [],
  };

  static init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
      }
    } catch (err) {
      console.warn("Failed to load store.json, seeding initial data:", err);
      this.seedInitialData();
    }
  }

  private static seedInitialData() {
    this.data.users = [seedData.user];
    this.data.userSettings = [{ ...seedData.settings, user_id: seedData.user.id }];
    this.data.subjects = seedData.subjects.map((s) => ({ ...s, user_id: seedData.user.id }));
    this.data.topics = seedData.topics;
    this.data.documents = seedData.documents.map((d) => ({ ...d, user_id: seedData.user.id }));
    this.data.notes = seedData.notes;

    // Flashcard decks & cards
    this.data.flashcardDecks = seedData.flashcard_decks.map((d) => {
      const { cards, ...deck } = d;
      return deck;
    });
    this.data.flashcards = seedData.flashcard_decks.flatMap((d) => d.cards);

    // Quizzes and questions
    this.data.quizzes = seedData.quizzes.map((q) => {
      const { questions, ...quiz } = q;
      return quiz;
    });
    this.data.quizQuestions = seedData.quizzes.flatMap((q) =>
      q.questions.map((qn) => ({ ...qn, quiz_id: q.id }))
    );

    this.data.studyTasks = seedData.study_tasks;
    this.data.studySessions = seedData.study_sessions;
    this.data.achievements = seedData.achievements.map((a) => ({ ...a, user_id: seedData.user.id }));
    this.data.notifications = seedData.notifications.map((n) => ({ ...n, user_id: seedData.user.id }));

    this.persist();
  }

  static persist() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist data store:", err);
    }
  }

  // --- USER METHODS ---
  static findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  static createUser(userData: any) {
    const newUser = {
      id: `u-${Date.now()}`,
      xp: 100,
      level: 1,
      current_streak: 1,
      last_active_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      ...userData,
    };
    this.data.users.push(newUser);
    this.data.userSettings.push({
      user_id: newUser.id,
      theme: "dark",
      daily_study_target_minutes: 60,
      learning_goals: ["Pass Exams", "Improve GPA"],
      selected_subjects: userData.main_subjects || ["General Computer Science"],
      notifications_enabled: true,
      sound_effects_enabled: true,
    });
    this.persist();
    return newUser;
  }

  static updateUserProfile(userId: string, updates: any) {
    const user = this.findUserById(userId);
    if (user) {
      Object.assign(user, updates);
      this.persist();
    }
    return user;
  }

  static addXP(userId: string, xpAmount: number) {
    const user = this.findUserById(userId);
    if (user) {
      user.xp = (user.xp || 0) + xpAmount;
      // Level progression: Level = Math.floor(xp / 250) + 1 capped at 5
      const newLevel = Math.min(5, Math.floor(user.xp / 250) + 1);
      const leveledUp = newLevel > (user.level || 1);
      user.level = newLevel;
      this.persist();
      return { user, leveledUp, newLevel };
    }
    return null;
  }

  // --- DOCUMENTS ---
  static getDocuments(userId: string) {
    return this.data.documents.filter((d) => d.user_id === userId);
  }

  static getDocumentById(docId: string) {
    return this.data.documents.find((d) => d.id === docId);
  }

  static createDocument(doc: any) {
    const newDoc = {
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...doc,
    };
    this.data.documents.unshift(newDoc);
    this.persist();
    return newDoc;
  }

  static deleteDocument(docId: string) {
    this.data.documents = this.data.documents.filter((d) => d.id !== docId);
    this.persist();
    return true;
  }

  // --- NOTES ---
  static getNotes(userId: string) {
    return this.data.notes.filter((n) => n.user_id === userId);
  }

  static getNoteById(noteId: string) {
    return this.data.notes.find((n) => n.id === noteId);
  }

  static createNote(note: any) {
    const newNote = {
      id: `note-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_bookmarked: false,
      ...note,
    };
    this.data.notes.unshift(newNote);
    this.persist();
    return newNote;
  }

  static updateNote(noteId: string, updates: any) {
    const note = this.getNoteById(noteId);
    if (note) {
      Object.assign(note, updates, { updated_at: new Date().toISOString() });
      this.persist();
    }
    return note;
  }

  static deleteNote(noteId: string) {
    this.data.notes = this.data.notes.filter((n) => n.id !== noteId);
    this.persist();
    return true;
  }

  // --- FLASHCARDS & DECKS ---
  static getDecks(userId: string) {
    return this.data.flashcardDecks
      .filter((d) => d.user_id === userId)
      .map((d) => {
        const cards = this.data.flashcards.filter((c) => c.deck_id === d.id);
        const dueCount = cards.filter((c) => new Date(c.next_review_date) <= new Date()).length;
        return { ...d, card_count: cards.length, due_count: dueCount };
      });
  }

  static getDeckCards(deckId: string) {
    return this.data.flashcards.filter((c) => c.deck_id === deckId);
  }

  static getDueFlashcards(userId: string) {
    const userDecks = this.data.flashcardDecks.filter((d) => d.user_id === userId).map((d) => d.id);
    const now = new Date();
    return this.data.flashcards.filter(
      (c) => userDecks.includes(c.deck_id) && new Date(c.next_review_date) <= now
    );
  }

  static createDeckWithCards(deckData: any, cardsData: any[]) {
    const deckId = `deck-${Date.now()}`;
    const newDeck = {
      id: deckId,
      card_count: cardsData.length,
      created_at: new Date().toISOString(),
      ...deckData,
    };
    this.data.flashcardDecks.unshift(newDeck);

    const createdCards = cardsData.map((c, idx) => ({
      id: `c-${Date.now()}-${idx}`,
      deck_id: deckId,
      front_text: c.front,
      back_text: c.back,
      topic: c.topic || deckData.subject_name,
      interval_days: 1,
      repetition_count: 0,
      easiness_factor: 2.5,
      next_review_date: new Date().toISOString(),
      state: "new",
      is_bookmarked: false,
    }));

    this.data.flashcards.push(...createdCards);
    this.persist();
    return { deck: newDeck, cards: createdCards };
  }

  static reviewFlashcard(cardId: string, rating: SpacedRepetitionRating) {
    const card = this.data.flashcards.find((c) => c.id === cardId);
    if (!card) return null;

    const sm2Result = calculateSM2({
      interval_days: card.interval_days || 1,
      repetition_count: card.repetition_count || 0,
      easiness_factor: card.easiness_factor || 2.5,
      rating,
    });

    Object.assign(card, sm2Result);
    this.persist();
    return card;
  }

  // --- QUIZZES & ATTEMPTS ---
  static getQuizzes(userId: string) {
    return this.data.quizzes
      .filter((q) => q.user_id === userId)
      .map((q) => {
        const questions = this.data.quizQuestions.filter((qn) => qn.quiz_id === q.id);
        const attempts = this.data.quizAttempts.filter((a) => a.quiz_id === q.id);
        const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
        return {
          ...q,
          question_count: questions.length,
          last_score: latestAttempt ? latestAttempt.score : null,
          last_accuracy: latestAttempt ? latestAttempt.accuracy_percentage : null,
        };
      });
  }

  static getQuizWithQuestions(quizId: string) {
    const quiz = this.data.quizzes.find((q) => q.id === quizId);
    if (!quiz) return null;
    const questions = this.data.quizQuestions.filter((qn) => qn.quiz_id === quizId);
    return { ...quiz, questions };
  }

  static createQuiz(quizData: any, questionsData: any[]) {
    const quizId = `quiz-${Date.now()}`;
    const newQuiz = {
      id: quizId,
      created_at: new Date().toISOString(),
      ...quizData,
    };
    this.data.quizzes.unshift(newQuiz);

    const questions = questionsData.map((q, idx) => ({
      id: `qn-${Date.now()}-${idx}`,
      quiz_id: quizId,
      question_text: q.questionText,
      question_type: q.questionType || "mcq",
      options: q.options || [],
      correct_answer: q.correctAnswer,
      explanation: q.explanation || "Accurate choice verified.",
      topic: q.topic || quizData.subject_name,
    }));

    this.data.quizQuestions.push(...questions);
    this.persist();
    return { quiz: newQuiz, questions };
  }

  static recordQuizAttempt(attemptData: any) {
    const newAttempt = {
      id: `att-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...attemptData,
    };
    this.data.quizAttempts.unshift(newAttempt);

    // Update topic mastery and identify weak topics
    if (attemptData.answers && Array.isArray(attemptData.answers)) {
      attemptData.answers.forEach((ans: any) => {
        const isCorrect = ans.isCorrect;
        const topicName = ans.topic;
        if (topicName) {
          let topic = this.data.topics.find((t) => t.name.toLowerCase() === topicName.toLowerCase());
          if (topic) {
            topic.mastery_percentage = isCorrect
              ? Math.min(100, topic.mastery_percentage + 10)
              : Math.max(20, topic.mastery_percentage - 15);
            topic.is_weak_topic = topic.mastery_percentage < 65;
            topic.last_reviewed_at = new Date().toISOString();
          } else {
            this.data.topics.push({
              id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: topicName,
              mastery_percentage: isCorrect ? 75 : 45,
              is_weak_topic: !isCorrect,
              last_reviewed_at: new Date().toISOString(),
            });
          }
        }
      });
    }

    this.persist();
    return newAttempt;
  }

  // --- WEAK TOPICS & TOPICS ---
  static getTopics(userId?: string) {
    return this.data.topics;
  }

  static getWeakTopics() {
    return this.data.topics.filter((t) => t.is_weak_topic || t.mastery_percentage < 65);
  }

  // --- STUDY PLANS & TASKS ---
  static getTasks(userId: string) {
    return this.data.studyTasks.filter((t) => t.user_id === userId);
  }

  static toggleTask(taskId: string) {
    const task = this.data.studyTasks.find((t) => t.id === taskId);
    if (task) {
      task.is_completed = !task.is_completed;
      this.persist();
    }
    return task;
  }

  static addTask(taskData: any) {
    const newTask = {
      id: `task-${Date.now()}`,
      is_completed: false,
      scheduled_date: new Date().toISOString().split("T")[0],
      ...taskData,
    };
    this.data.studyTasks.push(newTask);
    this.persist();
    return newTask;
  }

  // --- SESSIONS & POMODORO ---
  static logStudySession(sessionData: any) {
    const newSession = {
      id: `sess-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...sessionData,
    };
    this.data.studySessions.unshift(newSession);
    this.persist();
    return newSession;
  }

  static getStudySessions(userId: string) {
    return this.data.studySessions.filter((s) => s.user_id === userId);
  }

  // --- ACHIEVEMENTS & NOTIFICATIONS ---
  static getAchievements(userId: string) {
    return this.data.achievements;
  }

  static getNotifications(userId: string) {
    return this.data.notifications;
  }

  static markNotificationsRead(userId: string) {
    this.data.notifications.forEach((n) => (n.read = true));
    this.persist();
    return true;
  }

  // --- GLOBAL SEARCH ---
  static searchAll(userId: string, query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { documents: [], notes: [], flashcards: [], quizzes: [] };

    const docs = this.data.documents
      .filter((d) => d.user_id === userId && (d.title.toLowerCase().includes(q) || d.summary?.toLowerCase().includes(q)))
      .map((d) => ({ id: d.id, title: d.title, type: "document", subtitle: d.file_name }));

    const notes = this.data.notes
      .filter((n) => n.user_id === userId && (n.title.toLowerCase().includes(q) || n.content_markdown.toLowerCase().includes(q)))
      .map((n) => ({ id: n.id, title: n.title, type: "note", subtitle: n.subject_name }));

    const cards = this.data.flashcards
      .filter((c) => c.front_text.toLowerCase().includes(q) || c.back_text.toLowerCase().includes(q))
      .map((c) => ({ id: c.id, title: c.front_text, type: "flashcard", subtitle: c.topic }));

    const quizzes = this.data.quizzes
      .filter((qz) => qz.user_id === userId && (qz.title.toLowerCase().includes(q) || qz.topic?.toLowerCase().includes(q)))
      .map((qz) => ({ id: qz.id, title: qz.title, type: "quiz", subtitle: qz.subject_name }));

    return { documents: docs, notes, flashcards: cards, quizzes };
  }
}
