"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Sparkles, Link2 } from "lucide-react";
import { CategoryItem, NoteItem, formatFullDateTime, sanitizeSafeUrl } from "@/lib/types";

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

  // Inline hyperlink insertion state
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSelection, setLinkSelection] = useState<{ start: number; end: number } | null>(null);

  const [savedDraft, setSavedDraft] = useState<{
    title: string;
    category: string;
    speaker: string;
    episodeNo: string;
    tagsStr: string;
    content: string;
    updatedAt: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cek draft tersimpan saat modal dibuka untuk catatan baru
  useEffect(() => {
    if (isOpen && !noteToEdit && typeof window !== "undefined") {
      const draftJson = localStorage.getItem("qk_editor_draft");
      if (draftJson) {
        try {
          const parsed = JSON.parse(draftJson);
          if (parsed && (parsed.title || parsed.content)) {
            setSavedDraft(parsed);
          }
        } catch {
          // ignore
        }
      }
    } else {
      setSavedDraft(null);
    }
  }, [isOpen, noteToEdit]);

  // Auto-save draft effect per ketikan (debounced)
  useEffect(() => {
    if (!isOpen || noteToEdit) return;
    if (typeof window === "undefined") return;

    if (title.trim() || content.trim()) {
      const timer = setTimeout(() => {
        localStorage.setItem(
          "qk_editor_draft",
          JSON.stringify({
            title,
            category,
            speaker,
            episodeNo,
            tagsStr,
            content,
            updatedAt: new Date().toISOString(),
          })
        );
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, noteToEdit, title, category, speaker, episodeNo, tagsStr, content]);

  const handleRestoreDraft = () => {
    if (!savedDraft) return;
    setTitle(savedDraft.title || "");
    setCategory(savedDraft.category || "Lectures");
    setSpeaker(savedDraft.speaker || "");
    setEpisodeNo(savedDraft.episodeNo || "");
    setTagsStr(savedDraft.tagsStr || "");
    setContent(savedDraft.content || "");
    setSavedDraft(null);
  };

  const handleDiscardDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("qk_editor_draft");
    }
    setSavedDraft(null);
  };

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
    setShowLinkForm(false);
    setLinkText("");
    setLinkUrl("");
    setLinkError("");
    setLinkSelection(null);
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  // Formatting tools implementation matching the user's reference image
  const applyFormatting = (action: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    let replacement = "";

    switch (action) {
      case "Title":
        replacement = selected ? `\n# ${selected}\n` : `\n# Judul Catatan\n`;
        break;
      case "Heading":
        replacement = selected ? `\n## ${selected}\n` : `\n## Heading Baru\n`;
        break;
      case "Subheading":
        replacement = selected ? `\n### ${selected}\n` : `\n### Subheading Baru\n`;
        break;
      case "Body":
        replacement = selected ? selected.replace(/^[#>\s\-•*]+/gm, "") : `Teks paragraf biasa`;
        break;
      case "Bold":
        replacement = selected ? `**${selected}**` : `**teks tebal**`;
        break;
      case "Italic":
        replacement = selected ? `*${selected}*` : `*teks miring*`;
        break;
      case "Highlight":
        replacement = selected ? `==${selected}==` : `==teks disorot==`;
        break;
      case "Quote":
        replacement = selected ? `\n> ${selected}\n` : `\n> Kutipan atau faidah ilmu...\n`;
        break;
      case "Bullets":
        replacement = selected ? `\n- ${selected}\n` : `\n- Poin catatan\n`;
        break;
      case "Numbered":
        replacement = selected ? `\n1. ${selected}\n` : `\n1. Poin pertama\n`;
        break;
      case "Align left":
        replacement = selected ? `\n:::left\n${selected}\n:::\n` : `\n:::left\nTeks rata kiri\n:::\n`;
        break;
      case "Center":
        replacement = selected ? `\n:::center\n${selected}\n:::\n` : `\n:::center\nTeks rata tengah\n:::\n`;
        break;
      case "Align right":
        replacement = selected ? `\n:::right\n${selected}\n:::\n` : `\n:::right\nTeks rata kanan\n:::\n`;
        break;
      case "Justify":
        replacement = selected ? `\n:::justify\n${selected}\n:::\n` : `\n:::justify\nTeks rata kiri-kanan\n:::\n`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleInsertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + symbol + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + symbol.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleInsertSnippet = (type: "arabic" | "translation") => {
    let snippet = "";
    if (type === "arabic") {
      snippet = "\n:::arabic\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n:::\n";
    } else if (type === "translation") {
      snippet = '\n*Artinya: “Tuliskan terjemahan atau kutipan di sini...”*\n';
    }
    setContent((prev) => prev + snippet);
  };

  const handleOpenLinkForm = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setLinkSelection({ start, end });
      setLinkText(content.substring(start, end));
    } else {
      setLinkSelection(null);
      setLinkText("");
    }
    setLinkUrl("");
    setLinkError("");
    setShowLinkForm((prev) => !prev);
  };

  const handleInsertLink = () => {
    const safeUrl = sanitizeSafeUrl(linkUrl);
    if (!safeUrl) {
      setLinkError("Masukkan URL yang valid (http:// atau https://).");
      return;
    }

    const label = linkText.trim() || safeUrl;
    const markdownLink = `[${label}](${safeUrl})`;

    const start = linkSelection ? linkSelection.start : content.length;
    const end = linkSelection ? linkSelection.end : content.length;
    const newContent = content.substring(0, start) + markdownLink + content.substring(end);
    setContent(newContent);

    setShowLinkForm(false);
    setLinkText("");
    setLinkUrl("");
    setLinkError("");
    setLinkSelection(null);

    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const cursor = start + markdownLink.length;
        textarea.setSelectionRange(cursor, cursor);
      }
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const nowIso = new Date().toISOString();
    const updatedNote: NoteItem = {
      id: noteToEdit ? noteToEdit.id : `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      category,
      speaker: speaker.trim() || undefined,
      episode_no: episodeNo.trim() || undefined,
      tags,
      status,
      date: noteToEdit?.date || formatFullDateTime(undefined, nowIso),
      content,
      created_at: noteToEdit?.created_at || nowIso,
      updated_at: nowIso,
    };

    if (typeof window !== "undefined") {
      localStorage.removeItem("qk_editor_draft");
    }
    setSavedDraft(null);

    onSave(updatedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
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

        {/* Draft Recovery Alert */}
        {savedDraft && !noteToEdit && (
          <div className="mx-5 mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="text-base">📝</span>
              <span className="truncate">
                Ada draft otomatis yang belum tersimpan{" "}
                <span className="opacity-75">
                  ({new Date(savedDraft.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition active:scale-95 shadow-sm"
              >
                Pulihkan
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-2 py-1 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] transition"
              >
                Buang
              </button>
            </div>
          </div>
        )}

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

          {/* FORMAT PENULISAN (Compact, Single-Line Horizontal Toolbar) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format Teks</span>
              </label>
              <span className="text-[10px] text-slate-400">Geser untuk opsi lainnya ➔</span>
            </div>

            {/* Horizontal Scrollable Sleek Toolbar Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-2 bg-slate-50 border border-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => applyFormatting("Title")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format sebagai Title (#)"
              >
                Title
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Heading")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format sebagai Heading (##)"
              >
                Heading
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Subheading")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format sebagai Subheading (###)"
              >
                Subheading
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Body")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format sebagai Body biasa"
              >
                Body
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Bold")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Bold (**teks**)"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Italic")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold italic rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Italic (*teks*)"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Highlight")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 active:scale-95 transition shrink-0"
                title="Format Highlight Pink (==teks==)"
              >
                Highlight
              </button>
              <button
                type="button"
                onClick={handleOpenLinkForm}
                className={`whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg border active:scale-95 transition shrink-0 flex items-center gap-1 ${
                  showLinkForm
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                }`}
                title="Sisipkan Hyperlink ([teks](url))"
              >
                <Link2 className="w-3 h-3" />
                <span>Link</span>
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Quote")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Quote (>)"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Bullets")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Bullet List (-)"
              >
                Bullets
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Numbered")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Numbered List (1.)"
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Center")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Rata Tengah"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Align left")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Rata Kiri"
              >
                Align left
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Align right")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Rata Kanan"
              >
                Align right
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("Justify")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95 transition shrink-0"
                title="Format Rata Kanan-Kiri"
              >
                Justify
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet("arabic")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition shrink-0"
              >
                + Teks Arab
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet("translation")}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 active:scale-95 transition shrink-0"
              >
                + Terjemahan
              </button>

              {/* Islamic Shortcut Symbols */}
              <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />
              <button
                type="button"
                onClick={() => handleInsertSymbol(" ﷺ ")}
                className="whitespace-nowrap px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 active:scale-95 transition shrink-0"
                title="Shalallahu 'alaihi wa sallam (ﷺ)"
              >
                ﷺ
              </button>
              <button
                type="button"
                onClick={() => handleInsertSymbol(" ﷻ ")}
                className="whitespace-nowrap px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 active:scale-95 transition shrink-0"
                title="Jalla Jalaluh (ﷻ)"
              >
                ﷻ
              </button>
              <button
                type="button"
                onClick={() => handleInsertSymbol(" ﷸ ")}
                className="whitespace-nowrap px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 active:scale-95 transition shrink-0"
                title="Radhiyallahu 'anhu (ﷸ)"
              >
                ﷸ
              </button>
              <button
                type="button"
                onClick={() => handleInsertSymbol(" ﷷ ")}
                className="whitespace-nowrap px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 active:scale-95 transition shrink-0"
                title="Rahimahullah (ﷷ)"
              >
                ﷷ
              </button>
              <button
                type="button"
                onClick={() => handleInsertSymbol(" ﷽ ")}
                className="whitespace-nowrap px-2 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 active:scale-95 transition shrink-0"
                title="Bismillahir Rahmanir Rahim (﷽)"
              >
                ﷽
              </button>
            </div>

            {showLinkForm && (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleInsertLink();
                      }
                    }}
                    placeholder="Teks link (opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => {
                      setLinkUrl(e.target.value);
                      if (linkError) setLinkError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleInsertLink();
                      }
                    }}
                    placeholder="https://contoh.com"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                {linkError && (
                  <p className="text-[11px] text-rose-600 font-medium">{linkError}</p>
                )}
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkForm(false);
                      setLinkError("");
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-200/60 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertLink}
                    className="px-3 py-1 rounded-lg bg-[#134e43] hover:bg-[#0e3b33] text-white text-[11px] font-bold transition"
                  >
                    Sisipkan Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div>
            <textarea
              ref={textareaRef}
              required
              rows={11}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan intisari ceramah atau gunakan tombol format di atas..."
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
                <option value="Online">Posted</option>
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
