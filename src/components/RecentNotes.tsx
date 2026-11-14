"use client";

import React from "react";
import { NoteItem } from "@/lib/types";
import { LogIn } from "lucide-react";

interface RecentNotesProps {
  notes: NoteItem[];
  isLoggedIn?: boolean;
  onSelectNote: (note: NoteItem) => void;
  onSeeAllClick?: () => void;
  onLoginClick?: () => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({
  notes,
  isLoggedIn = false,
  onSelectNote,
  onSeeAllClick,
  onLoginClick,
}) => {
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
        {notes.length === 0 ? (
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
          notes.map((note) => {
            const metaParts = [note.category || "Lectures"];
            if (note.speaker) metaParts.push(note.speaker);
            if (note.date) metaParts.push(note.date);
            const subtitle = metaParts.join(" · ");

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-150/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
              >
                {/* Book Icon with Soft Peach Background */}
                <div className="w-12 h-12 rounded-2xl bg-[#fed7aa]/35 border border-amber-200/40 text-amber-900 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  📖
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {subtitle}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
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
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
