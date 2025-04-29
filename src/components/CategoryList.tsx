
import * as React from 'react'
import { ChevronDown, ChevronRight, FolderPlus, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Category } from '../lib/types'

interface CategoryListProps {
  categories: Category[]
  selectedCategory?: string
  onSelectCategory: (categoryId: string) => void
  onAddCategory: (category: Category) => void
}

export function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategoryListProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [isAdding, setIsAdding] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState('')

  const colors = [
    'amber',
    'rose',
    'blue',
    'green',
    'purple',
    'orange',
    'teal',
    'pink',
    'indigo',
    'cyan',
  ]

  const handleAddCategory = () => {
    if (newCategoryName) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      onAddCategory({
        id: Date.now().toString(),
        name: newCategoryName,
        color,
      })
      setNewCategoryName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Categories
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`w-full text-left px-8 py-1 text-sm rounded-md transition-colors ${
                selectedCategory === category.id
                  ? `bg-${category.color}-100 dark:bg-${category.color}-900/20 text-${category.color}-900 dark:text-${category.color}-300`
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}

          {isAdding && (
            <div className="px-8 py-1">
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="Category name..."
                className="h-7 text-sm"
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}