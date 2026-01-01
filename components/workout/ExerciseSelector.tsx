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
    <div className="fixed inset-0 z-[100] bg-bg-primary flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      <div className="p-4 border-b border-white/10 space-y-4 bg-bg-secondary/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-white">Add Exercise</h2>
            <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-primary hover:text-primary/80 -mr-2 font-semibold"
            >
                Cancel
            </Button>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <Input 
                placeholder="Search exercises..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-bg-card border-white/10"
                autoFocus
            />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <button
                onClick={() => setSelectedCategory("All")}
                className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === "All" 
                        ? "bg-primary text-white shadow-lg shadow-primary/30" 
                        : "bg-white/5 text-text-muted hover:bg-white/10"
                )}
            >
                All
            </button>
            {Object.values(EXERCISE_CATEGORIES).map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                        selectedCategory === cat
                            ? "bg-primary text-white shadow-lg shadow-primary/30" 
                            : "bg-white/5 text-text-muted hover:bg-white/10"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-8">
        {filteredExercises.map(ex => (
            <button
                key={ex.id} 
                onClick={() => onSelect(ex.name, ex.category)}
                className="w-full p-4 flex items-center justify-between bg-bg-card hover:bg-bg-card/80 border border-white/5 rounded-xl active:scale-[0.98] transition-all text-left"
            >
                <span className="font-medium text-white">{ex.name}</span>
                <Plus className="w-5 h-5 text-primary flex-shrink-0" />
            </button>
        ))}

        {filteredExercises.length === 0 && search && (
            <div className="text-center py-12 px-4">
                <p className="text-text-muted mb-4">No exercises found matching "{search}"</p>
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
            <div className="text-center py-12 text-text-muted">
                Select a category or search for an exercise
            </div>
        )}
      </div>
    </div>
  )
}

