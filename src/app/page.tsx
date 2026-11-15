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
import { storageService, calculateStreakOnNewNote } from "@/lib/storage";
import { CategoryItem, NoteItem, UserProfile } from "@/lib/types";
import { initialCategories, initialNotes, initialUser } from "@/lib/initialData";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [user, setUser] = useState<UserProfile>(initialUser);
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

  // Category filter state in Study tab
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  // Load initial data from storage & sync on auth state change
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedUser, loadedNotes, loadedCategories] = await Promise.all([
          storageService.getUser(),
          storageService.getNotes(),
          storageService.getCategories(),
        ]);
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
                setUser(initialUser);
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

    // Kalkulasi streak: hanya bertambah jika user membuat catatan baru setiap hari
    let updatedUser = { ...user };
    if (isNewNote) {
      const { newStreak, newDate } = calculateStreakOnNewNote(
        user.streak_days,
        user.last_note_date
      );
      updatedUser.streak_days = newStreak;
      updatedUser.last_note_date = newDate;
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

    const updatedUser = { ...user, notes_count: updatedNotes.length };
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
    await storageService.logoutUser();
    setUser(initialUser);
    setNotes([]);
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative select-none">
      {activeNote ? (
        /* --- VIEW READER JIKA SEDANG BUKA CATATAN --- */
        <NoteReader
          note={activeNote}
          onBack={() => setActiveNote(null)}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
          onTogglePin={handleTogglePin}
          onOpenShare={handleOpenShare}
        />
      ) : (
        /* --- MAIN APP TABS VIEW --- */
        <>
          {/* Top Header: Hanya menyisakan icon logout sesuai instruksi */}
          <Header
            user={user}
            onLogout={handleLogout}
            onLoginClick={() => setActiveTab("profile")}
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
                  isLoggedIn={user.is_logged_in}
                  onSelectNote={handleSelectNote}
                  onSeeAllClick={() => setActiveTab("study")}
                  onLoginClick={() => setActiveTab("profile")}
                  onTogglePin={handleTogglePin}
                />
              </>
            )}

            {activeTab === "study" && (
              <CategoryGrid
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                notes={notes}
                onSelectNote={handleSelectNote}
              />
            )}

            {activeTab === "search" && (
              <div className="p-5">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Search</h1>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-sm text-left flex items-center justify-between"
                >
                  <span>Ketik kata kunci atau tag...</span>
                  <span>🔍</span>
                </button>
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Semua Catatan ({notes.length})
                  </h3>
                  <RecentNotes
                    notes={notes}
                    isLoggedIn={user.is_logged_in}
                    onSelectNote={handleSelectNote}
                    onLoginClick={() => setActiveTab("profile")}
                    onTogglePin={handleTogglePin}
                  />
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileView
                user={user}
                notes={notes}
                onUserChange={handleUpdateUser}
                onLogout={handleLogout}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
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
    </div>
  );
}
