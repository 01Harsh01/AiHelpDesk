import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Sparkles,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCw,
  Award,
  BarChart2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import { Quiz, QuizQuestion, QuizAttemptResult, DocumentItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { useStudy } from "../context/StudyContext";

interface QuizPageProps {
  onNavigate: (page: string) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate }) => {
  const { addXPToUser } = useAuth();
  const { triggerCelebration } = useStudy();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Generator Modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [subjectName, setSubjectName] = useState("Operating Systems");
  const [topic, setTopic] = useState("Coffman Deadlocks & Prevention");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState("mcq");
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const [fetchedQuizzes, fetchedDocs] = await Promise.all([
        api.getQuizzes(),
        api.getDocuments(),
      ]);
      setQuizzes(fetchedQuizzes);
      setDocuments(fetchedDocs);
      if (fetchedDocs.length > 0) setSelectedDocId(fetchedDocs[0].id);

      if (fetchedQuizzes.length > 0 && !activeQuiz) {
        loadSpecificQuiz(fetchedQuizzes[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificQuiz = async (quizId: string) => {
    try {
      const qz = await api.getQuiz(quizId);
      setActiveQuiz(qz);
      setQuestions(qz.questions || []);
      setUserAnswers({});
      setFlaggedQuestions({});
      setAttemptResult(null);
      setIsQuizActive(false);
    } catch (e) {}
  };

  // Timer Countdown during quiz
  useEffect(() => {
    let timer: any = null;
    if (isQuizActive && timeLeftSeconds > 0 && !attemptResult) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isQuizActive && timeLeftSeconds === 0 && !attemptResult) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeftSeconds, attemptResult]);

  const startQuiz = () => {
    setIsQuizActive(true);
    setCurrentQIndex(0);
    setTimeLeftSeconds((activeQuiz?.time_limit_minutes || 10) * 60);
    setAttemptResult(null);
    setUserAnswers({});
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    const initialSeconds = (activeQuiz.time_limit_minutes || 10) * 60;
    const timeSpent = Math.max(10, initialSeconds - timeLeftSeconds);

    try {
      const result = await api.submitQuiz(activeQuiz.id, userAnswers, timeSpent);
      setAttemptResult(result);
      setIsQuizActive(false);
      if (result.xpEarned) {
        addXPToUser(result.xpEarned);
      }
      if (result.accuracyPercentage >= 75) {
        triggerCelebration();
      }
    } catch (e) {
      alert("Failed to submit quiz answers");
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateQuiz({
        documentId: selectedDocId,
        subjectName,
        topic,
        difficulty,
        questionCount,
        questionType,
        isAdaptive,
      });

      setQuizzes((prev) => [res.quiz, ...prev]);
      setActiveQuiz(res.quiz);
      setQuestions(res.questions);
      setUserAnswers({});
      setFlaggedQuestions({});
      setAttemptResult(null);
      setShowGenModal(false);
      startQuiz();
      triggerCelebration();
    } catch (err) {
      alert("Failed to generate quiz questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQ = questions[currentQIndex];
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Quiz & Adaptive Practice
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic questions tailored to your knowledge gaps with full post-test explanations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsAdaptive(true);
              setShowGenModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-400 border border-purple-500/20 text-xs font-bold transition-all"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Adaptive Practice Mode</span>
          </button>

          <button
            onClick={() => {
              setIsAdaptive(false);
              setShowGenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Quiz Workspace */}
      {isQuizActive && currentQ ? (
        /* ACTIVE QUIZ SCREEN */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Timer & Question Navigation Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? "bg-amber-500/10 border-amber-500 text-amber-500"
                    : "border-slate-300 dark:border-slate-700 text-slate-400"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? "Flagged" : "Flag"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
              <Clock className="w-4 h-4 animate-spin text-rose-500" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Question Palette Jumper */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = !!flaggedQuestions[q.id];
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all border ${
                    isCurrent
                      ? "ring-2 ring-indigo-500 bg-indigo-600 text-white"
                      : isFlagged
                      ? "bg-amber-500/20 border-amber-500 text-amber-400"
                      : isAnswered
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between text-xs text-indigo-500 font-bold uppercase tracking-wider">
              <span>Topic: {currentQ.topic || activeQuiz?.subject_name}</span>
              <span className="text-slate-400 font-normal">
                {currentQ.question_type.toUpperCase()}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question_text}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === opt;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectAnswer(currentQ.id, opt)}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-600/15 border-indigo-500 text-slate-900 dark:text-white shadow-md shadow-indigo-600/10 font-bold"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-400 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25"
                >
                  Submit Quiz Answers
                </button>
              )}
            </div>
          </div>
        </div>
      ) : attemptResult ? (
        /* QUIZ RESULT VIEW */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Overview Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 text-white shadow-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-300" />
              Quiz Performance Summary
            </div>

            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
              {attemptResult.score} / {attemptResult.totalQuestions}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-300 font-semibold">
              <span>Accuracy: {attemptResult.accuracyPercentage}%</span>
              <span>Time: {Math.round(attemptResult.timeSpentSeconds / 60)}m {attemptResult.timeSpentSeconds % 60}s</span>
              <span className="text-amber-400">+{attemptResult.xpEarned} XP Earned</span>
            </div>

            {attemptResult.weakTopicsIdentified && attemptResult.weakTopicsIdentified.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mt-2 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Weak Topics Detected: {attemptResult.weakTopicsIdentified.join(", ")}. Added to Revision Center!
                </span>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={startQuiz}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 shadow-md"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => onNavigate("revision")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Review Weak Topics
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Question-by-Question Detailed Review
            </h3>
            {attemptResult.gradedAnswers.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  item.isCorrect
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
                } space-y-2 text-xs`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">
                    Q{idx + 1}: {item.questionText}
                  </span>
                  {item.isCorrect ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px] pt-1">
                  <div>Your Answer: <strong className={item.isCorrect ? "text-emerald-500" : "text-rose-500"}>{item.userAnswer}</strong></div>
                  <div>Correct Answer: <strong className="text-emerald-500">{item.correctAnswer}</strong></div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
                  💡 <strong>Explanation</strong>: {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* QUIZ SELECTION / LOBBY */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => {
                loadSpecificQuiz(quiz.id);
                startQuiz();
              }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="text-indigo-500">{quiz.subject_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      quiz.difficulty === "hard"
                        ? "bg-rose-500/10 text-rose-400"
                        : quiz.difficulty === "medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Topic: {quiz.topic || "Core Principles"}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {quiz.time_limit_minutes || 10} min • {quiz.question_count || 5} Qs
                </span>
                <span className="font-bold text-indigo-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Generator Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-200">
                  {isAdaptive ? "Adaptive Practice Generator" : "Generate AI Quiz"}
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                From Study Material
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Count</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                >
                  <option value={5}>5 Qs</option>
                  <option value={10}>10 Qs</option>
                  <option value={20}>20 Qs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                >
                  <option value="mcq">MCQ</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>
            </div>

            {/* Adaptive Toggle Callout */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-purple-300">Adaptive Practice</div>
                <div className="text-[10px] text-slate-400">Boost questions on weak areas</div>
              </div>
              <input
                type="checkbox"
                checked={isAdaptive}
                onChange={(e) => setIsAdaptive(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Start Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
