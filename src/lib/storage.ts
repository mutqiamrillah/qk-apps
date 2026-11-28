import { initialCategories, initialNotes, initialUser } from "./initialData";
import { isSupabaseConfigured, supabase } from "./supabase";
import { CategoryItem, NoteItem, UserProfile } from "./types";

const STORAGE_KEYS = {
  USER: "qk_user_profile",
  NOTES: "qk_notes_list",
  CATEGORIES: "qk_categories_list",
};

// --- LOCAL DATE & TIMEZONE HELPERS ---

/**
 * Mengonversi objek Date atau string timestamp ke format YYYY-MM-DD dalam timezone lokal pengguna.
 * Menghilangkan bug pergeseran tanggal akibat konversi ISO UTC server.
 */
export function toLocalDateString(val?: string | Date): string {
  if (!val) return "";
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return "";
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  // Jika sudah berformat YYYY-MM-DD murni
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }
  // Jika berupa format ISO timestamp (misal: 2026-11-22T15:30:00Z)
  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

/**
 * Menghitung selisih hari kalender murni (date1 - date2) tanpa distorsi timezone atau jam.
 */
export function diffInDays(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 0;
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc1 - utc2) / msPerDay);
}

// --- STREAK CALCULATION LOGIC ---

export function calculateStreakOnNewNote(
  currentStreak: number,
  lastNoteDate?: string
): { newStreak: number; newDate: string } {
  const today = toLocalDateString(new Date());

  if (!lastNoteDate) {
    // Catatan pertama -> streak mulai dari 1
    return { newStreak: 1, newDate: today };
  }

  const last = toLocalDateString(lastNoteDate);
  if (!last) {
    return { newStreak: 1, newDate: today };
  }

  const diff = diffInDays(today, last);

  if (diff === 0) {
    // Note dibuat di hari lokal yang sama -> pertahankan streak aktif
    return { newStreak: Math.max(1, currentStreak), newDate: today };
  } else if (diff === 1) {
    // Hari berurutan (kemarin -> hari ini) -> tambah streak!
    return { newStreak: (currentStreak || 0) + 1, newDate: today };
  } else if (diff < 0) {
    // Antisipasi jika jam lokal pengguna sempat maju
    return { newStreak: Math.max(1, currentStreak), newDate: today };
  }

  // Terlewat 2 hari atau lebih -> reset ke 1
  return { newStreak: 1, newDate: today };
}

export function getEffectiveStreak(
  currentStreak: number,
  lastNoteDate?: string
): number {
  if (!lastNoteDate || currentStreak <= 0) return 0;

  const today = toLocalDateString(new Date());
  const last = toLocalDateString(lastNoteDate);
  if (!last) return 0;

  const diff = diffInDays(today, last);

  // Jika catatan terakhir dibuat hari ini (0) atau kemarin (1), streak masih terjaga!
  if (diff === 0 || diff === 1) {
    return currentStreak;
  }

  // Jika sudah lewat 2 hari atau lebih tanpa catatan baru, streak hangus
  return 0;
}

/**
 * Menghitung streak aktual secara deterministik dari riwayat catatan pengguna.
 * Menjamin streak tidak pernah salah hitung meski ada perbedaan timezone server / client.
 */
