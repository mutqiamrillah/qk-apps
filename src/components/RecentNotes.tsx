"use client";

import React from "react";
import { NoteItem } from "@/lib/types";

interface RecentNotesProps {
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
  onSeeAllClick?: () => void;
}

export const RecentNotes: React.FC<RecentNotesProps> = ({
  notes,
  onSelectNote,
  onSeeAllClick,
}) => {
  return (
    <section className="px-5 mt-5 pb-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base font-bold text-slate-900">Recent notes</h2>
        {onSeeAllClick && (
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
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-3xl">📖</span>
            <p className="text-sm text-slate-500 font-medium mt-2">
              Belum ada catatan tersimpan
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Tekan tombol + di kanan bawah untuk membuat catatan baru.
            </p>
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

