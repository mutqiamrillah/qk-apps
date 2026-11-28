"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { CategoryItem, NoteItem, AppTheme, formatFullDateTime, calculateReadingStats } from "@/lib/types";

interface CategoryGridProps {
  categories: CategoryItem[];
  theme?: AppTheme;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  theme = "light",
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  notes,
  onSelectNote,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const titleTextClasses = {
    light: "text-slate-900",
    sepia: "text-[#423120]",
    dark: "text-white",
    kyutsii: "text-[#4a152b]",
  }[theme];

  const cardBaseClasses = {
    light: "bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 text-slate-900",
    sepia: "bg-[#faf6ee] border-[#ebdcc7] shadow-sm hover:border-amber-400 text-[#423120]",
    dark: "bg-[#0e2c26] border-[#17443b] shadow-sm hover:border-emerald-500 text-white",
    kyutsii: "bg-[#fff9fb] border-[#fbcfe8] shadow-sm hover:border-pink-400 text-[#4a152b]",
  }[theme];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName("");
      setShowAddModal(false);
    }
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete && onDeleteCategory) {
      onDeleteCategory(categoryToDelete.id);
    }
    setCategoryToDelete(null);
  };

  const filteredNotes = (
    selectedCategoryId === "all"
      ? notes
      : notes.filter(
          (n) =>
            n.category.toLowerCase() ===
            categories
              .find((c) => c.id === selectedCategoryId)
              ?.name.toLowerCase()
        )
  ).sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return 0;
  });

  return (
    <div className="px-5 pt-3 pb-24">
      {/* Title */}
      <h1 className={`text-2xl font-bold mb-4 ${titleTextClasses}`}>Study</h1>

      {/* 2-Column Categories Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                }
              }}
              className={`group relative p-3.5 rounded-2xl flex items-center justify-between gap-2 text-left transition-all border cursor-pointer ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600"
                  : `${cat.bgColor} border-slate-100 hover:shadow-sm`
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="text-2xl shrink-0 select-none">{cat.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-slate-900 truncate">
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cat.id === "all"
                      ? `${notes.length} notes`
                      : `${
                          notes.filter(
                            (n) =>
                              n.category.toLowerCase() === cat.name.toLowerCase()
                          ).length
                        } notes`}
                  </div>
                </div>
              </div>

              {/* Tombol Hapus Kategori (hanya untuk kategori selain 'all') */}
              {cat.id !== "all" && onDeleteCategory && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryToDelete(cat);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 transition active:scale-90 shrink-0 opacity-60 md:opacity-0 md:group-hover:opacity-100"
                  title={`Hapus kategori ${cat.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Category Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="p-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-slate-50/50 flex items-center justify-center gap-2 text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add category</span>
        </button>
      </div>

      {/* Notes List under Category */}
      <div className="mt-8">
        <h2 className={`text-base font-bold mb-3.5 ${titleTextClasses}`}>
          {selectedCategoryId === "all"
            ? "All notes"
            : `Notes in ${
                categories.find((c) => c.id === selectedCategoryId)?.name
              }`}
        </h2>

        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className={`text-center py-8 rounded-2xl border border-dashed ${
              theme === "dark"
                ? "bg-[#0b231e] border-[#16443b] text-slate-300"
                : theme === "sepia"
                ? "bg-[#f3ebd9]/60 border-[#e2d5bd] text-[#5c462f]"
                : theme === "kyutsii"
                ? "bg-[#ffe4ee]/60 border-[#f9b8d0] text-[#831843]"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <span className="text-2xl">🌱</span>
              <p className="text-xs font-medium mt-2 opacity-75">
                Belum ada catatan pada kategori ini.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const formattedDate = formatFullDateTime(note.date, note.created_at);
              const readingStats = calculateReadingStats(note.content || "");

              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${cardBaseClasses} ${
                    note.is_pinned
                      ? theme === "dark"
                        ? "border-amber-400/50 bg-[#143a32]"
                        : theme === "sepia"
                        ? "border-amber-400 bg-[#f7eedc]"
                        : "border-amber-300/80 bg-amber-50/20 shadow-[0_2px_10px_rgba(245,158,11,0.08)]"
                      : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform ${
                      note.is_pinned
                        ? "bg-amber-100 border border-amber-300 text-amber-900"
                        : "bg-[#fed7aa]/35 border border-amber-200/40 text-amber-900"
                    }`}
                  >
                    {note.is_pinned ? "📌" : "📖"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {note.is_favorite && <span className="text-amber-500 text-xs shrink-0">⭐</span>}
                      <h3 className="text-sm font-bold truncate">
                        {note.title || "Untitled"}
                      </h3>
                    </div>
                    <p className="text-xs opacity-75 mt-0.5 truncate">
                      {[note.category, note.speaker].filter(Boolean).join(" · ")}
                    </p>

                    {/* Timestamp with seconds precision */}
                    {formattedDate && (
                      <div className="flex items-center gap-1 text-[11px] opacity-65 mt-1 font-mono">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{formattedDate}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {note.is_pinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          📌 Disematkan
                        </span>
                      )}
                      <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {note.status === "Online" ? "Posted" : note.status || "Posted"}
                      </span>
                      <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        ⏱️ {readingStats.minutes} mnt
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Category Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Tambah Kategori
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Buat kategori baru untuk mengelompokkan catatan Anda.
            </p>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: Muamalah, Sirah, Tazkiyatun Nufs"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-50 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Hapus Kategori */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Hapus Kategori?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <span className="font-bold text-slate-800">
                &ldquo;{categoryToDelete.name}&rdquo;
              </span>
              ? Catatan di dalamnya tidak akan terhapus.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                Hapus Kategori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

