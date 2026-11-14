"use client";

import React, { useState } from "react";
import { ChevronLeft, Trash2, Edit3, ChevronDown, Check } from "lucide-react";
import { NoteItem } from "@/lib/types";

interface NoteReaderProps {
  note: NoteItem;
  onBack: () => void;
  onDelete: (id: string) => void;
  onEdit: (note: NoteItem) => void;
}

export const NoteReader: React.FC<NoteReaderProps> = ({
  note,
  onBack,
  onDelete,
  onEdit,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xl">("normal");
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Parse custom format for Arabic verse blocks:
  // e.g. :::arabic\n[verse]\n:::
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(:::arabic[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      if (part.startsWith(":::arabic")) {
        const arabicText = part.replace(/:::arabic/g, "").replace(/:::/g, "").trim();
        return (
          <div
            key={index}
            className="my-5 p-4 pl-4 border-l-4 border-emerald-600 bg-emerald-50/30 rounded-r-2xl"
          >
            <div
              dir="rtl"
              className={`font-arabic text-emerald-950 text-right leading-loose tracking-wide ${
                fontSizeLevel === "normal"
                  ? "text-2xl"
                  : fontSizeLevel === "large"
                  ? "text-3xl"
                  : "text-4xl"
              }`}
            >
              {arabicText}
            </div>
          </div>
        );
      }

      // Check headings
      const lines = part.split("\n");
      return (
        <div key={index} className="space-y-3">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-2" />;

            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={lIdx}
                  className={`font-bold text-slate-900 mt-5 mb-2 ${
                    fontSizeLevel === "normal"
                      ? "text-base"
                      : fontSizeLevel === "large"
                      ? "text-lg"
                      : "text-xl"
                  }`}
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={lIdx}
                  className={`font-bold text-slate-900 mt-6 mb-2 ${
                    fontSizeLevel === "normal"
                      ? "text-lg"
                      : fontSizeLevel === "large"
                      ? "text-xl"
                      : "text-2xl"
                  }`}
                >
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
              return (
                <p
                  key={lIdx}
                  className={`italic text-slate-600 leading-relaxed ${
                    fontSizeLevel === "normal"
                      ? "text-sm"
                      : fontSizeLevel === "large"
                      ? "text-base"
                      : "text-lg"
                  }`}
                >
                  {trimmed.slice(1, -1)}
                </p>
              );
            }

            return (
              <p
                key={lIdx}
                className={`text-slate-700 leading-relaxed ${
                  fontSizeLevel === "normal"
                    ? "text-sm"
                    : fontSizeLevel === "large"
                    ? "text-base"
                    : "text-lg"
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const metaPillText = [note.episode_no, note.title, note.speaker]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-5 py-3 flex items-center justify-between border-b border-slate-100">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
          title="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(note)}
            className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
            title="Edit Catatan"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition"
            title="Hapus Catatan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reader View */}
      <div className="px-6 pt-5 flex-1 max-w-prose mx-auto w-full">
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {note.title || "Untitled"}
        </h1>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta pill dropdown */}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-150/70 text-xs text-slate-600 font-medium">
            <span className="truncate pr-2">{metaPillText}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Body Content */}
        <div className="prose prose-slate max-w-none text-slate-800">
          {renderFormattedContent(note.content || "Belum ada isi catatan...")}
        </div>
      </div>

      {/* Bottom Floating Tools */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-slate-200">
        <button
          onClick={() => onEdit(note)}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg active:scale-95 transition"
          title="Tambah / Edit Teks"
        >
          +
        </button>

        {/* Font size toggle Aa */}
        <div className="relative">
          <button
            onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
            className="px-3.5 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 font-bold text-sm active:scale-95 transition"
            title="Ukuran Tulisan"
          >
            <span>Aa</span>
          </button>

          {showFontSizeMenu && (
            <div className="absolute bottom-12 -left-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 min-w-[140px] flex flex-col gap-1 z-40">
              <button
                onClick={() => {
                  setFontSizeLevel("normal");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span>Standar</span>
                {fontSizeLevel === "normal" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  setFontSizeLevel("large");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span>Besar</span>
                {fontSizeLevel === "large" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  setFontSizeLevel("xl");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <span>Sangat Besar</span>
                {fontSizeLevel === "xl" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Hapus Catatan?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Catatan &quot;{note.title}&quot; akan dihapus secara permanen dari perangkat dan database.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(note.id);
                  setConfirmDelete(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

