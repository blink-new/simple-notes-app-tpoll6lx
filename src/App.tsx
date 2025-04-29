
import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Moon, Sun, Pin, PinOff, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card } from './components/ui/card'
import { ScrollArea } from './components/ui/scroll-area'
import { Textarea } from './components/ui/textarea'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components/ui/tooltip'
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
      title: 'Untitled Note',
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
    <TooltipProvider>
      <div className="min-h-screen bg-[#faf8f4] dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 p-4 md:p-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-serif">Notes</h1>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-zinc-600 dark:text-zinc-300"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDark ? 'Light mode' : 'Dark mode'}
                </TooltipContent>
              </Tooltip>
              <Button 
                onClick={createNote} 
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Note
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 bg-white/50 dark:bg-zinc-800/50 backdrop-blur"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <AnimatePresence>
                  {filteredNotes.map(note => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`p-4 mb-3 cursor-pointer transition-all hover:shadow-md
                          dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:hover:border-amber-500/50
                          ${selectedNote?.id === note.id ? 'border-amber-500 dark:border-amber-500 shadow-lg' : 'border-transparent'}
                          ${note.isPinned ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}
                        `}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {note.isPinned && (
                                <Pin className="h-3 w-3 text-amber-500 fill-amber-500" />
                              )}
                              <h3 className="font-medium truncate">{note.title}</h3>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                              {note.content || 'No content'}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`text-zinc-400 hover:text-amber-500 
                                    ${note.isPinned ? 'text-amber-500' : ''}`}
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
                              </TooltipTrigger>
                              <TooltipContent>
                                {note.isPinned ? 'Unpin note' : 'Pin note'}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNote(note.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete note</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </div>

            <div className="md:col-span-2">
              {selectedNote ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                      className="text-xl font-medium bg-white/50 dark:bg-zinc-800/50 backdrop-blur flex-1"
                      placeholder="Note title"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={addImage}
                          className="shrink-0"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add image</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={togglePreview}
                          className="shrink-0"
                        >
                          {isPreview ? 'Edit' : 'Preview'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isPreview ? 'Switch to editor' : 'Show preview'}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {isPreview ? (
                    <div 
                      className="prose prose-zinc dark:prose-invert max-w-none min-h-[calc(100vh-16rem)] bg-white/50 dark:bg-zinc-800/50 backdrop-blur p-4 rounded-md"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedNote.content) }}
                    />
                  ) : (
                    <Textarea
                      value={selectedNote.content}
                      onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                      className="min-h-[calc(100vh-16rem)] bg-white/50 dark:bg-zinc-800/50 backdrop-blur resize-none font-mono"
                      placeholder="Write your note here... (Markdown supported)"
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[calc(100vh-12rem)] flex items-center justify-center text-zinc-400 dark:text-zinc-500"
                >
                  <p className="text-lg">Select a note or create a new one</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App