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

