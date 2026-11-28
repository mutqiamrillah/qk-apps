"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Download, Share2, Check } from "lucide-react";
import { NoteItem, AppTheme } from "@/lib/types";
import { THEME_STYLES } from "@/lib/theme";

interface ShareQuoteModalProps {
  isOpen: boolean;
  note: NoteItem | null;
  theme?: AppTheme;
  onClose: () => void;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  isOpen,
  note,
  theme = "light",
  onClose,
}) => {
  const styles = THEME_STYLES[theme];
  const [quoteText, setQuoteText] = useState("");
  const [arabicSnippet, setArabicSnippet] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (note) {
      // Extract Arabic block if present
      const arabicMatch = note.content.match(/:::arabic\s*([\s\S]*?)\s*:::/);
      if (arabicMatch && arabicMatch[1]) {
        setArabicSnippet(arabicMatch[1].trim());
      } else {
        setArabicSnippet("");
      }

      // Extract translation or first meaningful quote or paragraph
      const quoteMatch = note.content.match(/\*Artinya:\s*([^*]+)\*/i);
      if (quoteMatch && quoteMatch[1]) {
        setQuoteText(`Artinya: ${quoteMatch[1].trim()}`);
      } else {
        // Fallback to first non-empty paragraph without markdown symbols
        const cleanLines = note.content
          .split("\n")
          .map((l) => l.replace(/^[#>\s\-•*]+/, "").trim())
          .filter((l) => l && !l.startsWith(":::"));
        setQuoteText(cleanLines[0] || note.title);
      }
    }
  }, [note, isOpen]);

  if (!isOpen || !note) return null;

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions: 1080 x 1350 (Instagram 4:5 portrait ratio)
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const [stop0, stop1, stop2] = styles.quoteCanvasStops;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, stop0);
    grad.addColorStop(0.6, stop1);
    grad.addColorStop(1, stop2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative subtle border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(65, 65, width - 130, height - 130);

    // 2. Header Branding
    ctx.fillStyle = "#fef3c7"; // Warm gold
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FAIDAH ILMU & CATATAN KAJIAN", width / 2, 140);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "500 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("QK Notes · Semoga Bermanfaat", width / 2, 185);

    // Top Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 220);
    ctx.lineTo(width - 150, 220);
    ctx.stroke();

    // 3. Note Meta (Speaker & Title)
    ctx.fillStyle = "#34d399"; // Mint green
    ctx.font = "bold 30px 'Plus Jakarta Sans', sans-serif";
    const speakerText = note.speaker ? `🎙️ ${note.speaker}` : "📖 Catatan Kajian";
    ctx.fillText(speakerText, width / 2, 280);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(note.title, width / 2, 335);

    // 4. Arabic Verse (if present)
    let currentY = 440;
    if (arabicSnippet) {
      ctx.fillStyle = "#fef08a"; // Soft Quranic Gold
      ctx.font = "bold 52px 'Amiri', 'Traditional Arabic', serif";
      ctx.direction = "rtl";
      ctx.textAlign = "center";

      // Wrap Arabic text into lines
      const arabicWords = arabicSnippet.split(" ");
      let arabicLine = "";
      const maxArabicWidth = 850;

      for (let n = 0; n < arabicWords.length; n++) {
        const testLine = arabicLine + arabicWords[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxArabicWidth && n > 0) {
          ctx.fillText(arabicLine, width / 2, currentY);
          arabicLine = arabicWords[n] + " ";
          currentY += 85;
        } else {
          arabicLine = testLine;
        }
      }
      ctx.fillText(arabicLine, width / 2, currentY);
      currentY += 80;

      // Divider below Arabic
      ctx.strokeStyle = "rgba(254, 240, 138, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(300, currentY);
      ctx.lineTo(width - 300, currentY);
      ctx.stroke();
      currentY += 60;
    }

    // 5. Quote Text / Translation
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 36px 'Plus Jakarta Sans', sans-serif";
    ctx.direction = "ltr";
    ctx.textAlign = "center";

    const words = quoteText.split(" ");
    let line = "";
    const maxWidth = 860;
    const lineHeight = 56;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, currentY);

    // 6. Footer Signature
    const footerY = height - 120;
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(note.date ? `Dirangkum pada ${note.date}` : "Dirangkum dengan QK Notes", width / 2, footerY);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("🤲 Semoga Allah mudahkan segala urusan kita", width / 2, footerY + 36);

    // Trigger PNG Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `faidah-${note.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
    setDownloading(false);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `"${quoteText}"\n\n— ${note.speaker || "QK Notes"}`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn("Share cancelled or failed:", err);
      }
    } else {
      // Fallback copy text
      navigator.clipboard.writeText(`"${quoteText}"\n\n— ${note.speaker || note.title}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`rounded-3xl border w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 ${styles.modalBg}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center opacity-70"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${styles.pillBadge}`}>
            ✨
          </div>
          <div>
            <h3 className="text-base font-bold">
              Bagikan Faidah Ilmu
            </h3>
            <p className="text-xs opacity-70">
              Generate kartu kutipan estetik untuk Story & WhatsApp.
            </p>
          </div>
        </div>

        {/* Live Card Preview */}
        <div className={`rounded-2xl overflow-hidden bg-gradient-to-br text-white p-5 shadow-lg border my-3 text-center ${styles.quoteGradient}`}>
          <div className="text-[10px] tracking-widest uppercase font-bold text-amber-200/90 mb-1">
            FAIDAH KAJIAN
          </div>
          <p className={`text-xs font-semibold mb-3 truncate ${styles.quoteAccentText}`}>
            {note.speaker || "QK Notes"} · {note.title}
          </p>

          {arabicSnippet && (
            <div dir="rtl" className="font-arabic text-amber-100 text-xl leading-relaxed my-3 px-2">
              {arabicSnippet}
            </div>
          )}

          <p className="text-xs italic text-slate-100 leading-relaxed max-w-xs mx-auto mb-4 font-medium">
            &ldquo;{quoteText}&rdquo;
          </p>

          <div className="pt-2 border-t border-white/10 text-[9px] text-white/75 flex items-center justify-between">
            <span>🤲 QK Notes</span>
            <span>{note.date || "Kajian"}</span>
          </div>
        </div>

        {/* Edit Quote Content */}
        <div className="space-y-2 mt-4">
          <label className="block text-xs font-semibold opacity-85">
            Kutipan yang Dibagikan:
          </label>
          <textarea
            rows={3}
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 leading-relaxed ${styles.inputBg} ${styles.ringFocus}`}
          />
        </div>

        {/* Hidden Canvas for High-Resolution Export */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            onClick={handleShareNative}
            className="py-2.5 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className={`w-4 h-4 ${styles.accentIcon}`} />
                <span>Teks Disalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 opacity-70" />
                <span>Bagikan Teks</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 disabled:opacity-50 ${styles.primaryBtn}`}
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Membuat..." : "Unduh Gambar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

