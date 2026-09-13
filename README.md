# EduMind AI — Advanced AI Study Assistant 🎓

An interactive, responsive, production-ready AI study platform combining the best capabilities of **Notion, Quizlet, ChatGPT, and Google Classroom** for university and school students.

---

## 🌟 Core Feature Suite

1. **AI Structured Notes Generator**:
   - Supports 7 formats: *Quick Summary, Detailed Notes, Exam Notes, Beginner Explanation, Important Points, Formula Sheet, Interview Notes*.
   - Features rich markdown preview, inline live editor, instant clipboard copying, and `.md` file export.
2. **Smart Flashcards & SuperMemo SM-2 Spaced Repetition**:
   - Interactive 3D flip card animations with custom perspective transforms.
   - 4-tier SM-2 spaced repetition rating: `Again (<1d)`, `Hard (2d)`, `Good (4d)`, `Easy (7d)`.
   - Cards automatically reschedule based on memory decay intervals and award XP.
3. **AI Quizzes & Adaptive Practice Mode**:
   - Generates MCQs and True/False questions with live countdown timers and question jumper palettes.
   - **Adaptive Practice Mode**: analyzes student mistake patterns and automatically weighs questions towards detected weak areas.
   - Detailed post-quiz analytics with comprehensive explanations for every option and instant topic mastery updates.
4. **Ask Your Document (Grounded RAG Q&A)**:
   - Chat interface for uploaded PDF, DOCX, PPTX, or TXT study materials.
   - Grounded responses citing exact section and page numbers with one-click follow-up prompts (*"Explain simpler"*, *"Give an exam answer"*, *"Create quiz from this"*).
5. **AI Concept Tutor (5 Modes)**:
   - Dedicated interactive tutor supporting *Learn Mode* (step-by-step), *Practice Mode* (AI tests you), *Exam Mode* (marking schemes), *Interview Mode* (technical lead queries), and *Doubt Mode*.
6. **AI Code Tutor & Complexity Inspector**:
   - Multi-language algorithmic audit supporting **C++, Java, Python, JavaScript, C, and SQL**.
   - Outputs: What code does, line-by-line breakdown, Big-O Time & Space Complexity, bug detection, improved optimized code, and dry-run execution trace.
7. **Personalized AI Study Planner & Timetable**:
   - Computes daily task allocations based on upcoming exam dates and daily hours.
   - Checkable daily tasks with automatic **"Reschedule Missed Tasks"** if an item is overdue.
8. **Progress Analytics & Weakness Detection**:
   - Weekly study time distribution chart and subject mastery progress bars.
   - Automated weak topic alerts with direct 1-click **"Start Revision"** buttons.
9. **Smart Revision Center**:
   - Aggregates cards and topics **Due Today** for immediate review before memory decay.
10. **Pomodoro Focus Timer & RPG Gamification**:
    - Integrated Pomodoro timer (25/5, 50/10, Custom) that automatically records focused minutes into analytics.
    - XP system with 5 RPG ranks (*Beginner → Learner → Scholar → Expert → Master*), milestone badges, and celebratory confetti!
11. **Global Search (`Ctrl+K`) & Notification Center**:
    - Real-time search across documents, notes, flashcards, and quizzes.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js REST API, Multer file parser, JWT, Bcrypt.
- **Database**: PostgreSQL schema architecture (`server/src/db/schema.sql`) with dual support for local persistent JSON store (`server/data/store.json`) and direct PostgreSQL connection via `DATABASE_URL`.
- **AI Service**: Modular engine with pluggable support for `GEMINI_API_KEY` or `OPENAI_API_KEY`, backed by an intelligent built-in semantic extractor so the entire application works seamlessly out-of-the-box.

---

## 🚀 Quickstart Guide

### 1. Launch Backend Server (Port 5000)
```powershell
cd server
npm install
npm run build
node dist/index.js
```

### 2. Launch Client Web Application (Port 5173)
```powershell
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Instant 1-Click Test Drive
On the landing page or login screen, click **"1-Click Test Drive"** or **"Instant Test Drive as Alex Rivera"** to immediately explore the pre-populated dashboard with active college subjects (Data Structures, Operating Systems, DBMS, Computer Networks), flashcard decks, study plan tasks, and weak topic alerts!

---

## 📁 Database Architecture

The PostgreSQL schema is defined in [`server/src/db/schema.sql`](file:///C:/Users/LENOVO/.gemini/antigravity-ide/scratch/ai-study-assistant/server/src/db/schema.sql):
- `users`: student profiles, XP, level, streak
- `user_settings`: daily study target, subjects, themes
- `documents`: indexed materials and chunks
- `notes`: AI notes with format type and key takeaways
- `flashcards` & `flashcard_decks`: spaced repetition interval, repetition count, easiness factor
- `quizzes`, `quiz_questions`, `quiz_attempts`: questions, answers, accuracy, weak topic identification
- `study_plans` & `study_tasks`: daily schedule, priority, completion
- `study_sessions`: Pomodoro logs and focus duration
- `topics` & `topic_mastery`: mastery percentages and weakness flags
