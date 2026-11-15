import { CategoryItem, NoteItem, UserProfile } from "./types";

export const initialUser: UserProfile = {
  id: "guest-user",
  email: "",
  name: "Tamu",
  avatar: "🤲",
  streak_days: 0,
  notes_count: 0,
  last_note_date: "",
  is_logged_in: false,
};

export const initialCategories: CategoryItem[] = [
  {
    id: "all",
    name: "All",
    icon: "📦",
    bgColor: "bg-emerald-50 text-emerald-900 border-emerald-500",
    count: 0,
  },
  {
    id: "lectures",
    name: "Lectures",
    icon: "📖",
    bgColor: "bg-orange-50/70 text-amber-900 border-amber-200",
    count: 0,
  },
  {
    id: "parenting",
    name: "Parenting",
    icon: "🧸",
    bgColor: "bg-sky-50 text-sky-900 border-sky-200",
    count: 0,
  },
  {
    id: "family",
    name: "Family",
    icon: "🏡",
    bgColor: "bg-purple-50 text-purple-900 border-purple-200",
    count: 0,
  },
  {
    id: "faith",
    name: "Faith",
    icon: "🕋",
    bgColor: "bg-teal-50 text-teal-900 border-teal-200",
    count: 0,
  },
  {
    id: "character",
    name: "Character",
    icon: "🌱",
    bgColor: "bg-lime-50 text-lime-900 border-lime-200",
    count: 0,
  },
  {
    id: "fiqh",
    name: "Fiqh",
    icon: "⚖️",
    bgColor: "bg-amber-50 text-amber-900 border-amber-200",
    count: 0,
  },
  {
    id: "other",
    name: "Other",
    icon: "✨",
    bgColor: "bg-slate-100 text-slate-800 border-slate-200",
    count: 0,
  },
  {
    id: "language",
    name: "Language",
    icon: "🏷️",
    bgColor: "bg-rose-50 text-rose-900 border-rose-200",
    count: 0,
  },
];

export const initialNotes: NoteItem[] = [];

