"use client";

import React, { useState } from "react";
import { X, Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { DailyWisdom } from "@/lib/dailyWisdom";
import { AppTheme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/theme";

interface DailyWisdomModalProps {
  isOpen: boolean;
  wisdom: DailyWisdom | null;
  theme?: AppTheme;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onClose: () => void;
}

export const DailyWisdomModal: React.FC<DailyWisdomModalProps> = ({
  isOpen,
  wisdom,
  theme = "light",
  isRefreshing = false,
  onRefresh,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !wisdom) return null;

  const handleCopy = async () => {
    const text = `${wisdom.arabic}\n\n"${wisdom.translation}"\n\n— ${wisdom.sourceRef} (${wisdom.theme})\n_Dicatat via QK Notes_ 📖`;
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

  const styles = THEME_STYLES[theme];

  const modalBgClasses = {
    light: "bg-white text-slate-800 border-slate-150",
    sepia: "bg-[#faf6ee] text-[#423120] border-[#ebdcc7]",
    dark: "bg-[#0b2620] text-[#e0ece8] border-[#18493f]",
    kyutsii: "bg-[#fff5f8] text-[#4a152b] border-[#fbcfe8]",
  }[theme];

  const arabicBoxClasses = {
    light: "bg-emerald-50/50 border-emerald-600 text-emerald-950",
    sepia: "bg-[#f3ebd9] border-[#8c5a2b] text-amber-950",
    dark: "bg-[#071d18] border-emerald-400 text-amber-200",
    kyutsii: "bg-[#ffe4ee]/80 border-pink-400 text-[#5c1634]",
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
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm mb-2.5 ${styles.pillBadge}`}>
            <Sparkles className={`w-3.5 h-3.5 ${styles.accentIcon}`} />
            <span>Nasihat Hari Ini</span>
          </div>
          <div className={`font-arabic text-xl font-bold tracking-wider select-none ${styles.accentText}`}>
            ﷽
          </div>
        </div>

        {/* Theme Pill & Source Badge */}
        <div className="flex items-center justify-between mb-3 text-[11px] font-semibold opacity-75">
          <span className={`px-2.5 py-0.5 rounded-full border ${styles.badgeBg}`}>
            {wisdom.theme}
          </span>
          <span className="font-medium">
            {wisdom.sourceType === "Quran" ? "📖 Ayat Al-Qur'an" : "📜 Hadits Nabawi"}
          </span>
        </div>

        {/* Scrollable Quote Body */}
        <div className="max-h-[50vh] overflow-y-auto pr-1 mb-4">
          {/* Arabic Box */}
          <div
            className={`p-3.5 rounded-2xl border-l-4 mb-3 shadow-inner ${arabicBoxClasses}`}
          >
            <div
              dir="rtl"
              className="font-arabic text-right text-xl leading-relaxed font-medium select-text"
            >
              {wisdom.arabic}
            </div>
          </div>

          {/* Translation */}
          <div>
            <p className="text-xs sm:text-sm leading-relaxed font-normal opacity-90 italic">
              &ldquo;{wisdom.translation}&rdquo;
            </p>
            <div className="mt-2 text-right">
              <span className={`inline-block text-xs font-bold font-mono ${styles.accentText}`}>
                — {wisdom.sourceRef}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
          {/* Acak Nasihat Lain dari API */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              title="Ambil Ayat / Hadits Acak Lainnya"
            >
              <RefreshCw className={`w-3.5 h-3.5 opacity-75 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Acak</span>
            </button>
          )}

          {/* Salin Teks */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition active:scale-95"
            title="Salin Nasihat"
          >
            {copied ? (
              <>
                <Check className={`w-3.5 h-3.5 ${styles.accentIcon}`} />
                <span className={`font-medium ${styles.accentText}`}>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-70" />
                <span>Salin</span>
              </>
            )}
          </button>

          {/* Tutup & Alhamdulillah */}
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-md active:scale-95 text-center ${styles.primaryBtn}`}
          >
            Alhamdulillah, Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

