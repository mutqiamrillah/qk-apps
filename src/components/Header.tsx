"use client";

import React, { useState } from "react";
import { LogOut, LogIn } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onLoginClick,
}) => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  return (
    <header className="pt-3 pb-4 px-5 bg-white border-b border-slate-50">
      {/* Top action row: Hanya menyisakan icon logout sesuai instruksi */}
      <div className="flex items-center justify-end mb-4">
        {user.is_logged_in ? (
          <button
            onClick={() => setShowConfirmLogout(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition text-xs font-semibold"
            title="Keluar dari akun (Logout)"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        ) : (
          onLoginClick && (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 transition text-xs font-semibold"
              title="Masuk / Daftar"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          )
        )}
      </div>

      {/* Greeting row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {user.is_logged_in && user.name ? `Assalamu’alaikum, ${user.name}` : "Assalamu’alaikum"}
            </span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-emerald-700 font-medium text-sm mt-1 flex items-center gap-1.5">
            Semoga Allah mudahkan <span className="text-rose-500">💖</span>
          </p>
        </div>

        {/* Du'a avatar pill */}
        <div
          className="w-12 h-12 rounded-full bg-[#134e43] text-amber-300 flex items-center justify-center text-2xl shadow-md select-none transition-transform hover:scale-105"
          title="QK Notes Avatar"
        >
          {user.avatar || "🤲"}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Keluar Akun?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Anda akan keluar dari akun {user.email || user.name}. Data catatan Anda tetap aman tersimpan di database.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLogout(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
