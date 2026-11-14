"use client";

import React from "react";
import { MessageSquare, Download, X, ChevronDown } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface HeaderProps {
  user: UserProfile;
  currentCategoryTitle?: string;
  onProfileClick: () => void;
  onSearchClick: () => void;
  onDownloadClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentCategoryTitle = "Lecture Notes",
  onProfileClick,
  onSearchClick,
  onDownloadClick,
}) => {
  return (
    <header className="pt-3 pb-4 px-5 bg-white">
      {/* Top action bar */}
      <div className="flex items-center justify-between text-slate-700 mb-6">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition">
          <span className="text-base">📑</span>
          <span>{currentCategoryTitle}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="Search"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={onDownloadClick}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="Export / Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onProfileClick}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="Close / Account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Greeting row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Assalamu’alaikum, {user.name}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-emerald-700 font-medium text-sm mt-1 flex items-center gap-1.5">
            Semoga Allah mudahkan <span className="text-rose-500">💖</span>
          </p>
        </div>

        {/* Du'a avatar pill */}
        <button
          onClick={onProfileClick}
          className="w-12 h-12 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center text-xl shadow-md hover:scale-105 active:scale-95 transition"
          title="Akun & Profil"
        >
          🤲
        </button>
      </div>
    </header>
  );
};

