
import * as React from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image as ImageIcon,
  Table,
  Hash,
  Save,
  Check,
} from 'lucide-react'
import { Toggle } from './ui/toggle'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { Badge } from './ui/badge'

interface NoteToolbarProps {
  onFormat: (format: string) => void
  onAddImage: () => void
  isSaving?: boolean
  tags?: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function NoteToolbar({
  onFormat,
  onAddImage,
  isSaving,
  tags = [],
  onAddTag,
  onRemoveTag,
}: NoteToolbarProps) {
  const [newTag, setNewTag] = React.useState('')

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      onAddTag(newTag)
      setNewTag('')
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-zinc-800/50 backdrop-blur rounded-md border mb-2">
      <div className="flex items-center gap-1 border-r pr-2">
        <Tooltip content="Bold (⌘+B)">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('**')}>
            <Bold className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Italic (⌘+I)">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('*')}>
            <Italic className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Bullet List">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('- ')}>
            <List className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Numbered List">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('1. ')}>
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Quote">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('> ')}>
            <Quote className="h-4 w-4" />
          </Toggle>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1 border-r pr-2">
        <Tooltip content="Code Block">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('```\n')}>
            <Code className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Link">
          <Toggle size="sm" pressed={false} onPressedChange={() => onFormat('[]()')}>
            <Link className="h-4 w-4" />
          </Toggle>
        </Tooltip>
        <Tooltip content="Image">
          <Button variant="ghost" size="sm" onClick={onAddImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Table">
          <Toggle
            size="sm"
            pressed={false}
            onPressedChange={() =>
              onFormat('\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |')
            }
          >
            <Table className="h-4 w-4" />
          </Toggle>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <Hash className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tag..."
          className="bg-transparent border-none outline-none text-sm flex-1"
        />
        <div className="flex gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
              onClick={() => onRemoveTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center text-xs text-zinc-400">
        {isSaving ? (
          <span className="flex items-center gap-1">
            <Save className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Saved
          </span>
        )}
      </div>
    </div>
  )
}