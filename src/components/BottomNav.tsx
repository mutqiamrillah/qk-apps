"use client";

import React from "react";
import { Plus } from "lucide-react";

export type NavTab = "home" | "study" | "search" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  isLoggedIn?: boolean;
  onTabChange: (tab: NavTab) => void;
  onNewNoteClick: () => void;
  showFab?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
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

  return (
    <>
      {/* Floating Action Button (+) */}
      {canShowFab && (
        <button
          onClick={onNewNoteClick}
          className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-[#134e43] text-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all"
          title="Buat Catatan Baru"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      )}

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 max-w-[480px] mx-auto">
        <div className="flex items-center justify-around py-2.5 px-4">
          {/* Home */}
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "home"
                ? "text-emerald-800 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[11px]">Home</span>
          </button>

          {/* Study */}
          <button
            onClick={() => onTabChange("study")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "study"
                ? "text-emerald-800 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="text-[11px]">Study</span>
          </button>

          {/* Search */}
          <button
            onClick={() => onTabChange("search")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "search"
                ? "text-emerald-800 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <span className="text-xl">🔍</span>
            <span className="text-[11px]">Search</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === "profile"
                ? "text-emerald-800 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
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
