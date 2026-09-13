-- PostgreSQL Database Architecture for EduMind AI Study Assistant

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    education_level VARCHAR(100) DEFAULT 'College',
    course_branch VARCHAR(150),
    year_semester VARCHAR(50),
    avatar_url TEXT,
    xp INTEGER DEFAULT 120,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 5,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Preferences & Settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    daily_study_target_minutes INTEGER DEFAULT 90,
    learning_goals TEXT[] DEFAULT ARRAY['Improve GPA', 'Pass Exams'],
    selected_subjects TEXT[] DEFAULT ARRAY['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks'],
    ai_model_preference VARCHAR(50) DEFAULT 'gemini-1.5-pro',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_effects_enabled BOOLEAN DEFAULT TRUE
);

-- 3. Subjects & Topics
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    color VARCHAR(30) DEFAULT '#4f46e5',
    icon VARCHAR(50) DEFAULT 'book',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    mastery_percentage INTEGER DEFAULT 50,
    is_weak_topic BOOLEAN DEFAULT FALSE,
    last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Documents & Study Materials
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT,
    extracted_text TEXT NOT NULL,
    chunk_count INTEGER DEFAULT 1,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    subject_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    format_type VARCHAR(50) DEFAULT 'Detailed Notes', -- Quick Summary, Detailed, Exam Notes, Formula Sheet, etc.
    content_markdown TEXT NOT NULL,
    key_takeaways TEXT[],
    tags TEXT[],
    is_bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Flashcard Decks & Cards
CREATE TABLE IF NOT EXISTS flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    card_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    topic VARCHAR(100),
    interval_days INTEGER DEFAULT 1,
    repetition_count INTEGER DEFAULT 0,
    easiness_factor REAL DEFAULT 2.5,
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    state VARCHAR(20) DEFAULT 'new', -- new, learning, review
    is_bookmarked BOOLEAN DEFAULT FALSE
);

-- 7. Quizzes & Attempts
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    topic VARCHAR(150),
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    is_adaptive BOOLEAN DEFAULT FALSE,
    time_limit_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) DEFAULT 'mcq', -- mcq, true_false, multi_select, short_answer
    options JSONB NOT NULL, -- ["Option A", "Option B", ...]
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    topic VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    accuracy_percentage REAL NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    answers JSONB NOT NULL,
    weak_topics_identified TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Study Plans & Tasks
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_name VARCHAR(150),
    exam_date DATE,
    daily_allocated_minutes INTEGER DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    category VARCHAR(50) DEFAULT 'revision' -- revise, practice, flashcards, quiz
);

-- 9. Study Sessions & Pomodoro Logs
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    task_name VARCHAR(255),
    duration_minutes INTEGER NOT NULL,
    mode VARCHAR(30) DEFAULT 'pomodoro', -- pomodoro, custom, deep_work
    xp_awarded INTEGER DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AI Chat Conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    mode VARCHAR(50) DEFAULT 'doc_chat', -- doc_chat, tutor_learn, tutor_practice, tutor_exam, code_tutor
    title VARCHAR(255) DEFAULT 'New Study Session',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- user, ai
    message_text TEXT NOT NULL,
    citations JSONB, -- [{page: 1, text: "..."}]
    code_snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
