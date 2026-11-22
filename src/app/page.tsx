"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StudyStreakCard } from "@/components/StudyStreakCard";
import { RecentNotes } from "@/components/RecentNotes";
import { CategoryGrid } from "@/components/CategoryGrid";
import { NoteReader } from "@/components/NoteReader";
import { NoteEditorModal } from "@/components/NoteEditorModal";
import { BottomNav, NavTab } from "@/components/BottomNav";
import { SearchModal } from "@/components/SearchModal";
import { ProfileView } from "@/components/ProfileView";
import { ShareQuoteModal } from "@/components/ShareQuoteModal";
import { DailyWisdomModal } from "@/components/DailyWisdomModal";
import { storageService, calculateStreakOnNewNote, calculateStreakFromNotes, toLocalDateString } from "@/lib/storage";
import { CategoryItem, NoteItem, UserProfile, AppTheme } from "@/lib/types";
import { initialCategories, initialNotes, initialUser } from "@/lib/initialData";
import { DailyWisdom, getRandomDailyWisdom } from "@/lib/dailyWisdom";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [theme, setTheme] = useState<AppTheme>("light");
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("qk_saved_avatar");
      const local = localStorage.getItem("qk_user");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (savedAvatar) parsed.avatar = savedAvatar;
          return parsed;
        } catch {
          // fallback
        }
      }
      if (savedAvatar) {
        return { ...initialUser, avatar: savedAvatar };
      }
    }
    return initialUser;
  });
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);

  // Active note for reader screen
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareNote, setShareNote] = useState<NoteItem | null>(null);

  // Daily Wisdom (Nasihat Al-Qur'an & Hadits harian)
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom | null>(null);
  const [isDailyWisdomOpen, setIsDailyWisdomOpen] = useState(false);

  // Munculkan nasihat secara otomatis ketika pertama kali membuka aplikasi di hari tersebut
  useEffect(() => {
    if (typeof window !== "undefined") {
      const today = toLocalDateString(new Date());
      const lastSeen = localStorage.getItem("qk_last_daily_wisdom_date");

      const wisdom = getRandomDailyWisdom(today);
      setDailyWisdom(wisdom);

      // Hanya auto-popup jika belum pernah dibuka pada hari ini
      if (lastSeen !== today) {
        setIsDailyWisdomOpen(true);
      }
    }
  }, []);

  const handleCloseDailyWisdom = () => {
    setIsDailyWisdomOpen(false);
    if (typeof window !== "undefined") {
      const today = toLocalDateString(new Date());
      localStorage.setItem("qk_last_daily_wisdom_date", today);
    }
  };

  const handleOpenDailyWisdomManually = () => {
    if (!dailyWisdom) {
      const today = toLocalDateString(new Date());
      setDailyWisdom(getRandomDailyWisdom(today));
    }
    setIsDailyWisdomOpen(true);
  };

  // Category filter state in Study tab
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  // Load initial theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("qk_app_theme") as AppTheme | null;
      if (savedTheme && ["light", "sepia", "dark"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    }
  }, []);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("qk_app_theme", newTheme);
    }
  };

  const handleCycleTheme = () => {
    const next: Record<AppTheme, AppTheme> = {
      light: "sepia",
      sepia: "dark",
      dark: "light",
    };
    handleThemeChange(next[theme]);
  };

  // Load initial data from storage & sync on auth state change
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedUser, loadedNotes, loadedCategories] = await Promise.all([
          storageService.getUser(),
          storageService.getNotes(),
          storageService.getCategories(),
        ]);

        // Rekonsiliasi streak dari catatan aktual agar bebas dari distorsi timezone UTC server
        if (loadedNotes && loadedNotes.length > 0) {
          const { streak: calculatedStreak, lastDate } = calculateStreakFromNotes(loadedNotes);
          if (calculatedStreak > 0 && calculatedStreak !== loadedUser.streak_days) {
            loadedUser.streak_days = calculatedStreak;
            if (lastDate) loadedUser.last_note_date = lastDate;
            await storageService.saveUser(loadedUser);
          }
        }

        setUser(loadedUser);
        setNotes(loadedNotes);
        setCategories(loadedCategories);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    }
    loadData();

    // Listen to real-time auth changes from Supabase
    if (typeof window !== "undefined") {
      import("@/lib/supabase").then(({ supabase, isSupabaseConfigured }) => {
        if (isSupabaseConfigured && supabase) {
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (session?.user) {
                const refreshedUser = await storageService.getUser();
                const refreshedNotes = await storageService.getNotes();
                setUser(refreshedUser);
                setNotes(refreshedNotes);
              } else {
                const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("qk_saved_avatar") : null;
                setUser({
                  ...initialUser,
                  avatar: savedAvatar || initialUser.avatar || "🤲",
                });
                setNotes([]);
              }
            }
          );
          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      });
    }
  }, []);

  // Handlers
  const handleSelectNote = (note: NoteItem) => {
    setActiveNote(note);
  };

  const handleCreateNewNote = () => {
    if (!user.is_logged_in) {
      setActiveTab("profile");
      return;
    }
    setNoteToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: NoteItem) => {
    setNoteToEdit(note);
    setIsEditorOpen(true);
  };

  const handleTogglePin = async (note: NoteItem) => {
    const updatedNote: NoteItem = {
      ...note,
      is_pinned: !note.is_pinned,
    };
    await handleSaveNote(updatedNote);
  };

  const handleToggleFavorite = async (note: NoteItem) => {
    const updatedNote: NoteItem = {
      ...note,
      is_favorite: !note.is_favorite,
    };
    await handleSaveNote(updatedNote);
  };

  const handleImportNotes = async (importedNotes: NoteItem[]) => {
    try {
      for (const item of importedNotes) {
        await storageService.saveNote(item);
      }
      const refreshedNotes = await storageService.getNotes();
      setNotes(refreshedNotes);

      const { streak: calculatedStreak, lastDate } = calculateStreakFromNotes(refreshedNotes);
      const updatedUser = {
        ...user,
        streak_days: calculatedStreak > 0 ? calculatedStreak : user.streak_days,
        last_note_date: lastDate || user.last_note_date,
        notes_count: refreshedNotes.length,
      };
      setUser(updatedUser);
      await storageService.saveUser(updatedUser);
    } catch (err) {
      console.error("Gagal mengimpor catatan:", err);
    }
  };

  const handleOpenShare = (note: NoteItem) => {
    setShareNote(note);
    setIsShareOpen(true);
  };

  const handleSaveNote = async (savedNote: NoteItem) => {
    const isNewNote = !notes.some((n) => n.id === savedNote.id);
    const updated = await storageService.saveNote(savedNote);

    // Langsung update active note agar tampilan NoteReader langsung ter-refresh seketika
    if (activeNote && activeNote.id === updated.id) {
      setActiveNote({ ...updated });
    }

    const updatedNotes = await storageService.getNotes();
    setNotes(updatedNotes);

    // Hitung streak dari riwayat catatan aktual (bebas dari distorsi timezone UTC server)
    const { streak: calculatedStreak, lastDate } = calculateStreakFromNotes(updatedNotes);

    let updatedUser = { ...user };
    if (isNewNote) {
      if (calculatedStreak > 0) {
        updatedUser.streak_days = calculatedStreak;
        if (lastDate) updatedUser.last_note_date = lastDate;
      } else {
        const { newStreak, newDate } = calculateStreakOnNewNote(
          user.streak_days,
          user.last_note_date
        );
        updatedUser.streak_days = newStreak;
        updatedUser.last_note_date = newDate;
      }
    }
    updatedUser.notes_count = updatedNotes.length;

    setUser(updatedUser);
    await storageService.saveUser(updatedUser);
  };

  const handleDeleteNote = async (id: string) => {
    await storageService.deleteNote(id);
    const updatedNotes = await storageService.getNotes();
    setNotes(updatedNotes);
    setActiveNote(null);

    const { streak: calculatedStreak, lastDate } = calculateStreakFromNotes(updatedNotes);
    const updatedUser = {
      ...user,
      streak_days: calculatedStreak,
      last_note_date: lastDate || user.last_note_date,
      notes_count: updatedNotes.length,
    };
    setUser(updatedUser);
    await storageService.saveUser(updatedUser);
  };

  const handleAddCategory = async (catName: string) => {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: catName,
      icon: "📌",
      bgColor: "bg-teal-50 text-teal-900 border-teal-200",
      count: 0,
    };
    const updatedCategories = [...categories, newCat];
    setCategories(updatedCategories);
    await storageService.saveCategories(updatedCategories);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (categoryId === "all") return;
    const updatedCategories = categories.filter((c) => c.id !== categoryId);
    setCategories(updatedCategories);
    await storageService.saveCategories(updatedCategories);
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId("all");
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    await storageService.saveUser(updatedUser);
    if (updatedUser.is_logged_in) {
      const userNotes = await storageService.getNotes();
      setNotes(userNotes);
    } else {
      setNotes([]);
    }
  };

  const handleLogout = async () => {
    const savedAvatar = typeof window !== "undefined" ? localStorage.getItem("qk_saved_avatar") : null;
    await storageService.logoutUser();
    setUser({
      ...initialUser,
      avatar: savedAvatar || initialUser.avatar || "🤲",
    });
    setNotes([]);
    setActiveTab("home");
  };

  const appContainerClasses = {
    light: "bg-white text-slate-900",
    sepia: "bg-[#faf6ee] text-[#423120]",
    dark: "bg-[#071915] text-[#d1e5df]",
  }[theme];

  return (
    <div className={`min-h-screen flex flex-col relative select-none transition-colors duration-200 ${appContainerClasses}`}>
      {activeNote ? (
        /* --- VIEW READER JIKA SEDANG BUKA CATATAN --- */
        <NoteReader
          note={activeNote}
          theme={theme}
          onThemeChange={handleThemeChange}
          onBack={() => setActiveNote(null)}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
          onOpenShare={handleOpenShare}
        />
      ) : (
        /* --- MAIN APP TABS VIEW --- */
        <>
          {/* Top Header dengan Theme Toggle Icon & Logout/Login */}
          <Header
            user={user}
            theme={theme}
            onCycleTheme={handleCycleTheme}
            onOpenDailyWisdom={handleOpenDailyWisdomManually}
            onLogout={handleLogout}
            onLoginClick={() => setActiveTab("profile")}
            onAvatarClick={() => setActiveTab("profile")}
          />

          {/* Main Content by Tab */}
          <main className="flex-1">
            {activeTab === "home" && (
              <>
                <StudyStreakCard
                  days={user.streak_days}
                  totalNotes={notes.length}
                />
                <RecentNotes
                  notes={notes}
                  theme={theme}
                  isLoggedIn={user.is_logged_in}
                  onSelectNote={handleSelectNote}
                  onSeeAllClick={() => setActiveTab("study")}
                  onLoginClick={() => setActiveTab("profile")}
                  onTogglePin={handleTogglePin}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            )}

            {activeTab === "study" && (
              <CategoryGrid
                categories={categories}
                theme={theme}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                notes={notes}
                onSelectNote={handleSelectNote}
              />
            )}

            {activeTab === "search" && (
              <div className="pt-3 pb-24">
                <div className="px-5">
                  <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#423120]" : "text-slate-900"}`}>
                    Search
                  </h1>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`w-full p-4 rounded-2xl border text-sm text-left flex items-center justify-between transition ${
                      theme === "dark"
                        ? "bg-[#0b231e] border-[#16443b] text-emerald-200/60 hover:border-emerald-500"
                        : theme === "sepia"
                        ? "bg-[#f3ebd9] border-[#e2d5bd] text-[#5c462f]/70 hover:border-amber-400"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-300"
                    }`}
                  >
                    <span>Ketik kata kunci atau tag...</span>
                    <span>🔍</span>
                  </button>
                </div>
                <div className="mt-2">
                  <RecentNotes
                    notes={notes}
                    theme={theme}
                    isLoggedIn={user.is_logged_in}
                    onSelectNote={handleSelectNote}
                    onLoginClick={() => setActiveTab("profile")}
                    onTogglePin={handleTogglePin}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileView
                user={user}
                notes={notes}
                theme={theme}
                onUserChange={handleUpdateUser}
                onLogout={handleLogout}
                onImportNotes={handleImportNotes}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            theme={theme}
            isLoggedIn={user.is_logged_in}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === "search") setIsSearchOpen(true);
            }}
            onNewNoteClick={handleCreateNewNote}
            showFab={user.is_logged_in && activeTab !== "profile"}
          />
        </>
      )}

      {/* Modals SELALU RENDER di level root agar Edit Note langsung terbuka dan bekerja */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        noteToEdit={noteToEdit}
        categories={categories}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
      />

      <SearchModal
        isOpen={isSearchOpen}
        notes={notes}
        onClose={() => setIsSearchOpen(false)}
        onSelectNote={handleSelectNote}
      />

      <ShareQuoteModal
        isOpen={isShareOpen}
        note={shareNote || activeNote}
        onClose={() => {
          setIsShareOpen(false);
          setShareNote(null);
        }}
      />

      {/* Pop-up Nasihat Harian Otomatis saat Pertama Buka Hari Ini */}
      <DailyWisdomModal
        isOpen={isDailyWisdomOpen}
        wisdom={dailyWisdom}
        theme={theme}
        onClose={handleCloseDailyWisdom}
      />
    </div>
  );
}