export function calculateStreakFromNotes(notes: NoteItem[]): {
  streak: number;
  lastDate?: string;
} {
  if (!notes || notes.length === 0) {
    return { streak: 0 };
  }

  // Kumpulkan semua tanggal lokal unik dari catatan
  const dateSet = new Set<string>();
  for (const n of notes) {
    const raw = n.created_at || n.date;
    const localDate = toLocalDateString(raw);
    if (localDate) {
      dateSet.add(localDate);
    }
  }

  if (dateSet.size === 0) {
    return { streak: 0 };
  }

  const today = toLocalDateString(new Date());
  const sortedDates = Array.from(dateSet).sort();
  const latestDate = sortedDates[sortedDates.length - 1];

  const diffFromToday = diffInDays(today, latestDate);

  // Jika catatan terakhir lebih dari 1 hari yang lalu (>= 2), streak putus
  if (diffFromToday > 1) {
    return { streak: 0, lastDate: latestDate };
  }

  // Telusuri hari berturut-turut ke belakang mulai dari latestDate
  let streak = 0;
  const [ly, lm, ld] = latestDate.split("-").map(Number);
  let curUtc = Date.UTC(ly, lm - 1, ld);
  const msPerDay = 1000 * 60 * 60 * 24;

  while (true) {
    const dObj = new Date(curUtc);
    const yStr = dObj.getUTCFullYear();
    const mStr = String(dObj.getUTCMonth() + 1).padStart(2, "0");
    const dStr = String(dObj.getUTCDate()).padStart(2, "0");
    const key = `${yStr}-${mStr}-${dStr}`;

    if (dateSet.has(key)) {
      streak++;
      curUtc -= msPerDay;
    } else {
      break;
    }
  }

  return { streak, lastDate: latestDate };
}

