import type { NewNote, Note } from "../types";

const ID_KEY = "note_id_counter";

function getNextId(): number {
    const current = localStorage.getItem(ID_KEY);

    if (!current) {
        localStorage.setItem(ID_KEY, "1");
        return 1;
    }

    const nextId = Number(current) + 1;
    localStorage.setItem(ID_KEY, String(nextId));
    return nextId;
}

export function getNotes(): Note[] {
    const jsonString = localStorage.getItem("notes")
    if (!jsonString) return []
    try {
        return JSON.parse(jsonString)
    } catch (error) {
        console.error("Invalid JSON in localStorage for notes")
        return []
    }
}

export function addNote(note: NewNote) {
    const notes = getNotes() ?? [];

    const newNote: Note = {
        id: getNextId(),
        title: note.title,
        description: note.description,
        createdAt: new Date().toLocaleString(),
    };

    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
}
