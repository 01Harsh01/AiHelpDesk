import React from "react";
import { LayoutDashboard, FolderOpen, Layers, Sparkles, BarChart3 } from "lucide-react";

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const items = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "library", label: "Library", icon: FolderOpen },
    { id: "flashcards", label: "Practice", icon: Layers },
    { id: "tutor", label: "AI Tutor", icon: Sparkles },
    { id: "analytics", label: "Progress", icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 dark:bg-[#0f111a]/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-2 z-40">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
              isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
