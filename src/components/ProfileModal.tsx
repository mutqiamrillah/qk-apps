"use client";

import React, { useState } from "react";
import { X, LogIn, LogOut, Database, Download, CheckCircle2 } from "lucide-react";
import { UserProfile, NoteItem } from "@/lib/types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface ProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  notes: NoteItem[];
  onClose: () => void;
  onOpenAuth: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  notes,
  onClose,
  onOpenAuth,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user.name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateUser({ ...user, name: name.trim() });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `qk-notes-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#134e43] text-amber-300 flex items-center justify-center text-3xl shadow-md mb-3">
            🤲
          </div>
          <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>

        {/* Database Status Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-700">Database Engine:</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isSupabaseConfigured
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isSupabaseConfigured ? "Supabase Cloud" : "Local Database"}
          </span>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSaveProfile} className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Panggilan
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                Ubah
              </button>
            </div>
            {savedSuccess && (
              <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nama berhasil diperbarui!
              </p>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Cadangkan & Ekspor Catatan (JSON)</span>
          </button>

          {isSupabaseConfigured ? (
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Sign Out)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Sinkronkan Akun</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

