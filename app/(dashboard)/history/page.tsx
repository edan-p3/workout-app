"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { useWorkoutStore } from "@/lib/stores/workoutStore"
import Link from "next/link"

export default function HistoryPage() {
  const { history } = useWorkoutStore()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-heading font-bold text-white">History</h1>

      {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-text-muted" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">No history yet</h3>
                <p className="text-text-muted">Complete a workout to see it here.</p>
            </div>
            <Link href="/log">
                <Button variant="outline">Start Workout</Button>
            </Link>
          </div>
      ) : (
        <div className="space-y-4">
            {history.map((workout) => (
            <Card key={workout.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="space-y-1">
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">{workout.name}</h3>
                <div className="flex items-center text-xs text-text-muted gap-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(workout.endTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(workout.durationMs / 1000 / 60)}m
                    </span>
                </div>
                </div>
                
                <div className="text-right flex items-center gap-4">
                    <div>
                        <div className="text-sm font-mono font-bold text-white">{(workout.totalVolume).toLocaleString()}</div>
                        <div className="text-xs text-text-muted">{workout.exercises.length} Exercises</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Card>
            ))}
        </div>
      )}
    </div>
  )
}
