"use client";

import React, { useState } from "react";
import { X, Sparkles, Copy, Check, RefreshCw, BookOpen } from "lucide-react";
import { DailyWisdom, getRandomDailyWisdom } from "@/lib/dailyWisdom";
import { AppTheme } from "@/lib/types";

interface DailyWisdomModalProps {
  isOpen: boolean;
  wisdom: DailyWisdom | null;
  theme?: AppTheme;
  onClose: () => void;
  onRefresh?: (newWisdom: DailyWisdom) => void;
}

export const DailyWisdomModal: React.FC<DailyWisdomModalProps> = ({
  isOpen,
  wisdom,
  theme = "light",
  onClose,
  onRefresh,
}) => {
  const [currentWisdom, setCurrentWisdom] = useState<DailyWisdom | null>(wisdom);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (wisdom) {
      setCurrentWisdom(wisdom);
    }
  }, [wisdom]);

  if (!isOpen || !currentWisdom) return null;

  const handleShuffle = () => {
    const next = getRandomDailyWisdom();
    setCurrentWisdom(next);
    onRefresh?.(next);
  };

  const handleCopy = async () => {
    const text = `${currentWisdom.arabic}\n\n"${currentWisdom.translation}"\n\n— ${currentWisdom.sourceRef} (${currentWisdom.theme})\n_Dicatat via QK Notes_ 📖`;
    if (typeof window !== "undefined" && navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn("Clipboard failed:", err);
      }
    }
  };

  const modalBgClasses = {
    light: "bg-white text-slate-800 border-slate-150",
    sepia: "bg-[#faf6ee] text-[#423120] border-[#ebdcc7]",
    dark: "bg-[#0b2620] text-[#e0ece8] border-[#18493f]",
  }[theme];

  const arabicBoxClasses = {
    light: "bg-emerald-50/50 border-emerald-200/60 text-emerald-950",
    sepia: "bg-[#f3ebd9] border-[#e2d5bd] text-amber-950",
    dark: "bg-[#071d18] border-[#153f36] text-amber-200",
  }[theme];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all animate-in fade-in zoom-in-95 ${modalBgClasses}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition active:scale-90"
          title="Tutup"
        >
          <X className="w-4 h-4 opacity-70" />
        </button>

        {/* Header Ornament */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold shadow-sm mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Nasihat Hari Ini</span>
          </div>
          <div className="font-arabic text-xl text-emerald-700 dark:text-emerald-300 font-bold tracking-wider select-none">
            ﷽
          </div>
        </div>

        {/* Theme Pill & Source Badge */}
        <div className="flex items-center justify-between mb-3 text-[11px] font-semibold opacity-75">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            {currentWisdom.theme}
          </span>
          <span className="font-medium">
            {currentWisdom.sourceType === "Quran" ? "📖 Ayat Al-Qur'an" : "📜 Hadits Nabawi"}
          </span>
        </div>

        {/* Arabic Box */}
        <div
          className={`p-4 rounded-2xl border-l-4 border-emerald-600 mb-3.5 shadow-inner ${arabicBoxClasses}`}
        >
          <div
            dir="rtl"
            className="font-arabic text-right text-2xl leading-loose font-medium select-text"
          >
            {currentWisdom.arabic}
          </div>
        </div>

        {/* Translation */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm leading-relaxed font-normal opacity-90 italic">
            &ldquo;{currentWisdom.translation}&rdquo;
          </p>
          <div className="mt-2 text-right">
            <span className="inline-block text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              — {currentWisdom.sourceRef}
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
          {/* Ganti Nasihat / Shuffle */}
          <button
            onClick={handleShuffle}
            className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95"
            title="Tampilkan nasihat lain"
          >
            <RefreshCw className="w-3.5 h-3.5 opacity-70" />
            <span className="hidden sm:inline">Acak</span>
          </button>

          {/* Salin Teks */}
          <button
            onClick={handleCopy}
            className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95"
            title="Salin Nasihat"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline">Salin</span>
              </>
            )}
          </button>

          {/* Tutup & Alhamdulillah */}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] text-white text-xs font-bold transition shadow-md active:scale-95 text-center"
          >
            Alhamdulillah, Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

