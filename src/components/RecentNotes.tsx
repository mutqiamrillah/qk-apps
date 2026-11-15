"use client";

import React from "react";
import { NoteItem } from "@/lib/types";
import { LogIn, Pin } from "lucide-react";

interface RecentNotesProps {
  notes: NoteItem[];
  isLoggedIn?: boolean;
  onSelectNote: (note: NoteItem) => void;
  onSeeAllClick?: () => void;
  onLoginClick?: () => void;
  onTogglePin?: (note: NoteItem) => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({
  notes,
  isLoggedIn = false,
  onSelectNote,
  onSeeAllClick,
  onLoginClick,
  onTogglePin,
}) => {
  // Sort notes: pinned notes always at top
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });
  return (
    <section className="px-5 mt-5 pb-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base font-bold text-slate-900">Recent notes</h2>
        {onSeeAllClick && notes.length > 0 && (
          <button
            onClick={onSeeAllClick}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            See all
          </button>
        )}
      </div>

      {/* Note List */}
      <div className="space-y-3">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/80 rounded-3xl border border-dashed border-slate-200">
            <span className="text-3xl block mb-2">📖</span>
            {!isLoggedIn ? (
              <>
                <p className="text-sm text-slate-700 font-bold">
                  Belum ada catatan
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
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
            ) : (
              <>
                <p className="text-sm text-slate-700 font-bold">
                  Belum ada catatan tersimpan
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Tekan tombol + di kanan bawah untuk membuat rangkuman baru.
                </p>
              </>
            )}
          </div>
        ) : (
          sortedNotes.map((note) => {
            const metaParts = [note.category || "Lectures"];
            if (note.speaker) metaParts.push(note.speaker);
            if (note.date) metaParts.push(note.date);
            const subtitle = metaParts.join(" · ");

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group relative flex items-start gap-3.5 p-4 rounded-2xl bg-white border transition-all cursor-pointer ${
                  note.is_pinned
                    ? "border-amber-300/80 bg-amber-50/20 shadow-[0_2px_10px_rgba(245,158,11,0.08)] hover:border-amber-400"
                    : "border-slate-150/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-300"
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
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {note.title || "Untitled"}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {subtitle}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {note.is_pinned && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        📌 Disematkan
                      </span>
                    )}
                    <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {note.status || "Online"}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <span className="text-[10px] text-emerald-600 font-medium truncate">
                        #{note.tags[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Pin Toggle Button */}
                {onTogglePin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(note);
                    }}
                    className={`absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-90 ${
                      note.is_pinned
                        ? "text-amber-600 bg-amber-100 hover:bg-amber-200"
                        : "text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-60 group-hover:opacity-100"
                    }`}
                    title={note.is_pinned ? "Lepas Sematan (Unpin)" : "Sematkan Catatan (Pin)"}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.is_pinned ? "fill-amber-500" : ""}`} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
