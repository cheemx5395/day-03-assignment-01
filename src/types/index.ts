export interface Note {
    id: number
    title: string
    description: string
    createdAt: string
}

export type NewNote = Omit<Note, "id" | "createdAt">