"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Plus, Dumbbell, Play } from "lucide-react"

interface WorkoutStarterProps {
  onStart: (type: string) => void
}

export function WorkoutStarter({ onStart }: WorkoutStarterProps) {
  const templates = [
    { name: "Push Day", desc: "Chest, Shoulders, Triceps", type: "Push" },
    { name: "Pull Day", desc: "Back, Biceps, Rear Delts", type: "Pull" },
    { name: "Leg Day", desc: "Quads, Hamstrings, Calves", type: "Legs" },
  ]

  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center p-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-primary/20 mb-6">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Start Workout</h1>
            <p className="text-text-muted">Choose a template or start from scratch</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
            {templates.map((t) => (
                <Button 
                    key={t.name}
                    variant="secondary"
                    className="w-full h-auto py-4 flex flex-col items-start gap-1 relative overflow-hidden group border-white/5 hover:border-primary/50"
                    onClick={() => onStart(t.name)}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-bold text-lg relative z-10">{t.name}</span>
                    <span className="text-xs text-text-muted relative z-10">{t.desc}</span>
                </Button>
            ))}

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-bg-primary px-2 text-text-muted">Or</span>
                </div>
            </div>

            <Button 
                variant="outline" 
                className="w-full py-6 border-dashed"
                onClick={() => onStart("Custom Workout")}
            >
                <Plus className="w-5 h-5 mr-2" />
                Empty Workout
            </Button>
        </div>
    </div>
  )
}

