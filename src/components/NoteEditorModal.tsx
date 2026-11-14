"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Sparkles } from "lucide-react";
import { CategoryItem, NoteItem } from "@/lib/types";

interface NoteEditorModalProps {
  isOpen: boolean;
  noteToEdit: NoteItem | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (note: NoteItem) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  noteToEdit,
  categories,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Lectures");
  const [speaker, setSpeaker] = useState("");
  const [episodeNo, setEpisodeNo] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"Online" | "Draft">("Online");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || "");
      setCategory(noteToEdit.category || "Lectures");
      setSpeaker(noteToEdit.speaker || "");
      setEpisodeNo(noteToEdit.episode_no || "");
      setTagsStr((noteToEdit.tags || []).join(", "));
      setContent(noteToEdit.content || "");
      setStatus(noteToEdit.status === "Draft" ? "Draft" : "Online");
    } else {
      setTitle("");
      setCategory("Lectures");
      setSpeaker("");
      setEpisodeNo("");
      setTagsStr("");
      setContent("");
      setStatus("Online");
    }
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInsertSnippet = (type: "arabic" | "subheading" | "translation") => {
    let snippet = "";
    if (type === "arabic") {
      snippet = "\n\n:::arabic\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n:::\n";
    } else if (type === "subheading") {
      snippet = "\n\n### 1. Poin Pembahasan Baru\n";
    } else if (type === "translation") {
      snippet = '\n\n*Artinya: “Tuliskan terjemahan atau kutipan di sini...”*\n';
    }
    setContent((prev) => prev + snippet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const updatedNote: NoteItem = {
      id: noteToEdit ? noteToEdit.id : `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      category,
      speaker: speaker.trim() || undefined,
      episode_no: episodeNo.trim() || undefined,
      tags,
      status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content,
      created_at: noteToEdit?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(updatedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {noteToEdit ? "Edit Catatan" : "Catatan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Catatan / Kajian *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: 268 | Tadzkaratus Saami'"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Category & Episode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Episode / Seri
              </label>
              <input
                type="text"
                value={episodeNo}
                onChange={(e) => setEpisodeNo(e.target.value)}
                placeholder="Contoh: No. 268 / Eps #5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Speaker / Pemateri & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pemateri / Ustadz / Podcast
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Contoh: Ustadz Nuzul Dzikri"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (Pisahkan koma)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="sabar, tazkiyah, adab"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Snippet Helper Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sisipkan Format Cepat</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleInsertSnippet("arabic")}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition"
              >
                + Teks Arab (Ayat / Hadits)
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet("translation")}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold hover:bg-amber-100 transition"
              >
                + Terjemahan / Kutipan
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet("subheading")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 transition"
              >
                + Sub-Judul
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Isi Rangkuman / Catatan *
            </label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan intisari ceramah, faidah ilmu, poin-poin penting, atau doa di sini..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Online">Online</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

