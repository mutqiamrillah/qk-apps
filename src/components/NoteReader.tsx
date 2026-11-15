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

  // Helper untuk parsing inline markdown: **bold**, ==highlight==, *italic*
  const renderInline = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|==.*?==|\*.*?\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("==") && token.endsWith("==") && token.length >= 4) {
        return (
          <mark
            key={i}
            className="bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded font-semibold"
          >
            {token.slice(2, -2)}
          </mark>
        );
      }
      if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
        return (
          <em key={i} className="italic text-slate-600">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  // Parse formatting rich blocks: Arabic, alignments, headings, quotes, bullets, numbered
  const renderFormattedContent = (content: string) => {
    // Split block delimiters: :::arabic, :::center, :::right, :::justify, :::left
    const parts = content.split(/(:::(?:arabic|center|right|justify|left)[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      // 1. ARABIC BLOCK
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

      // 2. CENTER ALIGN BLOCK
      if (part.startsWith(":::center")) {
        const text = part.replace(/:::center/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-center text-slate-700 leading-relaxed font-medium">
            {renderInline(text)}
          </div>
        );
      }

      // 3. RIGHT ALIGN BLOCK
      if (part.startsWith(":::right")) {
        const text = part.replace(/:::right/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-right text-slate-700 leading-relaxed">
            {renderInline(text)}
          </div>
        );
      }

      // 4. JUSTIFY ALIGN BLOCK
      if (part.startsWith(":::justify")) {
        const text = part.replace(/:::justify/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-justify text-slate-700 leading-relaxed">
            {renderInline(text)}
          </div>
        );
      }

      // 5. LEFT ALIGN BLOCK
      if (part.startsWith(":::left")) {
        const text = part.replace(/:::left/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-left text-slate-700 leading-relaxed">
            {renderInline(text)}
          </div>
        );
      }

      // 6. STANDARD LINES (Headings, Quote, Bullets, Paragraphs)
      const lines = part.split("\n");
      return (
        <div key={index} className="space-y-2.5 my-2">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-2" />;

            // Title (# )
            if (trimmed.startsWith("# ")) {
              return (
                <h1
                  key={lIdx}
                  className={`font-black text-slate-900 mt-6 mb-3 tracking-tight ${
                    fontSizeLevel === "normal"
                      ? "text-xl"
                      : fontSizeLevel === "large"
                      ? "text-2xl"
                      : "text-3xl"
                  }`}
                >
                  {renderInline(trimmed.replace("# ", ""))}
                </h1>
              );
            }

            // Heading (## )
            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={lIdx}
                  className={`font-bold text-slate-900 mt-5 mb-2 ${
                    fontSizeLevel === "normal"
                      ? "text-lg"
                      : fontSizeLevel === "large"
                      ? "text-xl"
                      : "text-2xl"
                  }`}
                >
                  {renderInline(trimmed.replace("## ", ""))}
                </h2>
              );
            }

            // Subheading (### )
            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={lIdx}
                  className={`font-bold text-slate-800 mt-4 mb-1.5 ${
                    fontSizeLevel === "normal"
                      ? "text-base"
                      : fontSizeLevel === "large"
                      ? "text-lg"
                      : "text-xl"
                  }`}
                >
                  {renderInline(trimmed.replace("### ", ""))}
                </h3>
              );
            }

            // Quote (> )
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote
                  key={lIdx}
                  className="border-l-4 border-amber-400 bg-amber-50/40 pl-3.5 py-1.5 my-2 rounded-r-xl italic text-slate-700 leading-relaxed"
                >
                  {renderInline(trimmed.replace("> ", ""))}
                </blockquote>
              );
            }

            // Bullets (- or • )
            if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
              return (
                <div key={lIdx} className="flex items-start gap-2.5 ml-2 text-slate-700 leading-relaxed">
                  <span className="text-emerald-700 font-bold select-none">•</span>
                  <span>{renderInline(trimmed.replace(/^[-•]\s*/, ""))}</span>
                </div>
              );
            }

            // Numbered (1. , 2. )
            if (/^\d+\.\s/.test(trimmed)) {
              const numMatch = trimmed.match(/^(\d+\.)\s/);
              const numPrefix = numMatch ? numMatch[1] : "";
              const textContent = trimmed.replace(/^\d+\.\s/, "");
              return (
                <div key={lIdx} className="flex items-start gap-2 ml-2 text-slate-700 leading-relaxed">
                  <span className="font-semibold text-emerald-800 select-none min-w-[1.2rem]">{numPrefix}</span>
                  <span>{renderInline(textContent)}</span>
                </div>
              );
            }

            // Regular Body Paragraph
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
                {renderInline(line)}
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
