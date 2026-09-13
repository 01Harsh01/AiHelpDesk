import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StudyProvider, useStudy } from "./context/StudyContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MobileNav } from "./components/layout/MobileNav";
import { SearchModal } from "./components/layout/SearchModal";
import { PomodoroModal } from "./components/pomodoro/PomodoroModal";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotesPage } from "./pages/NotesPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { QuizPage } from "./pages/QuizPage";
import { DocChatPage } from "./pages/DocChatPage";
import { RevisionPage } from "./pages/RevisionPage";
import { TutorPage } from "./pages/TutorPage";
import { CodeTutorPage } from "./pages/CodeTutorPage";
import { PlannerPage } from "./pages/PlannerPage";
import { LibraryPage } from "./pages/LibraryPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>("landing");

  useEffect(() => {
    // If user is already authenticated, go to dashboard
    if (!loading && user && (currentPage === "landing" || currentPage === "login" || currentPage === "signup")) {
      setCurrentPage("dashboard");
    }
  }, [user, loading]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e15] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading EduMind AI...</span>
        </div>
      </div>
    );
  }

  // Public / Auth Pages
  if (currentPage === "landing") {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "login") {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "signup") {
    return <SignupPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "onboarding") {
    return <OnboardingPage onNavigate={handleNavigate} />;
  }

  // Protected App Shell with Sidebar, Header & MobileNav
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0d0e15] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header onNavigate={handleNavigate} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === "dashboard" && <DashboardPage onNavigate={handleNavigate} />}
          {currentPage === "notes" && <NotesPage />}
          {currentPage === "flashcards" && <FlashcardsPage />}
          {currentPage === "quiz" && <QuizPage onNavigate={handleNavigate} />}
          {currentPage === "docchat" && <DocChatPage onNavigate={handleNavigate} />}
          {currentPage === "revision" && <RevisionPage onNavigate={handleNavigate} />}
          {currentPage === "tutor" && <TutorPage />}
          {currentPage === "codetutor" && <CodeTutorPage />}
          {currentPage === "planner" && <PlannerPage />}
          {currentPage === "library" && <LibraryPage onNavigate={handleNavigate} />}
          {currentPage === "analytics" && <AnalyticsPage onNavigate={handleNavigate} />}
          {currentPage === "settings" && <SettingsPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Global Modals */}
      <SearchModal onNavigate={handleNavigate} />
      <PomodoroModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <MainApp />
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
