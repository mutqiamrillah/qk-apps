import { initialCategories, initialNotes, initialUser } from "./initialData";
import { isSupabaseConfigured, supabase } from "./supabase";
import { CategoryItem, NoteItem, UserProfile } from "./types";

const STORAGE_KEYS = {
  USER: "qk_user_profile",
  NOTES: "qk_notes_list",
  CATEGORIES: "qk_categories_list",
};

// --- STREAK CALCULATION LOGIC ---
export function calculateStreakOnNewNote(
  currentStreak: number,
  lastNoteDate?: string
): { newStreak: number; newDate: string } {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (!lastNoteDate) {
    // First ever note created -> streak starts at 1
    return { newStreak: 1, newDate: today };
  }

  if (lastNoteDate === today) {
    // Note created today already -> maintain current streak (don't increment twice in same day)
    return { newStreak: Math.max(1, currentStreak), newDate: today };
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (lastNoteDate === yesterday) {
    // Consecutive day -> increment streak!
    return { newStreak: (currentStreak || 0) + 1, newDate: today };
  }

  // Missed one or more days -> streak resets to 1
  return { newStreak: 1, newDate: today };
}

export function getEffectiveStreak(
  currentStreak: number,
  lastNoteDate?: string
): number {
  if (!lastNoteDate || currentStreak <= 0) return 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (lastNoteDate === today || lastNoteDate === yesterday) {
    return currentStreak;
  }
  // Streak broken
  return 0;
}

export const storageService = {
  // --- USER PROFILE & AUTH ---
  getUser: async (): Promise<UserProfile> => {
    if (typeof window === "undefined") return initialUser;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .maybeSingle();

          if (profile) {
            const effectiveStreak = getEffectiveStreak(
              profile.streak_days ?? 0,
              profile.last_note_date
            );

            return {
              id: profile.id,
              email: profile.email || authData.user.email || "",
              name: profile.name || authData.user.user_metadata?.name || "QK",
              streak_days: effectiveStreak,
              notes_count: profile.notes_count ?? 0,
              last_note_date: profile.last_note_date || "",
              is_logged_in: true,
            };
          } else {
            // Profile row not found yet -> create it
            const newProfile: UserProfile = {
              id: authData.user.id,
              email: authData.user.email || "",
              name: authData.user.user_metadata?.name || "QK",
              streak_days: 0,
              notes_count: 0,
              last_note_date: "",
              is_logged_in: true,
            };
            await storageService.saveUser(newProfile);
            return newProfile;
          }
        }
      } catch (err) {
        console.warn("Supabase user fetch fallback to local:", err);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.USER);
    if (!local) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUser));
      return initialUser;
    }
    const parsed = JSON.parse(local);
    parsed.streak_days = getEffectiveStreak(parsed.streak_days, parsed.last_note_date);
    return parsed;
  },

  saveUser: async (user: UserProfile): Promise<void> => {
    if (typeof window === "undefined") return;

    if (isSupabaseConfigured && supabase && user.is_logged_in) {
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          name: user.name,
          email: user.email,
          streak_days: user.streak_days,
          notes_count: user.notes_count,
          last_note_date: user.last_note_date,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase save user failed, storing locally:", err);
      }
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  logoutUser: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signout failed:", err);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // --- CATEGORIES ---
  getCategories: async (): Promise<CategoryItem[]> => {
    if (typeof window === "undefined") return initialCategories;

    const local = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!local) {
      localStorage.setItem(
        STORAGE_KEYS.CATEGORIES,
        JSON.stringify(initialCategories)
      );
      return initialCategories;
    }
    return JSON.parse(local);
  },

  saveCategories: async (categories: CategoryItem[]): Promise<void> => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // --- NOTES CRUD ---
  getNotes: async (): Promise<NoteItem[]> => {
    if (typeof window === "undefined") return [];

    const currentUser = await storageService.getUser();
    // Jika belum login, tidak menampilkan catatan karena catatan bersifat per-user
    if (!currentUser.is_logged_in) {
      return [];
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) {
          return [];
        }

        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category || "Lectures",
            speaker: d.speaker || "",
            source: d.source || "",
            episode_no: d.episode_no || "",
            tags: Array.isArray(d.tags) ? d.tags : [],
            status: d.status || "Online",
            date: d.date || new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            content: d.content || "",
            user_id: d.user_id,
            created_at: d.created_at,
            updated_at: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase fetch notes failed, using local storage:", err);
      }
    }

    const userNotesKey = `${STORAGE_KEYS.NOTES}_${currentUser.id}`;
    const local = localStorage.getItem(userNotesKey);
    if (!local) {
      return [];
    }
    return JSON.parse(local);
  },

  saveNote: async (note: NoteItem): Promise<NoteItem> => {
    const currentUser = await storageService.getUser();
    const notes = await storageService.getNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    let updatedNotes: NoteItem[];

    const now = new Date().toISOString();
    const cleanNote: NoteItem = {
      ...note,
      user_id: currentUser.id,
      updated_at: now,
      created_at: note.created_at || now,
    };

    if (index >= 0) {
      updatedNotes = [...notes];
      updatedNotes[index] = cleanNote;
    } else {
      updatedNotes = [cleanNote, ...notes];
    }

    if (typeof window !== "undefined" && currentUser.is_logged_in) {
      const userNotesKey = `${STORAGE_KEYS.NOTES}_${currentUser.id}`;
      localStorage.setItem(userNotesKey, JSON.stringify(updatedNotes));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        await supabase.from("notes").upsert({
          id: cleanNote.id,
          user_id: authData?.user?.id || null,
          title: cleanNote.title,
          category: cleanNote.category,
          speaker: cleanNote.speaker,
          source: cleanNote.source,
          episode_no: cleanNote.episode_no,
          tags: cleanNote.tags,
          status: cleanNote.status,
          date: cleanNote.date,
          content: cleanNote.content,
          updated_at: now,
        });
      } catch (err) {
        console.warn("Supabase save note failed:", err);
      }
    }

    return cleanNote;
  },

  deleteNote: async (id: string): Promise<void> => {
    const currentUser = await storageService.getUser();
    const notes = await storageService.getNotes();
    const filtered = notes.filter((n) => n.id !== id);

    if (typeof window !== "undefined" && currentUser.is_logged_in) {
      const userNotesKey = `${STORAGE_KEYS.NOTES}_${currentUser.id}`;
      localStorage.setItem(userNotesKey, JSON.stringify(filtered));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("notes").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete note failed:", err);
      }
    }
  },
};
