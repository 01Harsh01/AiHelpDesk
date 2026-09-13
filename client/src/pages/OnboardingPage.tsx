import React, { useState } from "react";
import { Check, ArrowRight, BookOpen, Target, Clock, GraduationCap, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStudy } from "../context/StudyContext";

interface OnboardingPageProps {
  onNavigate: (page: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { triggerCelebration } = useStudy();

  const [step, setStep] = useState(1);
  const [studyType, setStudyType] = useState("College");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Data Structures & Algorithms",
    "Operating Systems",
    "DBMS",
  ]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Pass Exams with High Score",
    "Improve GPA",
  ]);
  const [dailyTime, setDailyTime] = useState("2 hours");

  const availableSubjects = [
    "Data Structures & Algorithms",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "Machine Learning & AI",
    "Software Engineering",
    "Discrete Mathematics",
    "Computer Architecture",
    "Cyber Security",
  ];

  const availableGoals = [
    "Pass Exams with High Score",
    "Improve GPA",
    "Prepare for Technical Placements",
    "Competitive Exam Preparation",
    "Master Complex Concepts",
    "Build Daily Study Habit",
  ];

  const handleSubjectToggle = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = () => {
    triggerCelebration();
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] flex flex-col justify-center items-center p-6 text-white relative">
      <div className="w-full max-w-xl">
        {/* Progress Bar Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span>{step === 1 ? "Study Type" : step === 2 ? "Subjects" : step === 3 ? "Goals" : "Schedule"}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
          {/* Step 1: What are you studying */}
          {step === 1 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">What are you studying?</h2>
              <p className="text-xs text-slate-400 mt-1">This helps tailor notes, quizzes, and difficulty levels.</p>

              <div className="grid grid-cols-1 gap-3 mt-6">
                {[
                  { id: "College", title: "College / University", desc: "Undergraduate or postgraduate degree" },
                  { id: "School", title: "School (9th - 12th Grade)", desc: "High school coursework and boards" },
                  { id: "Competitive", title: "Competitive Exams", desc: "GATE, GRE, JEE, UPSC, or Placement tests" },
                  { id: "Professional", title: "Professional Certification", desc: "AWS, Cloud, or Developer certifications" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setStudyType(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      studyType === item.id
                        ? "bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    {studyType === item.id && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Subjects */}
          {step === 2 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Select your active subjects</h2>
              <p className="text-xs text-slate-400 mt-1">Choose the primary topics you are studying this term.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 max-h-72 overflow-y-auto pr-1">
                {availableSubjects.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj);
                  return (
                    <div
                      key={subj}
                      onClick={() => handleSubjectToggle(subj)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{subj}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Learning Goals */}
          {step === 3 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">What are your learning goals?</h2>
              <p className="text-xs text-slate-400 mt-1">Our AI uses this to personalize daily tasks and recommendations.</p>

              <div className="grid grid-cols-1 gap-2.5 mt-6">
                {availableGoals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <div
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Daily Availability */}
          {step === 4 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Daily study availability</h2>
              <p className="text-xs text-slate-400 mt-1">How much time can you commit to focused learning each day?</p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: "30 minutes", desc: "Quick revision" },
                  { label: "1 hour", desc: "Balanced pace" },
                  { label: "2 hours", desc: "Recommended" },
                  { label: "3+ hours", desc: "Exam sprint" },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={() => setDailyTime(item.label)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                      dailyTime === item.label
                        ? "bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-600/15"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-200">{item.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch My Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
