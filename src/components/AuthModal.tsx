"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessNotice("");
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name: name || "QK" },
            },
          });
          if (error) throw error;

          if (data.user) {
            setSuccessNotice(
              "Pendaftaran berhasil! Cek email untuk verifikasi atau silakan masuk."
            );
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email || email,
              name: name || "QK",
              streak_days: 1,
              notes_count: 0,
            });
            setTimeout(() => onClose(), 1500);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          if (data.user) {
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || "QK",
              streak_days: 3,
              notes_count: 12,
            });
            onClose();
          }
        }
      } else {
        // Local Mode Authentication (Simulation)
        const localUser: UserProfile = {
          id: `local-user-${Date.now()}`,
          email: email || "user@qk-notes.local",
          name: name || (email ? email.split("@")[0] : "QK"),
          streak_days: 3,
          notes_count: 12,
        };
        onAuthSuccess(localUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal melakukan autentikasi");
    } finally {
      setLoading(false);
    }
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

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl mx-auto mb-2">
            🔐
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {isSignUp ? "Daftar Akun QK Notes" : "Masuk ke QK Notes"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simpan rangkuman kajian dan akses kapan saja di semua perangkat.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-bold transition shadow-md disabled:opacity-50 mt-2"
          >
            {loading
              ? "Memproses..."
              : isSignUp
              ? "Buat Akun Baru"
              : "Masuk Sekarang"}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="text-center mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
              setSuccessNotice("");
            }}
            className="text-xs text-emerald-800 font-semibold hover:underline"
          >
            {isSignUp
              ? "Sudah punya akun? Masuk di sini"
              : "Belum punya akun? Daftar gratis"}
          </button>
        </div>
      </div>
    </div>
  );
};

