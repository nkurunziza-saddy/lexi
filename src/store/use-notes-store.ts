import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  addNote: () => void;
  updateNote: (id: string, content: string) => void;
  updateTitle: (id: string, title: string) => void;
  setActiveNote: (id: string) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
}

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      activeNoteId: null,

      addNote: () => {
        const id = generateId();
        const newNote: Note = {
          id,
          title: "New Note",
          content: "",
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          notes: [...state.notes, newNote],
          activeNoteId: id,
        }));
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, content, updatedAt: new Date().toISOString() }
              : note,
          ),
        }));
      },

      updateTitle: (id, title) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, title, updatedAt: new Date().toISOString() }
              : note,
          ),
        }));
      },

      setActiveNote: (id) => {
        set({ activeNoteId: id });
      },

      duplicateNote: (id) => {
        set((state) => {
          const noteToDuplicate = state.notes.find((n) => n.id === id);
          if (!noteToDuplicate) return {};

          const newId = generateId();
          const newNote: Note = {
            ...noteToDuplicate,
            id: newId,
            title: `${noteToDuplicate.title} (Copy)`,
            updatedAt: new Date().toISOString(),
          };

          return {
            notes: [...state.notes, newNote],
            activeNoteId: newId,
          };
        });
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = state.notes.filter((n) => n.id !== id);
          // If active note is deleted, set active to the first available or null
          let newActiveId = state.activeNoteId;
          if (state.activeNoteId === id) {
            newActiveId = newNotes.length > 0 ? newNotes[0].id : null;
          }
          return { notes: newNotes, activeNoteId: newActiveId };
        });
      },
    }),
    {
      name: "lexi-notes-storage",
    },
  ),
);
