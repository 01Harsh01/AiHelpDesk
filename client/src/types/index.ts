export interface User {
  id: string;
  name: string;
  email: string;
  education_level?: string;
  course_branch?: string;
  year_semester?: string;
  avatar_url?: string;
  xp: number;
  level: number;
  current_streak: number;
}

export interface UserSettings {
  theme: "dark" | "light";
  daily_study_target_minutes: number;
  learning_goals: string[];
  selected_subjects: string[];
  ai_model_preference?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  icon: string;
}

export interface Topic {
  id: string;
  subject_id?: string;
  name: string;
  mastery_percentage: number;
  is_weak_topic: boolean;
  last_reviewed_at?: string;
}

export interface DocumentItem {
  id: string;
  user_id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  extracted_text: string;
  chunk_count: number;
  summary: string;
  subject_name?: string;
  created_at: string;
}

export interface NoteItem {
  id: string;
  user_id: string;
  document_id?: string;
  subject_name: string;
  title: string;
  format_type: string;
  content_markdown: string;
  key_takeaways?: string[];
  tags?: string[];
  is_bookmarked?: boolean;
  created_at: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front_text: string;
  back_text: string;
  topic?: string;
  interval_days: number;
  repetition_count: number;
  easiness_factor: number;
  next_review_date: string;
  state: "new" | "learning" | "review";
  is_bookmarked?: boolean;
}

export interface FlashcardDeck {
  id: string;
  user_id: string;
  subject_name: string;
  title: string;
  description?: string;
  card_count: number;
  due_count?: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id?: string;
  question_text: string;
  question_type: "mcq" | "true_false" | "multi_select" | "short_answer";
  options: string[];
  correct_answer: string;
  explanation: string;
  topic?: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  subject_name: string;
  topic?: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  is_adaptive?: boolean;
  time_limit_minutes: number;
  question_count?: number;
  last_score?: number | null;
  last_accuracy?: number | null;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizAttemptResult {
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  gradedAnswers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    topic?: string;
  }>;
  weakTopicsIdentified: string[];
  xpEarned: number;
  newLevel?: number;
}

export interface StudyTask {
  id: string;
  user_id: string;
  subject_name: string;
  title: string;
  duration_minutes: number;
  scheduled_date: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  category: "revise" | "practice" | "flashcards" | "quiz";
}

export interface DashboardOverview {
  user: User;
  overview: {
    todayStudyMinutes: number;
    completedTasks: number;
    totalTasks: number;
    quizAccuracy: number;
    currentStreak: number;
    xp: number;
    level: number;
    dueFlashcards: number;
    weakTopicsCount: number;
  };
  continueLearning: Array<{
    id: string;
    title: string;
    type: string;
    progress: number;
    topic: string;
    lastAccessed: string;
    color: string;
  }>;
  todayStudyPlan: StudyTask[];
  aiRecommendation: {
    topic: string;
    masteryPercentage: number;
    headline: string;
    actionText: string;
    recommendedSubject: string;
  };
  weakTopics: Topic[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface CodeExplanation {
  summary: string;
  lineByLineExplanation: Array<{ lineRange: string; explanation: string }>;
  timeComplexity: string;
  spaceComplexity: string;
  bugsOrInefficiencies: string[];
  improvedCode: string;
  dryRunExample: string;
}
