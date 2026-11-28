"use client";

import React, { useState } from "react";
import { Search, X, Clock } from "lucide-react";
import { NoteItem, AppTheme, formatFullDateTime } from "@/lib/types";
import { THEME_STYLES } from "@/lib/theme";

interface SearchModalProps {
  isOpen: boolean;
  notes: NoteItem[];
  theme?: AppTheme;
  onClose: () => void;
  onSelectNote: (note: NoteItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  notes,
  theme = "light",
  onClose,
  onSelectNote,
}) => {
  const [query, setQuery] = useState("");
  const styles = THEME_STYLES[theme];

  if (!isOpen) return null;

  const filtered = notes.filter((n) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      (n.speaker && n.speaker.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.toLowerCase().includes(q)) ||
      n.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pt-12">
      <div className={`rounded-3xl border w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 ${styles.modalBg}`}>
        {/* Search Input Bar */}
        <div className="p-4 border-b border-black/10 flex items-center gap-3">
          <Search className="w-5 h-5 opacity-50 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, ustadz, ayat, atau tag (#sabar)..."
            autoFocus
            className="flex-1 text-sm bg-transparent focus:outline-none placeholder:opacity-50"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center opacity-70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 opacity-60 text-xs">
              Tidak ada catatan yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  onSelectNote(note);
                  onClose();
                }}
                className={`p-3 rounded-2xl border border-transparent transition cursor-pointer ${styles.hoverRow}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold truncate">
                    {note.title}
                  </h4>
                  <span className="text-[10px] opacity-60 shrink-0 ml-2 font-mono flex items-center gap-1">
                    <Clock className={`w-2.5 h-2.5 ${styles.accentIcon}`} />
                    <span>{formatFullDateTime(note.date, note.created_at)}</span>
                  </span>
                </div>
                <p className="text-xs opacity-70 mt-0.5 truncate">
                  {[note.category, note.speaker].filter(Boolean).join(" · ")}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${styles.badgeBg}`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

