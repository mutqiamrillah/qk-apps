"use client";

import React from "react";
import { Plus } from "lucide-react";
import { AppTheme } from "@/lib/types";

export type NavTab = "home" | "study" | "search" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  theme?: AppTheme;
  isLoggedIn?: boolean;
  onTabChange: (tab: NavTab) => void;
  onNewNoteClick: () => void;
  showFab?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  theme = "light",
  isLoggedIn = false,
  onTabChange,
  onNewNoteClick,
  showFab = true,
}) => {
  // Tombol + TIDAK BOLEH tampil jika:
  // 1. User belum login (!isLoggedIn)
  // 2. Sedang berada di tab profile (activeTab === "profile")
  // 3. showFab bernilai false
  const canShowFab = Boolean(showFab && isLoggedIn && activeTab !== "profile");

  const navContainerClasses = {
    light: "bg-white/95 border-t border-slate-100",
    sepia: "bg-[#faf6ee]/95 border-t border-[#ebdcc7]",
    dark: "bg-[#0a231e]/95 border-t border-[#16443b]",
    kyutsii: "bg-[#fff5f8]/95 border-t border-[#fbcfe8]",
  }[theme];

  const activeTabClasses = {
    light: "text-emerald-800 font-bold",
    sepia: "text-amber-800 font-bold",
    dark: "text-emerald-300 font-bold",
    kyutsii: "text-pink-600 font-bold",
  }[theme];

  const inactiveTabClasses = {
    light: "text-slate-400 hover:text-slate-600 font-medium",
    sepia: "text-[#8d7760] hover:text-[#5c462f] font-medium",
    dark: "text-emerald-600/70 hover:text-emerald-300 font-medium",
    kyutsii: "text-pink-400/80 hover:text-pink-600 font-medium",
  }[theme];

  return (
    <>
      {/* Floating Action Button (+) */}
      {canShowFab && (
        <button
          onClick={onNewNoteClick}
          className={`fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full text-white flex items-center justify-center text-3xl shadow-xl hover:scale-105 active:scale-95 transition-all ${
            theme === "kyutsii"
              ? "bg-[#ec4899] shadow-pink-500/25"
              : theme === "sepia"
              ? "bg-[#8c5a2b] shadow-amber-900/25"
              : "bg-[#134e43] shadow-emerald-950/20"
          }`}
          title="Buat Catatan Baru"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      )}

      {/* Bottom Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md max-w-[480px] mx-auto transition-colors duration-200 ${navContainerClasses}`}>
        <div className="flex items-center justify-around py-2.5 px-4">
          {/* Home */}
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "home" ? activeTabClasses : inactiveTabClasses
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[11px]">Home</span>
          </button>

          {/* Study */}
          <button
            onClick={() => onTabChange("study")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "study" ? activeTabClasses : inactiveTabClasses
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="text-[11px]">Study</span>
          </button>

          {/* Search */}
          <button
            onClick={() => onTabChange("search")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "search" ? activeTabClasses : inactiveTabClasses
            }`}
          >
            <span className="text-xl">🔍</span>
            <span className="text-[11px]">Search</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "profile" ? activeTabClasses : inactiveTabClasses
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-[11px]">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
