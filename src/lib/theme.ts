import { AppTheme } from "./types";

export interface ThemeTokens {
  accentText: string;
  accentTextHover: string;
  accentIcon: string;
  primaryBtn: string;
  ringFocus: string;
  badgeBg: string;
  badgeAltBg: string;
  pillBadge: string;
  modalBg: string;
  surfaceMuted: string;
  hoverRow: string;
  selectedCard: string;
  dashedBtn: string;
  inputBg: string;
  streakCard: string;
  streakPill: string;
  streakSub: string;
  streakMuted: string;
  streakCircle: string;
  streakGlow: string;
  quoteGradient: string;
  quoteAccentText: string;
  quoteCanvasStops: [string, string, string];
}

export const THEME_STYLES: Record<AppTheme, ThemeTokens> = {
  light: {
    accentText: "text-emerald-700",
    accentTextHover: "text-emerald-700 hover:text-emerald-800",
    accentIcon: "text-emerald-600",
    primaryBtn: "bg-[#134e43] hover:bg-[#0e3b33] text-white",
    ringFocus: "focus:ring-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    badgeAltBg: "bg-teal-50 text-teal-700 border-teal-200/50",
    pillBadge: "bg-emerald-100 text-emerald-900",
    modalBg: "bg-white text-slate-900 border-slate-150",
    surfaceMuted: "bg-slate-50 border-slate-200 text-slate-700",
    hoverRow: "hover:bg-emerald-50/50 hover:border-emerald-200",
    selectedCard: "border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600 text-slate-900",
    dashedBtn: "border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-slate-50/50",
    inputBg: "border-slate-200 bg-white text-slate-900",
    streakCard: "from-[#144f44] via-[#0f4339] to-[#0a3129] shadow-emerald-900/10",
    streakPill: "bg-white text-emerald-950",
    streakSub: "text-emerald-100",
    streakMuted: "text-emerald-200/80",
    streakCircle: "bg-emerald-600/30 border-emerald-400/20",
    streakGlow: "bg-emerald-400/10",
    quoteGradient: "from-[#134e43] via-[#0e3b33] to-[#092822] border-emerald-700/40",
    quoteAccentText: "text-emerald-300",
    quoteCanvasStops: ["#134e43", "#0e3a32", "#08231e"],
  },
  sepia: {
    accentText: "text-[#8c5a2b]",
    accentTextHover: "text-[#8c5a2b] hover:text-[#6f441d]",
    accentIcon: "text-[#9c6631]",
    primaryBtn: "bg-[#8c5a2b] hover:bg-[#744820] text-white",
    ringFocus: "focus:ring-[#9c6631]",
    badgeBg: "bg-[#f3ebd9] text-[#6f441d] border-[#dbcbb2]",
    badgeAltBg: "bg-[#efe3cd] text-[#5c462f] border-[#dbcbb2]",
    pillBadge: "bg-[#f3ebd9] text-[#5c462f]",
    modalBg: "bg-[#faf6ee] text-[#423120] border-[#ebdcc7]",
    surfaceMuted: "bg-[#f3ebd9] border-[#e2d5bd] text-[#5c462f]",
    hoverRow: "hover:bg-[#f3ebd9]/70 hover:border-[#dbcbb2]",
    selectedCard: "border-[#8c5a2b] bg-[#f3ebd9] shadow-sm ring-1 ring-[#8c5a2b] text-[#423120]",
    dashedBtn: "border-[#dbcbb2] text-[#6f441d] hover:border-[#8c5a2b] hover:bg-[#f3ebd9]/60",
    inputBg: "border-[#e2d5bd] bg-[#fffcf5] text-[#423120]",
    streakCard: "from-[#8c5a2b] via-[#744820] to-[#5c3716] shadow-amber-950/15",
    streakPill: "bg-[#faf6ee] text-[#5c3716]",
    streakSub: "text-amber-100",
    streakMuted: "text-amber-200/85",
    streakCircle: "bg-amber-400/20 border-amber-200/25",
    streakGlow: "bg-amber-300/15",
    quoteGradient: "from-[#8c5a2b] via-[#744820] to-[#4a2c10] border-amber-700/40",
    quoteAccentText: "text-amber-200",
    quoteCanvasStops: ["#8c5a2b", "#744820", "#4a2c10"],
  },
  dark: {
    accentText: "text-emerald-300",
    accentTextHover: "text-emerald-300 hover:text-emerald-200",
    accentIcon: "text-emerald-400",
    primaryBtn: "bg-emerald-700 hover:bg-emerald-600 text-white",
    ringFocus: "focus:ring-emerald-400",
    badgeBg: "bg-[#0f342d] text-emerald-300 border-[#1d5247]",
    badgeAltBg: "bg-[#123d35] text-teal-200 border-[#1d5247]",
    pillBadge: "bg-[#0f342d] text-emerald-200",
    modalBg: "bg-[#0b2620] text-[#e0ece8] border-[#18493f]",
    surfaceMuted: "bg-[#0f342d] border-[#1d5247] text-emerald-200",
    hoverRow: "hover:bg-[#123d35]/70 hover:border-emerald-600/50",
    selectedCard: "border-emerald-400 bg-[#123d35] shadow-sm ring-1 ring-emerald-400 text-white",
    dashedBtn: "border-[#1d5247] text-emerald-200 hover:border-emerald-400 hover:bg-[#0f342d]",
    inputBg: "border-[#1d5247] bg-[#071915] text-white",
    streakCard: "from-[#0f3d34] via-[#0b2e27] to-[#071f1a] shadow-black/30",
    streakPill: "bg-emerald-950 text-emerald-200 border border-emerald-700/40",
    streakSub: "text-emerald-200",
    streakMuted: "text-emerald-300/80",
    streakCircle: "bg-emerald-500/20 border-emerald-400/25",
    streakGlow: "bg-emerald-400/10",
    quoteGradient: "from-[#0f3d34] via-[#0a2a23] to-[#061915] border-emerald-600/40",
    quoteAccentText: "text-emerald-300",
    quoteCanvasStops: ["#0f3d34", "#0a2a23", "#061915"],
  },
  kyutsii: {
    accentText: "text-pink-600",
    accentTextHover: "text-pink-600 hover:text-pink-700",
    accentIcon: "text-pink-500",
    primaryBtn: "bg-[#ec4899] hover:bg-[#db2777] text-white",
    ringFocus: "focus:ring-pink-400",
    badgeBg: "bg-[#ffe4ee] text-[#9d174d] border-[#f9b8d0]",
    badgeAltBg: "bg-[#ffd6e6] text-[#831843] border-[#f9b8d0]",
    pillBadge: "bg-[#ffe4ee] text-[#831843]",
    modalBg: "bg-[#fff5f8] text-[#4a152b] border-[#fbcfe8]",
    surfaceMuted: "bg-[#ffe4ee] border-[#f9b8d0] text-[#831843]",
    hoverRow: "hover:bg-[#ffe4ee]/70 hover:border-[#f9b8d0]",
    selectedCard: "border-pink-500 bg-[#ffe4ee] shadow-sm ring-1 ring-pink-500 text-[#4a152b]",
    dashedBtn: "border-[#f9b8d0] text-[#9d174d] hover:border-pink-400 hover:bg-[#ffe4ee]/60",
    inputBg: "border-[#f9b8d0] bg-white text-[#4a152b]",
    streakCard: "from-[#f472b6] via-[#ec4899] to-[#db2777] shadow-pink-500/20",
    streakPill: "bg-white text-[#9d174d]",
    streakSub: "text-pink-50",
    streakMuted: "text-pink-100/90",
    streakCircle: "bg-white/25 border-pink-100/40",
    streakGlow: "bg-pink-200/25",
    quoteGradient: "from-[#f472b6] via-[#ec4899] to-[#be185d] border-pink-300/40",
    quoteAccentText: "text-pink-100",
    quoteCanvasStops: ["#f472b6", "#ec4899", "#be185d"],
  },
};
