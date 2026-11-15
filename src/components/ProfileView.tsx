"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { UserProfile, NoteItem } from "@/lib/types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface ProfileViewProps {
  user: UserProfile;
  notes: NoteItem[];
  onUserChange: (user: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  notes,
  onUserChange,
  onLogout,
}) => {
  // Auth Tab: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Edit Name & Avatar state
  const [editName, setEditName] = useState(user.name);
  const [nameSaveSuccess, setNameSaveSuccess] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const AVAILABLE_EMOJIS = [
    "🤲", "👳‍♂️", "🧕", "📖", "🌙", "🕌", "🌿", "⭐", 
    "🕊️", "☕", "🎓", "✍️", "💡", "🌸", "🛡️", "📜",
    "🕋", "✨", "🌻", "🌴", "🦁", "💎", "🎯", "🍵"
  ];

  const handleSelectAvatar = async (emoji: string) => {
    const updated = { ...user, avatar: emoji };
    onUserChange(updated);
    setShowEmojiPicker(false);
  };

  // --- HANDLE AUTH (SIGNUP / LOGIN) ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      if (isSupabaseConfigured && supabase) {
        if (authMode === "signup") {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: { name: fullName.trim() || "QK" },
            },
          });
          if (error) throw error;

          if (data.session && data.user) {
            // Jika konfirmasi email di-disable di Supabase, user langsung login
            const newUser: UserProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              name: fullName.trim() || data.user.user_metadata?.name || "QK",
              streak_days: 0,
              notes_count: notes.length,
              last_note_date: "",
              is_logged_in: true,
            };
            onUserChange(newUser);
            setAuthSuccess("Pendaftaran berhasil dan Anda sudah masuk!");
          } else if (data.user) {
            // Jika konfirmasi email aktif di Supabase
            setAuthSuccess(
              "Pendaftaran berhasil! Akun telah dibuat. Silakan periksa inbox email Anda untuk konfirmasi, lalu masuk via tab Login."
            );
            setAuthMode("login");
          }
        } else {
          // Login
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });
          if (error) throw error;

          if (data.user) {
            // Fetch profile from db
            const { data: dbProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .maybeSingle();

            const authedUser: UserProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              name: dbProfile?.name || data.user.user_metadata?.name || "QK",
              streak_days: dbProfile?.streak_days ?? 0,
              notes_count: dbProfile?.notes_count ?? notes.length,
              last_note_date: dbProfile?.last_note_date || "",
              is_logged_in: true,
            };
            onUserChange(authedUser);
            setAuthSuccess("Berhasil masuk!");
          }
        }
      } else {
        // Local Mode Simulation
        const localUser: UserProfile = {
          id: `user-${Date.now()}`,
          email: cleanEmail || "user@qk-notes.local",
          name: fullName.trim() || (cleanEmail ? cleanEmail.split("@")[0] : "QK"),
          streak_days: 0,
          notes_count: notes.length,
          last_note_date: "",
          is_logged_in: true,
        };
        onUserChange(localUser);
        setAuthSuccess("Berhasil masuk dalam mode lokal!");
      }
    } catch (err: any) {
      setAuthError(err.message || "Gagal memproses autentikasi");
    } finally {
      setAuthLoading(false);
    }
  };

  // --- HANDLE EDIT NAME ---
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setNameSaving(true);
    try {
      const updated = { ...user, name: editName.trim() };
      if (isSupabaseConfigured && supabase && user.is_logged_in) {
        await supabase
          .from("profiles")
          .update({ name: editName.trim(), updated_at: new Date().toISOString() })
          .eq("id", user.id);
      }
      onUserChange(updated);
      setNameSaveSuccess(true);
      setTimeout(() => setNameSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setNameSaving(false);
    }
  };

  // --- HANDLE BACKUP EXPORT ---
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

  return (
    <div className="p-5 pb-28">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile</h1>

      {!user.is_logged_in ? (
        /* --- TAMPILAN LOGIN / SIGNUP JIKA BELUM LOGIN --- */
        <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm">
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              🤲
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Akun QK Notes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Daftar atau masuk agar seluruh catatan dan streak tersimpan aman di database cloud.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
                setAuthSuccess("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                authMode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setAuthMode("signup");
                setAuthError("");
                setAuthSuccess("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                authMode === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daftar Baru (Sign Up)
            </button>
          </div>

          {/* Feedback Messages */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form Auth */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authMode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap / Panggilan
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: QK"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-bold transition shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span>Memproses...</span>
              ) : authMode === "signup" ? (
                <span>Daftar & Simpan ke Database</span>
              ) : (
                <span>Masuk Sekarang</span>
              )}
            </button>
          </form>

          {/* Database indicator */}
          {/* <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> Database:
            </span>
            <span className="font-semibold text-emerald-700">
              {isSupabaseConfigured ? "Supabase PostgreSQL Active" : "Local Database Mode"}
            </span>
          </div> */}
        </div>
      ) : (
        /* --- TAMPILAN JIKA SUDAH LOGIN --- */
        <div className="space-y-4">
          {/* User Card */}
          <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-150">
            {/* Interactive Emoji Avatar */}
            <div className="relative inline-block mx-auto mb-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-20 h-20 rounded-full bg-[#134e43] text-amber-300 flex items-center justify-center text-4xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
                title="Klik untuk mengganti avatar emoji"
              >
                <span>{user.avatar || "🤲"}</span>
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs group-hover:bg-emerald-50">
                  ✏️
                </span>
              </button>
            </div>

            {/* Emoji Picker Grid */}
            {showEmojiPicker && (
              <div className="mb-5 p-4 bg-white rounded-2xl border border-slate-200 shadow-md animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800">
                    Pilih Avatar Emoji
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Tutup
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelectAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition hover:bg-emerald-50 hover:scale-110 active:scale-95 ${
                        (user.avatar || "🤲") === emoji
                          ? "bg-emerald-100 ring-2 ring-emerald-600"
                          : "bg-slate-50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500 mb-1">{user.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-2">
              <Sparkles className="w-3 h-3" />
              <span>Tersimpan di Cloud Database</span>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-2xl font-black text-emerald-800">
                  {user.streak_days}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Hari Streak
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-2xl font-black text-emerald-800">
                  {notes.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Total Catatan
                </div>
              </div>
            </div>
          </div>

          {/* Ubah Nama Profil */}
          <div className="bg-white rounded-3xl p-5 border border-slate-150">
            <h3 className="text-xs font-bold text-slate-700 mb-2">
              Ubah Nama Panggilan
            </h3>
            <form onSubmit={handleSaveName} className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={nameSaving}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                {nameSaving ? "..." : "Simpan"}
              </button>
            </form>
            {nameSaveSuccess && (
              <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nama berhasil diperbarui di database!
              </p>
            )}
          </div>

          {/* Backup & Logout Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportJSON}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Cadangkan / Ekspor Catatan (JSON)</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun (Logout)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

