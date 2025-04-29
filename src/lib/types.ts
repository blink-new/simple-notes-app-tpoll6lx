
export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  category?: string
  isPinned?: boolean
  images?: string[]
  tags?: string[]
  collaborators?: string[]
  isSaving?: boolean
}

export interface Category {
  id: string
  name: string
  color: string
}