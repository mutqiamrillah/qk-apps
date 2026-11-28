export type AppTheme = "light" | "sepia" | "dark" | "kyutsii";

/**
 * Validates and normalizes an external URL for safe hyperlink rendering.
 * Only http: and https: protocols are allowed (blocks javascript:, data:, etc.).
 */
export function sanitizeSafeUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith("//")) return null;

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function calculateReadingStats(content: string = ""): { words: number; minutes: number } {
  const clean = content
    .replace(/:::[^:]+:::/g, " ")
    .replace(/[#*=_`>-]/g, " ")
    .trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return { words, minutes };
}

export function formatFullDateTime(dateStr?: string, created_at?: string): string {
  const candidate = created_at || dateStr;
  if (!candidate) return "";

  const d = new Date(candidate);
  if (!isNaN(d.getTime())) {
    const day = d.getDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const seconds = d.getSeconds().toString().padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
  }

  return dateStr || "";
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string; // Emoji avatar e.g. "🤲", "👳‍♂️", "🧕", "📖", "🌙"
  streak_days: number;
  notes_count: number;
  last_note_date?: string; // YYYY-MM-DD
  is_logged_in?: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  category: string;
  speaker?: string;
  source?: string;
  episode_no?: string;
  tags: string[];
  status: "Online" | "Draft" | "Archived";
  is_pinned?: boolean;
  is_favorite?: boolean;
  date: string;
  content: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  borderColor?: string;
  textColor?: string;
  count: number;
}

