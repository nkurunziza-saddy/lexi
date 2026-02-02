import { useCallback, useEffect } from "react";
import { Editor } from "./components/editor";
import { PlusIcon } from "lucide-react";
import { useNotesStore } from "./store/use-notes-store";
import { NoteTab } from "@/components/note-tab";

function App() {
  const {
    notes,
    activeNoteId,
    addNote,
    updateNote,
    setActiveNote,
    deleteNote,
    duplicateNote,
    updateTitle,
  } = useNotesStore();

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Ensure there is at least one note on first load if store is empty
  useEffect(() => {
    // Check the actual store state to avoid closure staleness in Strict Mode
    if (useNotesStore.getState().notes.length === 0) {
      addNote();
    } else if (!activeNoteId) {
      setActiveNote(useNotesStore.getState().notes[0].id);
    }
  }, [activeNoteId, addNote, setActiveNote]);

  const handleChange = useCallback(
    (value: string) => {
      if (activeNoteId) {
        updateNote(activeNoteId, value);
      }
    },
    [activeNoteId, updateNote],
  );

  if (!activeNote) return null;

  return (
    <div className="flex flex-col h-screen justify-between">
      <Editor
        key={activeNote.id} // Force re-mount when switching notes
        showToolbar
        showFloatingToolbar
        enableSpeechToText
        placeholder="Start writing..."
        initialValue={activeNote.content}
        onChange={handleChange}
      />
      <div className="h-5 border-t border-editor-border/60 text-muted-foreground">
        <div className="flex divide-x divide-editor-border/60 w-full items-center h-full overflow-x-auto no-scrollbar">
          {notes.map((note) => (
            <NoteTab
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onActivate={() => setActiveNote(note.id)}
              onDelete={() => deleteNote(note.id)}
              onDuplicate={() => duplicateNote(note.id)}
              onRename={(title) => updateTitle(note.id, title)}
            />
          ))}
          <button
            onClick={addNote}
            className="w-10 min-w-10 px-2 border-r border-editor-border/60 text-xs cursor-pointer h-full flex items-center justify-center hover:bg-secondary/50 transition-colors"
          >
            <PlusIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
