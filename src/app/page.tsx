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
import { ProfileModal } from "@/components/ProfileModal";
import { AuthModal } from "@/components/AuthModal";
import { storageService } from "@/lib/storage";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Category filter state in Study tab
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  // Load initial data from storage on mount
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
  }, []);

  // Handlers
  const handleSelectNote = (note: NoteItem) => {
    setActiveNote(note);
  };

  const handleCreateNewNote = () => {
    setNoteToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: NoteItem) => {
    setNoteToEdit(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (savedNote: NoteItem) => {
    const updated = await storageService.saveNote(savedNote);
    const updatedNotes = await storageService.getNotes();
    setNotes(updatedNotes);

    // Update active note if currently open
    if (activeNote && activeNote.id === updated.id) {
      setActiveNote(updated);
    }

    // Update user's note count
    const updatedUser = { ...user, notes_count: updatedNotes.length };
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

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    await storageService.saveUser(updatedUser);
  };

  // If reading a note, display the NoteReader view
  if (activeNote) {
    return (
      <NoteReader
        note={activeNote}
        onBack={() => setActiveNote(null)}
        onDelete={handleDeleteNote}
        onEdit={handleEditNote}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative select-none">
      {/* Top Header */}
      <Header
        user={user}
        currentCategoryTitle={
          activeTab === "study" ? "Study Notes" : "Lecture Notes"
        }
        onProfileClick={() => setIsProfileOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onDownloadClick={() => setIsProfileOpen(true)}
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
              onSelectNote={handleSelectNote}
              onSeeAllClick={() => setActiveTab("study")}
            />
          </>
        )}

        {activeTab === "study" && (
          <CategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onAddCategory={handleAddCategory}
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
              <RecentNotes notes={notes} onSelectNote={handleSelectNote} />
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-5">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile</h1>
            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-150">
              <div className="w-20 h-20 rounded-full bg-[#134e43] text-amber-300 flex items-center justify-center text-4xl mx-auto mb-3 shadow-md">
                🤲
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 mb-4">{user.email}</p>
              <div className="flex justify-center gap-4 text-xs font-semibold text-slate-700">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <div className="text-lg font-bold text-emerald-800">
                    {user.streak_days} Hari
                  </div>
                  <div className="text-[10px] text-slate-400">Streak</div>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <div className="text-lg font-bold text-emerald-800">
                    {notes.length}
                  </div>
                  <div className="text-[10px] text-slate-400">Total Notes</div>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Pengaturan Akun & Backup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "search") setIsSearchOpen(true);
        }}
        onNewNoteClick={handleCreateNewNote}
        showFab={!activeNote}
      />

      {/* Modals */}
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

      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        notes={notes}
        onClose={() => setIsProfileOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onUpdateUser={handleUpdateUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authedUser) => {
          handleUpdateUser(authedUser);
        }}
      />
    </div>
  );
}

