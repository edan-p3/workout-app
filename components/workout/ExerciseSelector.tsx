"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/Dialog" // We'll need to create a simple Dialog/Modal or just use absolute positioning for now
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
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      <div className="p-4 border-b border-white/10 space-y-4 bg-bg-primary/95 backdrop-blur">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-white">Add Exercise</h2>
            <Button variant="ghost" onClick={onCancel} className="text-text-muted">Cancel</Button>
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
            <Card 
                key={ex.id} 
                onClick={() => onSelect(ex.name, ex.category)}
                className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer active:scale-[0.99] transition-all bg-transparent border-white/5"
            >
                <span className="font-medium text-white">{ex.name}</span>
                <Plus className="w-4 h-4 text-text-muted" />
            </Card>
        ))}

        {filteredExercises.length === 0 && search && (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">No exercises found.</p>
                <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => onSelect(search, "Other")}
                >
                    Create "{search}"
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}

