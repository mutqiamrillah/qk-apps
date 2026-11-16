"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Trash2,
  Edit3,
  ChevronDown,
  Check,
  Pin,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Clock,
  Copy,
  Printer,
} from "lucide-react";
import { NoteItem, AppTheme, formatFullDateTime } from "@/lib/types";

interface NoteReaderProps {
  note: NoteItem;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
  onBack: () => void;
  onDelete: (id: string) => void;
  onEdit: (note: NoteItem) => void;
  onTogglePin?: (note: NoteItem) => void;
  onOpenShare?: (note: NoteItem) => void;
}

export const NoteReader: React.FC<NoteReaderProps> = ({
  note,
  theme = "light",
  onThemeChange,
  onBack,
  onDelete,
  onEdit,
  onTogglePin,
  onOpenShare,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xl">("normal");
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [readingTheme, setReadingTheme] = useState<"light" | "sepia" | "dark">(theme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  React.useEffect(() => {
    if (theme) {
      setReadingTheme(theme);
    }
  }, [theme]);

  const changeTheme = (newTheme: "light" | "sepia" | "dark") => {
    setReadingTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const formatForWhatsApp = (n: NoteItem) => {
    let text = `*${n.title}*\n`;
    if (n.speaker) text += `_Pemateri: ${n.speaker}_\n`;
    if (n.category) text += `_Kategori: ${n.category}_\n`;
    const dt = formatFullDateTime(n.date, n.created_at);
    if (dt) text += `_Waktu: ${dt}_\n`;
    text += `\n`;

    let body = n.content || "";
    // Clean Arabic tags
    body = body.replace(/:::arabic\s*([\s\S]*?)\s*:::/g, "$1\n");
    // Clean alignments
    body = body.replace(/:::(?:center|right|justify|left)\s*([\s\S]*?)\s*:::/g, "$1");
    // Markdown headers to bold
    body = body.replace(/^#+\s*(.*?)$/gm, "*$1*");
    // Markdown quotes
    body = body.replace(/^>\s*(.*?)$/gm, "“$1”");

    text += body.trim();
    text += `\n\n_— Dicatat via QK Notes_ 📖`;
    return text;
  };

  const handleCopyWhatsApp = async () => {
    const text = formatForWhatsApp(note);
    if (typeof window !== "undefined" && navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedWa(true);
        setTimeout(() => setCopiedWa(false), 2200);
      } catch (err) {
        console.warn("Clipboard write failed:", err);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Helper untuk parsing inline markdown: **bold**, ==highlight==, *italic*
  const renderInline = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|==.*?==|\*.*?\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
        return (
          <strong
            key={i}
            className={`font-bold ${readingTheme === "dark" ? "text-emerald-300" : "text-slate-900"}`}
          >
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("==") && token.endsWith("==") && token.length >= 4) {
        return (
          <mark
            key={i}
            className={`px-1.5 py-0.5 rounded font-semibold ${
              readingTheme === "dark"
                ? "bg-emerald-800/80 text-amber-200"
                : "bg-amber-200/90 text-amber-950"
            }`}
          >
            {token.slice(2, -2)}
          </mark>
        );
      }
      if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
        return (
          <em
            key={i}
            className={`italic ${readingTheme === "dark" ? "text-slate-300" : "text-slate-600"}`}
          >
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  // Parse formatting rich blocks: Arabic, alignments, headings, quotes, bullets, numbered
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(:::(?:arabic|center|right|justify|left)[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      // 1. ARABIC BLOCK
      if (part.startsWith(":::arabic")) {
        const arabicText = part.replace(/:::arabic/g, "").replace(/:::/g, "").trim();
        return (
          <div
            key={index}
            className={`my-5 p-4 pl-4 border-l-4 rounded-r-2xl ${
              readingTheme === "dark"
                ? "border-emerald-400 bg-emerald-950/40"
                : "border-emerald-600 bg-emerald-50/30"
            }`}
          >
            <div
              dir="rtl"
              className={`font-arabic text-right leading-loose tracking-wide ${
                readingTheme === "dark" ? "text-amber-200" : "text-emerald-950"
              } ${
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
          <div key={index} className="my-3 text-center leading-relaxed font-medium">
            {renderInline(text)}
          </div>
        );
      }

      // 3. RIGHT ALIGN BLOCK
      if (part.startsWith(":::right")) {
        const text = part.replace(/:::right/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-right leading-relaxed">
            {renderInline(text)}
          </div>
        );
      }

      // 4. JUSTIFY ALIGN BLOCK
      if (part.startsWith(":::justify")) {
        const text = part.replace(/:::justify/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-justify leading-relaxed">
            {renderInline(text)}
          </div>
        );
      }

      // 5. LEFT ALIGN BLOCK
      if (part.startsWith(":::left")) {
        const text = part.replace(/:::left/g, "").replace(/:::/g, "").trim();
        return (
          <div key={index} className="my-3 text-left leading-relaxed">
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
                  className={`font-black mt-6 mb-3 tracking-tight ${
                    readingTheme === "dark" ? "text-white" : "text-slate-900"
                  } ${
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
                  className={`font-bold mt-5 mb-2 ${
                    readingTheme === "dark" ? "text-emerald-200" : "text-slate-900"
                  } ${
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
                  className={`font-bold mt-4 mb-1.5 ${
                    readingTheme === "dark" ? "text-emerald-300" : "text-slate-800"
                  } ${
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
                  className={`border-l-4 my-2 pl-3.5 py-1.5 rounded-r-xl italic leading-relaxed ${
                    readingTheme === "dark"
                      ? "border-amber-500 bg-amber-950/20 text-slate-200"
                      : "border-amber-400 bg-amber-50/40 text-slate-700"
                  }`}
                >
                  {renderInline(trimmed.replace("> ", ""))}
                </blockquote>
              );
            }

            // Bullets (- or • )
            if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
              return (
                <div key={lIdx} className="flex items-start gap-2.5 ml-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold select-none">•</span>
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
                <div key={lIdx} className="flex items-start gap-2 ml-2 leading-relaxed">
                  <span className="font-semibold text-emerald-500 select-none min-w-[1.2rem]">{numPrefix}</span>
                  <span>{renderInline(textContent)}</span>
                </div>
              );
            }

            // Regular Body Paragraph
            return (
              <p
                key={lIdx}
                className={`leading-relaxed ${
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

  // Theme Styling Classes
  const themeClasses = {
    light: "bg-white text-slate-800",
    sepia: "bg-[#faf6ee] text-[#423120]",
    dark: "bg-[#0a231e] text-[#d1e5df]",
  }[readingTheme];

  const headerBarClasses = {
    light: "bg-white/90 border-slate-100 text-slate-700",
    sepia: "bg-[#faf6ee]/90 border-[#ebdcc7] text-[#423120]",
    dark: "bg-[#0a231e]/90 border-[#16443b] text-[#e0ece8]",
  }[readingTheme];

  const pillClasses = {
    light: "bg-slate-50 border-slate-150/70 text-slate-600",
    sepia: "bg-[#f3ebd9] border-[#e2d5bd] text-[#5c462f]",
    dark: "bg-[#0f342d] border-[#1d5247] text-emerald-200",
  }[readingTheme];

  return (
    <div className={`min-h-screen flex flex-col pb-24 transition-colors duration-200 ${themeClasses}`}>
      {/* Top Bar */}
      <div className={`sticky top-0 z-20 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b no-print ${headerBarClasses}`}>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition active:scale-95"
          title="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {/* Salin ke WhatsApp / Telegram Button */}
          <button
            onClick={handleCopyWhatsApp}
            className={`h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition active:scale-95 ${
              copiedWa
                ? "bg-emerald-600 text-white"
                : "bg-black/5 hover:bg-black/10 text-slate-700"
            }`}
            title="Salin Rapi untuk WhatsApp / Telegram"
          >
            {copiedWa ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin WA</span>
              </>
            )}
          </button>

          {/* Cetak / Ekspor PDF Button */}
          <button
            onClick={handlePrint}
            className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 flex items-center justify-center transition active:scale-95"
            title="Cetak Catatan / Simpan ke PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Pin Button */}
          {onTogglePin && (
            <button
              onClick={() => onTogglePin(note)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                note.is_pinned
                  ? "bg-amber-100 text-amber-800"
                  : "bg-black/5 hover:bg-black/10 text-slate-600"
              }`}
              title={note.is_pinned ? "Lepas Sematan (Unpin)" : "Sematkan Catatan (Pin)"}
            >
              <Pin className={`w-4 h-4 ${note.is_pinned ? "fill-amber-600" : ""}`} />
            </button>
          )}

          {/* Share Faidah Button */}
          {onOpenShare && (
            <button
              onClick={() => onOpenShare(note)}
              className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/10 text-emerald-600 flex items-center justify-center transition"
              title="Bagikan Faidah ke Gambar / Story"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(note)}
            className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 flex items-center justify-center transition"
            title="Edit Catatan"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-9 h-9 rounded-xl bg-black/5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition"
            title="Hapus Catatan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reader View */}
      <div className="px-6 pt-5 flex-1 max-w-prose mx-auto w-full">
        {/* Title */}
        <h1 className={`text-2xl font-extrabold tracking-tight leading-snug ${
          readingTheme === "dark" ? "text-white" : "text-slate-900"
        }`}>
          {note.is_pinned && <span className="mr-1.5 text-amber-500">📌</span>}
          {note.title || "Untitled"}
        </h1>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Full timestamp with seconds precision */}
        {formatFullDateTime(note.date, note.created_at) && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs opacity-70 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{formatFullDateTime(note.date, note.created_at)}</span>
          </div>
        )}

        {/* Meta pill dropdown */}
        <div className="mt-4 mb-6">
          <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium ${pillClasses}`}>
            <span className="truncate pr-2">{metaPillText}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
          </div>
        </div>

        {/* Body Content */}
        <div className="prose max-w-none">
          {renderFormattedContent(note.content || "Belum ada isi catatan...")}
        </div>
      </div>

      {/* Bottom Floating Tools */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border no-print ${
        readingTheme === "dark"
          ? "bg-[#0e342c]/95 border-[#1d5247] text-white"
          : "bg-white/95 border-slate-200 text-slate-800"
      }`}>
        {/* Quick Edit */}
        <button
          onClick={() => onEdit(note)}
          className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center font-bold text-lg active:scale-95 transition"
          title="Tambah / Edit Teks"
        >
          +
        </button>

        {/* Font size toggle Aa */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFontSizeMenu(!showFontSizeMenu);
              setShowThemeMenu(false);
            }}
            className="px-3 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center gap-1 font-bold text-xs active:scale-95 transition"
            title="Ukuran Tulisan"
          >
            <span>Aa</span>
          </button>

          {showFontSizeMenu && (
            <div className={`absolute bottom-12 -left-6 rounded-2xl shadow-xl border p-2 min-w-[140px] flex flex-col gap-1 z-40 ${
              readingTheme === "dark"
                ? "bg-[#0e342c] border-[#1d5247] text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <button
                onClick={() => {
                  setFontSizeLevel("normal");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span>Standar</span>
                {fontSizeLevel === "normal" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  setFontSizeLevel("large");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span>Besar</span>
                {fontSizeLevel === "large" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  setFontSizeLevel("xl");
                  setShowFontSizeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span>Sangat Besar</span>
                {fontSizeLevel === "xl" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle (Light / Sepia / Dark) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowFontSizeMenu(false);
            }}
            className="px-3 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center gap-1 text-xs font-semibold active:scale-95 transition"
            title="Tema Membaca (Terang, Sepia, Gelap)"
          >
            {readingTheme === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {readingTheme === "sepia" && <BookOpen className="w-3.5 h-3.5 text-amber-700" />}
            {readingTheme === "dark" && <Moon className="w-3.5 h-3.5 text-emerald-300" />}
            <span className="capitalize text-[11px]">{readingTheme}</span>
          </button>

          {showThemeMenu && (
            <div className={`absolute bottom-12 -right-4 rounded-2xl shadow-xl border p-2 min-w-[140px] flex flex-col gap-1 z-40 ${
              readingTheme === "dark"
                ? "bg-[#0e342c] border-[#1d5247] text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <button
                onClick={() => {
                  changeTheme("light");
                  setShowThemeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span className="flex items-center gap-2">☀️ <span>Terang</span></span>
                {readingTheme === "light" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  changeTheme("sepia");
                  setShowThemeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span className="flex items-center gap-2">📜 <span>Sepia</span></span>
                {readingTheme === "sepia" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  changeTheme("dark");
                  setShowThemeMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-black/5 rounded-lg text-left"
              >
                <span className="flex items-center gap-2">🌙 <span>Malam</span></span>
                {readingTheme === "dark" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 text-slate-900">
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
