"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Database,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { UserProfile, NoteItem, AppTheme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/theme";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface ProfileViewProps {
  user: UserProfile;
  notes: NoteItem[];
  theme?: AppTheme;
  isPasswordRecovery?: boolean;
  initialAuthError?: string | null;
  onClearInitialAuthError?: () => void;
  onPasswordRecoveryComplete?: () => void;
  onUserChange: (user: UserProfile) => void;
  onLogout: () => void;
  onImportNotes?: (importedNotes: NoteItem[]) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  notes,
  theme = "light",
  isPasswordRecovery = false,
  initialAuthError = null,
  onClearInitialAuthError,
  onPasswordRecoveryComplete,
  onUserChange,
  onLogout,
  onImportNotes,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string>("");
  // Auth Tab: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Password recovery state (after clicking email reset link)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState("");

  React.useEffect(() => {
    if (initialAuthError) {
      setAuthError(initialAuthError);
      onClearInitialAuthError?.();
    }
  }, [initialAuthError, onClearInitialAuthError]);

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
    if (typeof window !== "undefined") {
      localStorage.setItem("qk_saved_avatar", emoji);
      if (user.id) {
        localStorage.setItem(`qk_user_avatar_${user.id}`, emoji);
      }
    }
    await onUserChange(updated);
    setShowEmojiPicker(false);
  };

  // --- HANDLE AUTH (SIGNUP / LOGIN / FORGOT PASSWORD) ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      if (authMode === "forgot") {
        if (!cleanEmail) {
          throw new Error("Please enter your email address.");
        }
        if (isSupabaseConfigured && supabase) {
          const redirectTo =
            typeof window !== "undefined" ? window.location.origin : undefined;
          const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo,
          });
          if (error) throw error;
          setAuthSuccess(
            "If an account exists for that email, a password reset link has been sent. Please check your inbox."
          );
        } else {
          setAuthError(
            "Password reset via email is only available when Supabase Cloud is connected."
          );
        }
        return;
      }

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
            setAuthSuccess("Account created! Welcome.");
          } else if (data.user) {
            // Jika konfirmasi email aktif di Supabase
            setAuthSuccess(
              "Account created! Please check your email inbox to confirm, then sign in."
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
            setAuthSuccess("Signed in successfully!");
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
        setAuthSuccess("Signed in successfully!");
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // --- HANDLE UPDATE PASSWORD (FROM RECOVERY LINK) ---
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoverySuccess("");

    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedNew.length < 6) {
      setRecoveryError("Password must be at least 6 characters.");
      return;
    }
    if (trimmedNew !== trimmedConfirm) {
      setRecoveryError("Passwords do not match.");
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setRecoveryError("Supabase is not configured.");
      return;
    }

    setRecoveryLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: trimmedNew,
      });
      if (error) throw error;

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      setNewPassword("");
      setConfirmPassword("");
      setRecoverySuccess("Password updated successfully! You can continue using your account.");
      setTimeout(() => {
        onPasswordRecoveryComplete?.();
      }, 1500);
    } catch (err: any) {
      setRecoveryError(err.message || "Failed to update password. Please request a new reset link.");
    } finally {
      setRecoveryLoading(false);
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

  // --- HANDLE BACKUP & RESTORE ---
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

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid backup file format.");
        }
        const validNotes: NoteItem[] = parsed.filter(
          (item: any) => item && item.id && item.title
        );
        if (validNotes.length === 0) {
          throw new Error("No valid notes found in this file.");
        }
        if (onImportNotes) {
          onImportNotes(validNotes);
        }
        setImportMessage(`✅ Successfully imported ${validNotes.length} notes!`);
        setTimeout(() => setImportMessage(""), 4000);
      } catch (err: any) {
        setImportMessage(`❌ ${err.message || "Failed to read backup file"}`);
        setTimeout(() => setImportMessage(""), 4500);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const styles = THEME_STYLES[theme];

  const titleTextClasses = {
    light: "text-slate-900",
    sepia: "text-[#423120]",
    dark: "text-white",
    kyutsii: "text-[#4a152b]",
  }[theme];

  const cardBaseClasses = {
    light: "bg-white border-slate-150 shadow-sm text-slate-900",
    sepia: "bg-[#faf6ee] border-[#ebdcc7] shadow-sm text-[#423120]",
    dark: "bg-[#0e2c26] border-[#17443b] shadow-sm text-white",
    kyutsii: "bg-[#fff9fb] border-[#fbcfe8] shadow-sm text-[#4a152b]",
  }[theme];

  return (
    <div className="p-5 pb-28">
      <h1 className={`text-2xl font-bold mb-4 ${titleTextClasses}`}>Profile</h1>

      {isPasswordRecovery ? (
        <div className={`rounded-3xl p-6 border shadow-sm mb-5 ${styles.modalBg}`}>
          <div className="text-center mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 ${styles.pillBadge}`}>
              🔑
            </div>
            <h2 className="text-lg font-bold">Set New Password</h2>
            <p className="text-xs opacity-70 mt-1">
              Enter a new password for your QK Notes account.
            </p>
          </div>

          {recoveryError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{recoveryError}</span>
            </div>
          )}

          {recoverySuccess && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${styles.badgeBg}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{recoverySuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onPasswordRecoveryComplete?.()}
                className="px-4 py-2.5 rounded-xl border border-black/10 opacity-80 hover:bg-black/5 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={recoveryLoading}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 ${styles.primaryBtn}`}
              >
                {recoveryLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      ) : !user.is_logged_in ? (
        /* --- TAMPILAN LOGIN / SIGNUP / FORGOT PASSWORD JIKA BELUM LOGIN --- */
        <div className={`rounded-3xl p-6 border ${cardBaseClasses}`}>
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner ${styles.pillBadge}`}>
              🤲
            </div>
            <h2 className="text-lg font-bold">
              {authMode === "forgot" ? "Reset Password" : "Account"}
            </h2>
            <p className="text-xs opacity-70 mt-1">
              {authMode === "forgot"
                ? "Enter your account email and we will send a password reset link."
                : "Sign in or create an account to keep your notes and streak safely synced."}
            </p>
          </div>

          {/* Tab Selector */}
          {authMode !== "forgot" && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
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
                Sign In
              </button>
              <button
                type="button"
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
                Sign Up
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${styles.badgeBg}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form Auth */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authMode === "signup" && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. QK"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
                />
              </div>
            </div>

            {authMode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold">
                    Password
                  </label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot");
                        setAuthError("");
                        setAuthSuccess("");
                      }}
                      className={`text-[11px] font-semibold hover:underline ${styles.accentText}`}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2 ${styles.primaryBtn}`}
            >
              {authLoading ? (
                <span>Processing...</span>
              ) : authMode === "signup" ? (
                <span>Create Account</span>
              ) : authMode === "forgot" ? (
                <span>Send Reset Link</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {authMode === "forgot" && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`w-full py-2 text-xs font-semibold hover:underline ${styles.accentText}`}
              >
                Back to Sign In
              </button>
            )}
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
          <div className={`rounded-3xl p-6 text-center border ${cardBaseClasses}`}>
            {/* Interactive Emoji Avatar */}
            <div className="relative inline-block mx-auto mb-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer relative group ${
                  theme === "kyutsii"
                    ? "bg-[#ec4899] text-pink-50"
                    : theme === "sepia"
                    ? "bg-[#8c5a2b] text-amber-100"
                    : "bg-[#134e43] text-amber-300"
                }`}
                title="Click to choose avatar"
              >
                <span>{user.avatar || "🤲"}</span>
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center text-xs">
                  ✏️
                </span>
              </button>
            </div>

            {/* Emoji Picker Grid */}
            {showEmojiPicker && (
              <div className="mb-5 p-4 bg-white rounded-2xl border border-slate-200 shadow-md animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800">
                    Choose Avatar
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelectAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition hover:scale-110 active:scale-95 ${
                        (user.avatar || "🤲") === emoji
                          ? `${styles.pillBadge} ring-2 ${theme === "kyutsii" ? "ring-pink-500" : theme === "sepia" ? "ring-[#8c5a2b]" : "ring-emerald-600"}`
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-xs opacity-70 mb-1">{user.email}</p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mt-2 ${styles.pillBadge}`}>
              <Sparkles className="w-3 h-3" />
              <span>Synced & Saved</span>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className={`p-3 rounded-2xl shadow-sm border ${
                theme === "dark"
                  ? "bg-[#0b231e] border-[#16443b]"
                  : theme === "sepia"
                  ? "bg-[#f3ebd9] border-[#e2d5bd]"
                  : theme === "kyutsii"
                  ? "bg-[#ffe4ee]/80 border-[#f9b8d0]"
                  : "bg-slate-50 border-slate-100"
              }`}>
                <div className={`text-2xl font-black ${theme === "kyutsii" ? "text-pink-600" : "text-emerald-700"}`}>
                  {user.streak_days}
                </div>
                <div className="text-[11px] opacity-70 font-medium">
                  Day Streak
                </div>
              </div>

              <div className={`p-3 rounded-2xl shadow-sm border ${
                theme === "dark"
                  ? "bg-[#0b231e] border-[#16443b]"
                  : theme === "sepia"
                  ? "bg-[#f3ebd9] border-[#e2d5bd]"
                  : theme === "kyutsii"
                  ? "bg-[#ffe4ee]/80 border-[#f9b8d0]"
                  : "bg-slate-50 border-slate-100"
              }`}>
                <div className={`text-2xl font-black ${theme === "kyutsii" ? "text-pink-600" : "text-emerald-700"}`}>
                  {notes.length}
                </div>
                <div className="text-[11px] opacity-70 font-medium">
                  Total Notes
                </div>
              </div>
            </div>
          </div>

          {/* Display Name Edit Card */}
          <div className={`rounded-3xl p-5 border ${cardBaseClasses}`}>
            <h3 className="text-xs font-bold opacity-80 mb-2">
              Display Name
            </h3>
            <form onSubmit={handleSaveName} className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={`flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 ${styles.ringFocus}`}
              />
              <button
                type="submit"
                disabled={nameSaving}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${styles.primaryBtn}`}
              >
                {nameSaving ? "..." : "Save"}
              </button>
            </form>
            {nameSaveSuccess && (
              <p className={`text-[11px] mt-2 flex items-center gap-1 ${styles.accentText}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Name updated successfully!
              </p>
            )}
          </div>

          {/* Backup & Restore & Logout Actions */}
          <div className="space-y-2 pt-2">
            {importMessage && (
              <div className="p-3 rounded-2xl bg-slate-100 text-xs font-semibold text-slate-800 animate-in fade-in text-center">
                {importMessage}
              </div>
            )}

            <button
              onClick={handleExportJSON}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Notes (Backup JSON)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${styles.hoverRow}`}
            >
              <Upload className={`w-4 h-4 ${styles.accentIcon}`} />
              <span>Import Notes (Restore JSON)</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

