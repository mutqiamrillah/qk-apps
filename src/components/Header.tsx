"use client";

import React, { useState } from "react";
import { LogOut, LogIn, Sun, Moon, BookOpen } from "lucide-react";
import { UserProfile, AppTheme } from "@/lib/types";

interface HeaderProps {
  user: UserProfile;
  theme?: AppTheme;
  onCycleTheme?: () => void;
  onLogout: () => void;
  onLoginClick?: () => void;
  onAvatarClick?: () => void;
  onOpenDailyWisdom?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  theme = "light",
  onCycleTheme,
  onLogout,
  onLoginClick,
  onAvatarClick,
  onOpenDailyWisdom,
}) => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const headerContainerClasses = {
    light: "bg-white border-b border-slate-100",
    sepia: "bg-[#faf6ee] border-b border-[#ebdcc7]",
    dark: "bg-[#0a231e] border-b border-[#16443b]",
  }[theme];

  const titleTextClasses = {
    light: "text-slate-900",
    sepia: "text-[#423120]",
    dark: "text-white",
  }[theme];

  const subTextClasses = {
    light: "text-emerald-700",
    sepia: "text-amber-800",
    dark: "text-emerald-300",
  }[theme];

  const themePillClasses = {
    light: "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100",
    sepia: "bg-[#f3ebd9] border-[#e2d5bd] text-[#5c462f] hover:bg-[#ebdcc7]",
    dark: "bg-[#0f342d] border-[#1d5247] text-emerald-200 hover:bg-[#16443b]",
  }[theme];

  const authPillClasses = {
    light: "bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/60",
    sepia: "bg-[#f3ebd9] hover:bg-rose-50 text-[#5c462f] hover:text-rose-600 border border-[#e2d5bd]",
    dark: "bg-[#0f342d] hover:bg-rose-900/40 text-emerald-200 hover:text-rose-400 border border-[#1d5247]",
  }[theme];

  return (
    <header className={`pt-3 pb-4 px-5 transition-colors duration-200 ${headerContainerClasses}`}>
      {/* Top action row: Theme toggle & Nasihat di kiri dan Logout/Login di kanan */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {onCycleTheme && (
            <button
              onClick={onCycleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition active:scale-95 shadow-sm ${themePillClasses}`}
              title={`Ubah Tema Tampilan (Saat ini: ${
                theme === "dark" ? "Malam" : theme === "sepia" ? "Sepia" : "Terang"
              })`}
            >
              {theme === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {theme === "sepia" && <BookOpen className="w-3.5 h-3.5 text-amber-700" />}
              {theme === "dark" && <Moon className="w-3.5 h-3.5 text-emerald-300" />}
              <span>
                {theme === "dark" ? "Malam" : theme === "sepia" ? "Sepia" : "Terang"}
              </span>
            </button>
          )}

          {onOpenDailyWisdom && (
            <button
              onClick={onOpenDailyWisdom}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition active:scale-95 shadow-sm ${themePillClasses}`}
              title="Lihat Nasihat Al-Qur'an & Hadits Hari Ini"
            >
              <span>✨</span>
              <span className="hidden sm:inline">Nasihat</span>
            </button>
          )}
        </div>

        <div>
          {user.is_logged_in ? (
            <button
              onClick={() => setShowConfirmLogout(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-semibold ${authPillClasses}`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            onLoginClick && (
              <button
                onClick={onLoginClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-semibold ${authPillClasses}`}
                title="Sign In / Register"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Greeting row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${titleTextClasses}`}>
            <span>
              {user.is_logged_in && user.name ? `Assalamu’alaikum, ${user.name}` : "Assalamu’alaikum"}
            </span>
            <span className="text-xl">👋</span>
          </h1>
          <p className={`font-medium text-sm mt-1 flex items-center gap-1.5 ${subTextClasses}`}>
            Semoga Allah mudahkan <span className="text-rose-500">💖</span>
          </p>
        </div>

        {/* Du'a avatar pill */}
        <button
          type="button"
          onClick={onAvatarClick || onLoginClick}
          className="w-12 h-12 rounded-full bg-[#134e43] text-amber-300 flex items-center justify-center text-2xl shadow-md select-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Klik untuk melihat profil / mengganti avatar"
        >
          {user.avatar || "🤲"}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl p-6 w-full max-w-xs shadow-xl animate-in fade-in zoom-in-95 border ${
            theme === "dark"
              ? "bg-[#0e2c26] border-[#1d5247] text-white"
              : theme === "sepia"
              ? "bg-[#faf6ee] border-[#e2d5bd] text-[#423120]"
              : "bg-white border-slate-100 text-slate-900"
          }`}>
            <h3 className="text-base font-bold mb-1.5">
              Sign Out?
            </h3>
            <p className="text-xs opacity-75 mb-5 leading-relaxed">
              Are you sure you want to sign out of {user.email || user.name}? Your notes will remain safely saved.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 hover:bg-black/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLogout(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
