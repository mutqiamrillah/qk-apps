import { initialCategories, initialNotes, initialUser } from "./initialData";
import { isSupabaseConfigured, supabase } from "./supabase";
import { CategoryItem, NoteItem, UserProfile } from "./types";

const STORAGE_KEYS = {
  USER: "qk_user_profile",
  NOTES: "qk_notes_list",
  CATEGORIES: "qk_categories_list",
};

export const storageService = {
  // --- USER PROFILE ---
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
            .single();

          if (profile) {
            return {
              id: profile.id,
              email: profile.email || authData.user.email || "",
              name: profile.name || "QK",
              streak_days: profile.streak_days ?? 3,
              notes_count: profile.notes_count ?? 12,
            };
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
    return JSON.parse(local);
  },

  saveUser: async (user: UserProfile): Promise<void> => {
    if (typeof window === "undefined") return;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          name: user.name,
          streak_days: user.streak_days,
          notes_count: user.notes_count,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase save user failed, storing locally:", err);
      }
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
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
    if (typeof window === "undefined") return initialNotes;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
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

    const local = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!local) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(initialNotes));
      return initialNotes;
    }
    return JSON.parse(local);
  },

  saveNote: async (note: NoteItem): Promise<NoteItem> => {
    const notes = await storageService.getNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    let updatedNotes: NoteItem[];

    const now = new Date().toISOString();
    const cleanNote: NoteItem = {
      ...note,
      updated_at: now,
      created_at: note.created_at || now,
    };

    if (index >= 0) {
      updatedNotes = [...notes];
      updatedNotes[index] = cleanNote;
    } else {
      updatedNotes = [cleanNote, ...notes];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
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
    const notes = await storageService.getNotes();
    const filtered = notes.filter((n) => n.id !== id);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
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

