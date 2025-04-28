
import * as React from 'react'
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Pin,
  Eye,
  Table,
  CheckSquare,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCommand: (command: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

export function CommandMenu({ open, onOpenChange, onCommand, textareaRef }: CommandMenuProps) {
  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return
    
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const value = textareaRef.current.value
    
    textareaRef.current.value = value.substring(0, start) + text + value.substring(end)
    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + text.length
    textareaRef.current.focus()
  }

  const commands = [
    {
      group: "Basic Blocks",
      items: [
        {
          icon: <Heading1 className="h-4 w-4" />,
          name: "Heading 1",
          action: () => insertAtCursor("\n# "),
        },
        {
          icon: <Heading2 className="h-4 w-4" />,
          name: "Heading 2",
          action: () => insertAtCursor("\n## "),
        },
        {
          icon: <Heading3 className="h-4 w-4" />,
          name: "Heading 3",
          action: () => insertAtCursor("\n### "),
        },
        {
          icon: <List className="h-4 w-4" />,
          name: "Bullet List",
          action: () => insertAtCursor("\n- "),
        },
        {
          icon: <ListOrdered className="h-4 w-4" />,
          name: "Numbered List",
          action: () => insertAtCursor("\n1. "),
        },
        {
          icon: <Quote className="h-4 w-4" />,
          name: "Quote",
          action: () => insertAtCursor("\n> "),
        },
      ],
    },
    {
      group: "Media",
      items: [
        {
          icon: <Image className="h-4 w-4" />,
          name: "Image",
          action: () => onCommand("image"),
        },
        {
          icon: <Code className="h-4 w-4" />,
          name: "Code Block",
          action: () => insertAtCursor("\n```\n\n```"),
        },
        {
          icon: <Table className="h-4 w-4" />,
          name: "Table",
          action: () => insertAtCursor("\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |"),
        },
      ],
    },
    {
      group: "Actions",
      items: [
        {
          icon: <Pin className="h-4 w-4" />,
          name: "Toggle Pin",
          action: () => onCommand("pin"),
        },
        {
          icon: <Eye className="h-4 w-4" />,
          name: "Toggle Preview",
          action: () => onCommand("preview"),
        },
        {
          icon: <CheckSquare className="h-4 w-4" />,
          name: "Task List",
          action: () => insertAtCursor("\n- [ ] "),
        },
      ],
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <React.Fragment key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => {
                    item.action()
                    onOpenChange(false)
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  )
}