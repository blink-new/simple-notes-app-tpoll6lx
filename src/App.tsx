
import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Moon, Sun, Pin, PinOff, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card } from './components/ui/card'
import { ScrollArea } from './components/ui/scroll-area'
import { Textarea } from './components/ui/textarea'
import { parseMarkdown } from './lib/simple-markdown'

interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  isPinned?: boolean
  images?: string[]
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)
  const togglePreview = () => setIsPreview(!isPreview)

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
      isPinned: false,
      images: []
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ))
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates } : prev)
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const togglePin = (id: string) => {
    updateNote(id, { isPinned: !notes.find(n => n.id === id)?.isPinned })
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && selectedNote) {
        const reader = new FileReader()
        reader.onload = () => {
          const imageUrl = reader.result as string
          updateNote(selectedNote.id, {
            images: [...(selectedNote.images || []), imageUrl],
            content: selectedNote.content + `\n![${file.name}](${imageUrl})`
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.createdAt - a.createdAt
  })

  const filteredNotes = sortedNotes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] text-zinc-800 dark:text-zinc-200">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="border-r border-zinc-200 dark:border-zinc-800 h-screen flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-lg font-medium">Notes</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="p-2">
            <Button 
              onClick={createNote} 
              className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          <div className="px-2 py-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 bg-transparent border-zinc-200 dark:border-zinc-800 focus:ring-0 focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-1">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div
                    className={`group p-3 mb-1 rounded-lg cursor-pointer transition-all
                      ${selectedNote?.id === note.id 
                        ? 'bg-zinc-100 dark:bg-zinc-800' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      }
                      ${note.isPinned ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}
                    `}
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {note.isPinned && (
                            <Pin className="h-3 w-3 text-amber-500 fill-amber-500" />
                          )}
                          <h3 className="font-medium truncate text-sm">
                            {note.title || 'Untitled'}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {note.content || 'Empty note'}
                        </p>
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 ${note.isPinned ? 'text-amber-500' : 'text-zinc-400'}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePin(note.id)
                          }}
                        >
                          {note.isPinned ? 
                            <PinOff className="h-4 w-4" /> : 
                            <Pin className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="h-screen flex flex-col">
          {selectedNote ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-2">
                <Input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="text-xl bg-transparent border-0 focus:ring-0 font-medium p-0 h-auto placeholder:text-zinc-400"
                  placeholder="Untitled"
                />
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePreview}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    {isPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {isPreview ? (
                  <div 
                    className="prose prose-zinc dark:prose-invert max-w-none p-4"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedNote.content) }}
                  />
                ) : (
                  <Textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                    className="w-full h-full resize-none p-4 bg-transparent border-0 focus:ring-0 font-mono text-sm"
                    placeholder="Type '/' for commands"
                  />
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center text-zinc-400"
            >
              <p className="text-sm">Select a note or create a new one</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App