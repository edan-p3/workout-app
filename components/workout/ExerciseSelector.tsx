"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Search, Plus } from "lucide-react"
import { EXERCISE_DATABASE, EXERCISE_CATEGORIES, type ExerciseCategory } from "@/lib/data/exercises"
import { cn } from "@/lib/utils/cn"

interface ExerciseSelectorProps {
  onSelect: (exerciseName: string, category?: string) => void
  onCancel: () => void
}

export function ExerciseSelector({ onSelect, onCancel }: ExerciseSelectorProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "All">("All")
  const [customName, setCustomName] = useState("")

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || ex.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col animate-in slide-in-from-bottom-10 duration-300 safe-area-padding">
      <div className="p-4 border-b border-white/10 space-y-4 bg-bg-primary sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-white">Add Exercise</h2>
            <Button variant="ghost" onClick={onCancel} className="text-text-muted -mr-2">Cancel</Button>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
                placeholder="Search exercises..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                autoFocus
            />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => setSelectedCategory("All")}
                className={cn(
                    "px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors",
                    selectedCategory === "All" 
                        ? "bg-primary border-primary text-white" 
                        : "border-white/10 text-text-muted hover:border-white/30"
                )}
            >
                All
            </button>
            {Object.values(EXERCISE_CATEGORIES).map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                        "px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors",
                        selectedCategory === cat
                            ? "bg-primary border-primary text-white" 
                            : "border-white/10 text-text-muted hover:border-white/30"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredExercises.map(ex => (
            <button
                key={ex.id} 
                onClick={() => onSelect(ex.name, ex.category)}
                className="w-full p-4 flex items-center justify-between bg-bg-card/50 border border-white/5 rounded-xl active:scale-[0.98] transition-transform text-left touch-manipulation"
            >
                <span className="font-medium text-white">{ex.name}</span>
                <Plus className="w-5 h-5 text-primary flex-shrink-0" />
            </button>
        ))}

        {filteredExercises.length === 0 && search && (
            <div className="text-center py-8 px-4">
                <p className="text-text-muted mb-4">No exercises found.</p>
                <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => onSelect(search, "Other")}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create "{search}"
                </Button>
            </div>
        )}
        {filteredExercises.length === 0 && !search && (
            <div className="text-center py-8 text-text-muted">
                Select a category or search for an exercise
            </div>
        )}
      </div>
    </div>
  )
}