export const storageService = {
  // --- USER PROFILE & AUTH ---
  getUser: async (): Promise<UserProfile> => {
    if (typeof window === "undefined") return initialUser;

    const localAvatar = localStorage.getItem("qk_saved_avatar") || undefined;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const userSpecificAvatar = localStorage.getItem(`qk_user_avatar_${authData.user.id}`) || undefined;
          const userMetaAvatar = authData.user.user_metadata?.avatar;

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .maybeSingle();

          const resolvedAvatar =
            profile?.avatar ||
            userMetaAvatar ||
            userSpecificAvatar ||
            localAvatar ||
            "🤲";

          if (profile) {
            const effectiveStreak = getEffectiveStreak(
              profile.streak_days ?? 0,
              profile.last_note_date
            );

            const result: UserProfile = {
              id: profile.id,
              email: profile.email || authData.user.email || "",
              name: profile.name || authData.user.user_metadata?.name || "QK",
              avatar: resolvedAvatar,
              streak_days: effectiveStreak,
              notes_count: profile.notes_count ?? 0,
              last_note_date: profile.last_note_date || "",
              is_logged_in: true,
            };

            // Sinkronkan ke cache lokal agar tidak pernah reset
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result));
            localStorage.setItem("qk_saved_avatar", resolvedAvatar);
            localStorage.setItem(`qk_user_avatar_${profile.id}`, resolvedAvatar);

            return result;
          } else {
            // Profile row not found yet -> create it
            const newProfile: UserProfile = {
              id: authData.user.id,
              email: authData.user.email || "",
              name: authData.user.user_metadata?.name || "QK",
              avatar: resolvedAvatar,
              streak_days: 0,
              notes_count: 0,
              last_note_date: "",
              is_logged_in: true,
            };
            await storageService.saveUser(newProfile);
            return newProfile;
          }
        } else {
          // User belum login di Supabase -> check localStorage for guest/local user
          const local = localStorage.getItem(STORAGE_KEYS.USER);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (localAvatar && (!parsed.avatar || parsed.avatar === "🤲")) {
                parsed.avatar = localAvatar;
              }
              return parsed;
            } catch {
              // ignore
            }
          }
          return {
            ...initialUser,
            avatar: localAvatar || initialUser.avatar || "🤲",
          };
        }
      } catch (err) {
        console.warn("Supabase user fetch fallback to local:", err);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.USER);
    if (!local) {
      const defaultUser = {
        ...initialUser,
        avatar: localAvatar || initialUser.avatar || "🤲",
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    const parsed = JSON.parse(local);
    parsed.avatar = parsed.avatar || localAvatar || "🤲";
    parsed.streak_days = getEffectiveStreak(parsed.streak_days, parsed.last_note_date);
    return parsed;
  },

  saveUser: async (
    user: UserProfile,
    options?: { syncAuthMetadata?: boolean }
  ): Promise<void> => {
    if (typeof window === "undefined") return;

    // Selalu simpan ke localStorage secara instan & persisten
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (user.avatar) {
      localStorage.setItem("qk_saved_avatar", user.avatar);
      if (user.id) {
        localStorage.setItem(`qk_user_avatar_${user.id}`, user.avatar);
      }
    }

    if (isSupabaseConfigured && supabase && user.is_logged_in) {
      try {
        // 1. Sinkronkan metadata Auth hanya saat profil/avatar eksplisit diubah (hindari race USER_UPDATED saat simpan note)
        if (options?.syncAuthMetadata && (user.avatar || user.name)) {
          await supabase.auth.updateUser({
            data: {
              ...(user.avatar ? { avatar: user.avatar } : {}),
              ...(user.name ? { name: user.name } : {}),
            },
          }).catch((err) => console.warn("Supabase auth updateUser metadata warning:", err));
        }

        // 2. Simpan ke tabel profiles
        const payload: Record<string, any> = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "🤲",
          streak_days: user.streak_days,
          notes_count: user.notes_count,
          last_note_date: user.last_note_date || null,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" });
        if (error) {
          console.warn("Supabase profiles upsert warning:", error.message, error.code);
          let shouldRetry = false;
          if (error.message?.includes("avatar")) {
            delete payload.avatar;
            shouldRetry = true;
          }
          if (error.message?.includes("last_note_date")) {
            delete payload.last_note_date;
            shouldRetry = true;
          }
          if (shouldRetry) {
            const { error: retryError } = await supabase
              .from("profiles")
              .upsert(payload, { onConflict: "id" });
            if (retryError) {
              console.error("Supabase profiles retry upsert error:", retryError);
            }
          }
        }
      } catch (err) {
        console.warn("Supabase save user failed, storing locally:", err);
      }
    }
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
        if (authData?.user) {
          const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", authData.user.id)
            .order("created_at", { ascending: false });

          if (!error && data) {
            const mapped: NoteItem[] = data.map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category || "Lectures",
              speaker: d.speaker || "",
              source: d.source || "",
              episode_no: d.episode_no || "",
              tags: Array.isArray(d.tags) ? d.tags : [],
              status: d.status || "Online",
              is_pinned: Boolean(d.is_pinned),
              is_favorite: Boolean(d.is_favorite),
              date: d.date || new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              content: d.content || "",
              user_id: d.user_id,
              created_at: d.created_at,
              updated_at: d.updated_at,
            }));

            const userNotesKey = `${STORAGE_KEYS.NOTES}_${authData.user.id}`;
            localStorage.setItem(userNotesKey, JSON.stringify(mapped));
            return mapped;
          } else if (error) {
            console.error("Supabase getNotes error:", error);
          }
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

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          cleanNote.user_id = authData.user.id;
          const notePayload: Record<string, any> = {
            id: cleanNote.id,
            user_id: authData.user.id,
            title: cleanNote.title,
            category: cleanNote.category,
            speaker: cleanNote.speaker,
            source: cleanNote.source,
            episode_no: cleanNote.episode_no,
            tags: cleanNote.tags,
            status: cleanNote.status,
            is_pinned: Boolean(cleanNote.is_pinned),
            is_favorite: Boolean(cleanNote.is_favorite),
            date: cleanNote.date,
            content: cleanNote.content,
            updated_at: now,
          };

          const { error: upsertErr } = await supabase.from("notes").upsert(notePayload);
          if (upsertErr) {
            // Fallback jika kolom is_pinned/is_favorite belum di-alter di Supabase
            if (upsertErr.message?.includes("is_pinned") || upsertErr.message?.includes("is_favorite")) {
              delete notePayload.is_pinned;
              delete notePayload.is_favorite;
              await supabase.from("notes").upsert(notePayload);
            } else {
              console.error("Supabase save note error:", upsertErr);
            }
          }
        }
      } catch (err) {
        console.warn("Supabase save note failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      const activeUserId = cleanNote.user_id || currentUser.id;
      const userNotesKey = `${STORAGE_KEYS.NOTES}_${activeUserId}`;
      localStorage.setItem(userNotesKey, JSON.stringify(updatedNotes));
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
