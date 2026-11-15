"use client";

import React, { useState } from "react";
import { Search, X, Clock } from "lucide-react";
import { NoteItem, formatFullDateTime } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  notes: NoteItem[];
  onClose: () => void;
  onSelectNote: (note: NoteItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  notes,
  onClose,
  onSelectNote,
}) => {
  const [query, setQuery] = useState("");

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
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, ustadz, ayat, atau tag (#sabar)..."
            autoFocus
            className="flex-1 text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
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
                className="p-3 rounded-2xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {note.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{formatFullDateTime(note.date, note.created_at)}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {[note.category, note.speaker].filter(Boolean).join(" · ")}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"
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

