import React, { createContext, useContext, useState } from "react";
import confetti from "canvas-confetti";

interface StudyContextType {
  isPomodoroOpen: boolean;
  openPomodoro: () => void;
  closePomodoro: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  triggerCelebration: () => void;
  activeQuickModal: string | null;
  openQuickModal: (name: string) => void;
  closeQuickModal: () => void;
}

const StudyContext = createContext<StudyContextType>({
  isPomodoroOpen: false,
  openPomodoro: () => {},
  closePomodoro: () => {},
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
  triggerCelebration: () => {},
  activeQuickModal: null,
  openQuickModal: () => {},
  closeQuickModal: () => {},
});

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeQuickModal, setActiveQuickModal] = useState<string | null>(null);

  const openPomodoro = () => setIsPomodoroOpen(true);
  const closePomodoro = () => setIsPomodoroOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openQuickModal = (name: string) => setActiveQuickModal(name);
  const closeQuickModal = () => setActiveQuickModal(null);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"],
      });
    } catch (e) {}
  };

  return (
    <StudyContext.Provider
      value={{
        isPomodoroOpen,
        openPomodoro,
        closePomodoro,
        isSearchOpen,
        openSearch,
        closeSearch,
        triggerCelebration,
        activeQuickModal,
        openQuickModal,
        closeQuickModal,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);
