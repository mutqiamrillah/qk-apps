import { CategoryItem, NoteItem, UserProfile } from "./types";

export const initialUser: UserProfile = {
  id: "user-default-1",
  email: "user@qk-notes.local",
  name: "QK",
  streak_days: 3,
  notes_count: 12,
};

export const initialCategories: CategoryItem[] = [
  {
    id: "all",
    name: "All",
    icon: "📦",
    bgColor: "bg-emerald-50 text-emerald-900 border-emerald-500",
    count: 12,
  },
  {
    id: "lectures",
    name: "Lectures",
    icon: "📖",
    bgColor: "bg-orange-50/70 text-amber-900 border-amber-200",
    count: 11,
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
    count: 1,
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

export const initialNotes: NoteItem[] = [
  {
    id: "note-1",
    title: "Untitled",
    category: "Lectures",
    date: "Nov 14, 2026",
    status: "Online",
    tags: ["general"],
    content: "Rangkuman catatan ceramah umum singkat...",
    created_at: "2026-11-14T10:00:00Z",
    updated_at: "2026-11-14T10:00:00Z",
  },
  {
    id: "note-2",
    title: "268 | Tadzkaratus Saami'",
    category: "Lectures",
    speaker: "Ustadz Muhammad Nuzul Dzikri",
    episode_no: "No. 268",
    date: "Nov 14, 2026",
    status: "Online",
    tags: ["sabar"],
    content: `### 1. Hakikat Kesabaran dan Pertolongan Allah

Sabar yang sejati harus disertai dengan memohon pertolongan kepada Allah. Hal ini sebagaimana firman Allah dalam Surah An-Nahl ayat 127:

:::arabic
وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ وَلَا تَحْزَنْ عَلَيْهِمْ وَلَا تَكُ فِي ضَيْقٍ مِّمَّا يَمْكُرُونَ
:::
*Artinya: “Bersabarlah (Nabi Muhammad) dan kesabaranmu itu semata-mata dengan (pertolongan) Allah. Janganlah bersedih terhadap (kekufuran) mereka dan jangan (pula) bersempit dada terhadap tipu daya yang mereka rencanakan.”*

Sabar yang sejati tercermin dalam firman Allah:

:::arabic
وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ
:::
*Artinya, kesabaran kita hanya dapat terwujud dengan pertolongan Allah.*

### 2. Mengenai Allah dalam Keadaan Lapang dan Sempit

Mengenal Allah di waktu lapang akan membuat Allah senantiasa menolong hamba-Nya di waktu sempit. Tawakal dan keridhaan hati adalah kunci ketenangan seorang mukmin menghadapi segala takdir.`,
    created_at: "2026-11-14T09:30:00Z",
    updated_at: "2026-11-14T09:30:00Z",
  },
  {
    id: "note-3",
    title: "Kisah Nabi-Nabi #5 : Hud عَلَيْهِ السَّلَام",
    category: "Lectures",
    speaker: "Ustadz Khalid Basalamah",
    episode_no: "#5",
    date: "Nov 14, 2026",
    status: "Online",
    tags: ["kisah-nabi", "tauhid"],
    content: `### Dakwah Nabi Hud Kepada Kaum 'Aad

Kaum 'Aad diberikan karunia fisik yang perkasa dan bangunan-bangunan megah di bukit-bukit pasir (Al-Ahqaf), namun kesombongan membutakan hati mereka hingga mendustakan utusan Allah.

:::arabic
وَإِلَىٰ عَادٍ أَخَاهُمْ هُودًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ
:::
*Artinya: “Dan kepada kaum 'Aad (Kami utus) saudara mereka, Hud. Dia berkata: Wahai kaumku! Sembahlah Allah, tidak ada sesembahan bagimu selain Dia.” (QS. Hud: 50)*

Pelajaran utama dari kisah ini adalah betapa bahayanya istidraj dan rasa sombong atas nikmat kekuatan duniawi.`,
    created_at: "2026-11-14T08:00:00Z",
    updated_at: "2026-11-14T08:00:00Z",
  },
];

