"use client";

import React, { useState } from "react";
import { NoteItem, AppTheme, formatFullDateTime, calculateReadingStats } from "@/lib/types";
import { LogIn, Pin, Clock, User, Tag, Star } from "lucide-react";

interface RecentNotesProps {
  notes: NoteItem[];
  theme?: AppTheme;
  isLoggedIn?: boolean;
  onSelectNote: (note: NoteItem) => void;
  onSeeAllClick?: () => void;
  onLoginClick?: () => void;
  onTogglePin?: (note: NoteItem) => void;
  onToggleFavorite?: (note: NoteItem) => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({
  notes,
  theme = "light",
  isLoggedIn = false,
  onSelectNote,
  onSeeAllClick,
  onLoginClick,
  onTogglePin,
  onToggleFavorite,
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "favorite" | "draft" | "archived">("all");
  const [activeFilter, setActiveFilter] = useState<{
    type: "all" | "speaker" | "tag";
    value: string;
  }>({ type: "all", value: "" });

  // Ekstrak pembicara dan tag unik secara dinamis
  const speakers = Array.from(
    new Set(notes.map((n) => n.speaker).filter(Boolean))
  ) as string[];

  const popularTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []).filter(Boolean))
  ).slice(0, 8);

  // Sort notes: pinned notes always at top
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });

  const displayNotes = sortedNotes.filter((note) => {
    // Status filter
    if (statusFilter === "favorite" && !note.is_favorite) return false;
    if (statusFilter === "draft" && note.status !== "Draft") return false;
    if (statusFilter === "archived" && note.status !== "Archived") return false;

    // Speaker / tag filter
    if (activeFilter.type === "speaker") {
      return note.speaker === activeFilter.value;
    }
    if (activeFilter.type === "tag") {
      return note.tags?.includes(activeFilter.value);
    }
    return true;
  });

  const sectionTitleClasses = {
    light: "text-slate-900",
    sepia: "text-[#423120]",
    dark: "text-white",
    kyutsii: "text-[#4a152b]",
  }[theme];

  const cardBaseClasses = {
    light: "bg-white border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-300 text-slate-900",
    sepia: "bg-[#faf6ee] border-[#ebdcc7] shadow-sm hover:border-amber-400 text-[#423120]",
    dark: "bg-[#0e2c26] border-[#17443b] shadow-sm hover:border-emerald-500 text-white",
    kyutsii: "bg-[#fff9fb] border-[#fbcfe8] shadow-sm hover:border-pink-400 text-[#4a152b]",
  }[theme];

  const emptyBoxClasses = {
    light: "bg-slate-50/80 border-slate-200 text-slate-700",
    sepia: "bg-[#f3ebd9]/60 border-[#e2d5bd] text-[#5c462f]",
    dark: "bg-[#0b231e] border-[#16443b] text-[#d1e5df]",
    kyutsii: "bg-[#ffe4ee]/60 border-[#f9b8d0] text-[#831843]",
  }[theme];

  return (
    <section className="px-5 mt-5 pb-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className={`text-base font-bold ${sectionTitleClasses}`}>Recent notes</h2>
        {onSeeAllClick && notes.length > 0 && (
          <button
            onClick={onSeeAllClick}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            See all
          </button>
        )}
      </div>

      {/* Filter Chips Bar (Semua, Status, Pembicara, Tag) */}
      {notes.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-1">
          <button
            onClick={() => {
              setStatusFilter("all");
              setActiveFilter({ type: "all", value: "" });
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 shrink-0 ${
              statusFilter === "all" && activeFilter.type === "all"
                ? theme === "kyutsii"
                  ? "bg-[#ec4899] text-white shadow-sm"
                  : "bg-[#134e43] text-white shadow-sm"
                : theme === "dark"
                ? "bg-[#0f342d] text-emerald-200 border border-[#1d5247]"
                : theme === "sepia"
                ? "bg-[#f3ebd9] text-[#5c462f] border border-[#e2d5bd]"
                : theme === "kyutsii"
                ? "bg-[#ffe4ee] text-[#831843] border border-[#f9b8d0]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({notes.length})
          </button>

          {/* Quick Filter: Favorit */}
          <button
            onClick={() => setStatusFilter(statusFilter === "favorite" ? "all" : "favorite")}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition active:scale-95 shrink-0 ${
              statusFilter === "favorite"
                ? "bg-amber-500 text-white shadow-sm font-bold ring-1 ring-amber-300"
                : theme === "dark"
                ? "bg-[#0f342d] text-amber-300 border border-[#1d5247]"
                : theme === "sepia"
                ? "bg-[#f3ebd9] text-amber-800 border border-[#e2d5bd]"
                : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span>⭐</span>
            <span>Favorit ({notes.filter((n) => n.is_favorite).length})</span>
          </button>

          {/* Quick Filter: Draf */}
          {notes.some((n) => n.status === "Draft") && (
            <button
              onClick={() => setStatusFilter(statusFilter === "draft" ? "all" : "draft")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition active:scale-95 shrink-0 ${
                statusFilter === "draft"
                  ? "bg-teal-700 text-white shadow-sm font-bold"
                  : theme === "dark"
                  ? "bg-[#0f342d] text-teal-300 border border-[#1d5247]"
                  : theme === "sepia"
                  ? "bg-[#f3ebd9] text-teal-800 border border-[#e2d5bd]"
                  : "bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100"
              }`}
            >
              <span>📝</span>
              <span>Draf ({notes.filter((n) => n.status === "Draft").length})</span>
            </button>
          )}

          {/* Quick Filter: Arsip */}
          {notes.some((n) => n.status === "Archived") && (
            <button
              onClick={() => setStatusFilter(statusFilter === "archived" ? "all" : "archived")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition active:scale-95 shrink-0 ${
                statusFilter === "archived"
                  ? "bg-slate-700 text-white shadow-sm font-bold"
                  : theme === "dark"
                  ? "bg-[#0f342d] text-slate-300 border border-[#1d5247]"
                  : theme === "sepia"
                  ? "bg-[#f3ebd9] text-slate-700 border border-[#e2d5bd]"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              <span>📦</span>
              <span>Arsip ({notes.filter((n) => n.status === "Archived").length})</span>
            </button>
          )}

          {speakers.map((spk) => {
            const isSelected = activeFilter.type === "speaker" && activeFilter.value === spk;
            return (
              <button
                key={spk}
                onClick={() =>
                  setActiveFilter(
                    isSelected ? { type: "all", value: "" } : { type: "speaker", value: spk }
                  )
                }
                className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 transition active:scale-95 shrink-0 ${
                  isSelected
                    ? theme === "kyutsii"
                      ? "bg-[#ec4899] text-white shadow-sm font-bold"
                      : "bg-[#134e43] text-white shadow-sm font-bold"
                    : theme === "dark"
                    ? "bg-[#0f342d] text-emerald-200 border border-[#1d5247]"
                    : theme === "sepia"
                    ? "bg-[#f3ebd9] text-[#5c462f] border border-[#e2d5bd]"
                    : theme === "kyutsii"
                    ? "bg-[#ffe4ee] text-[#831843] border border-[#f9b8d0]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>👤</span>
                <span>{spk}</span>
              </button>
            );
          })}

          {popularTags.map((tag) => {
            const isSelected = activeFilter.type === "tag" && activeFilter.value === tag;
            return (
              <button
                key={tag}
                onClick={() =>
                  setActiveFilter(
                    isSelected ? { type: "all", value: "" } : { type: "tag", value: tag }
                  )
                }
                className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 transition active:scale-95 shrink-0 ${
                  isSelected
                    ? theme === "kyutsii"
                      ? "bg-pink-600 text-white shadow-sm font-bold"
                      : "bg-emerald-700 text-white shadow-sm font-bold"
                    : theme === "dark"
                    ? "bg-[#0b2923] text-emerald-300 border border-[#194c40]"
                    : theme === "sepia"
                    ? "bg-[#efe5d2] text-amber-900 border border-[#dbcbb2]"
                    : theme === "kyutsii"
                    ? "bg-[#ffd9e8] text-[#9d174d] border border-[#f9b8d0]"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                }`}
              >
                <span>#{tag}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Note List */}
      <div className="space-y-3">
        {displayNotes.length === 0 ? (
          <div className={`text-center py-10 px-4 rounded-3xl border border-dashed ${emptyBoxClasses}`}>
            <span className="text-3xl block mb-2">📖</span>
            {!isLoggedIn ? (
              <>
                <p className="text-sm font-bold">
                  Belum ada catatan
                </p>
                <p className="text-xs opacity-75 mt-1 max-w-xs mx-auto leading-relaxed">
                  Catatan disimpan berdasarkan akun penulisnya. Silakan masuk atau daftar terlebih dahulu.
                </p>
                {onLoginClick && (
                  <button
                    onClick={onLoginClick}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                )}
              </>
            ) : notes.length === 0 ? (
              <>
                <p className="text-sm font-bold">
                  Belum ada catatan tersimpan
                </p>
                <p className="text-xs opacity-60 mt-1">
                  Tekan tombol + di kanan bawah untuk membuat rangkuman baru.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold">
                  Tidak ada catatan yang cocok
                </p>
                <p className="text-xs opacity-60 mt-1">
                  Coba pilih filter lain atau ketuk &quot;Semua&quot;.
                </p>
              </>
            )}
          </div>
        ) : (
          displayNotes.map((note) => {
            const formattedDate = formatFullDateTime(note.date, note.created_at);
            const readingStats = calculateReadingStats(note.content || "");

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${cardBaseClasses} ${
                  note.is_pinned
                    ? theme === "dark"
                      ? "border-amber-400/50 bg-[#143a32]"
                      : theme === "sepia"
                      ? "border-amber-400 bg-[#f7eedc]"
                      : "border-amber-300/80 bg-amber-50/20 shadow-[0_2px_10px_rgba(245,158,11,0.08)]"
                    : ""
                }`}
              >
                {/* Book Icon with Soft Peach Background */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform ${
                    note.is_pinned
                      ? "bg-amber-100 border border-amber-300 text-amber-900"
                      : "bg-[#fed7aa]/35 border border-amber-200/40 text-amber-900"
                  }`}
                >
                  {note.is_pinned ? "📌" : "📖"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-14">
                  <div className="flex items-center gap-1.5">
                    {note.is_favorite && <span className="text-amber-500 text-xs shrink-0">⭐</span>}
                    <h3 className="text-sm font-bold truncate">
                      {note.title || "Untitled"}
                    </h3>
                  </div>

                  {/* Category & Speaker */}
                  <p className="text-xs opacity-75 mt-0.5 truncate">
                    {[note.category || "Lectures", note.speaker].filter(Boolean).join(" · ")}
                  </p>

                  {/* Timestamp with seconds precision */}
                  {formattedDate && (
                    <div className="flex items-center gap-1 text-[11px] opacity-65 mt-1 font-mono">
                      <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{formattedDate}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {note.is_pinned && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        📌 Disematkan
                      </span>
                    )}
                    <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {note.status === "Online" ? "Posted" : note.status || "Posted"}
                    </span>
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      ⏱️ {readingStats.minutes} mnt
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <span className="text-[10px] text-emerald-600 font-medium truncate">
                        #{note.tags[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons (Pin & Favorite) */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(note);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-90 ${
                        note.is_favorite
                          ? "text-amber-500 bg-amber-100 hover:bg-amber-200"
                          : "opacity-40 group-hover:opacity-100 hover:bg-black/5"
                      }`}
                      title={note.is_favorite ? "Hapus dari Favorit" : "Simpan ke Favorit (⭐)"}
                    >
                      <Star className={`w-3.5 h-3.5 ${note.is_favorite ? "fill-amber-400 text-amber-500" : ""}`} />
                    </button>
                  )}
                  {onTogglePin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(note);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-90 ${
                        note.is_pinned
                          ? "text-amber-600 bg-amber-100 hover:bg-amber-200"
                          : "opacity-40 group-hover:opacity-100 hover:bg-black/5"
                      }`}
                      title={note.is_pinned ? "Lepas Sematan (Unpin)" : "Sematkan Catatan (Pin)"}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.is_pinned ? "fill-amber-500" : ""}`} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
