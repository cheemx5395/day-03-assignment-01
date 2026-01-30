export interface Note {
    title: string
    description: string
    createdAt: string
}

export type NewNote = Omit<Note, "createdAt">