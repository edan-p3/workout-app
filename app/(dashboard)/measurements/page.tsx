"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Scale, Calendar, Trash2, X, ArrowLeft } from "lucide-react"
import { useWeightStore } from "@/lib/stores/weightStore"

export default function BodyWeightPage() {
  const router = useRouter()
  const { entries, addEntry, deleteEntry, getLatestWeight } = useWeightStore()
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const handleSave = () => {
    if (!weight) return
    addEntry(Number(weight), date)
    setWeight("")
  }

  const handleBack = () => {
    router.back()
  }

  const latestWeight = getLatestWeight()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Body Weight</h1>
        <button
          onClick={handleBack}
          className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          aria-label="Go back"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Scale className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
                <p className="text-sm text-text-muted">Current Weight</p>
                <p className="text-2xl font-mono font-bold text-white">
                    {latestWeight ? latestWeight.toFixed(1) : "--"} 
                    <span className="text-sm text-text-muted ml-1 font-sans font-normal">lbs</span>
                </p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">New Entry</label>
                <div className="flex gap-2">
                     <div className="relative flex-1">
                        <Input 
                            type="number" 
                            placeholder="0.0" 
                            className="pl-4 pr-12 text-lg font-mono text-primary" // Hot pink text
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">lbs</span>
                     </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Date</label>
                <div className="relative">
                    <Input 
                        type="date" 
                        className="pl-10 text-white" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={!weight}>Save Entry</Button>
        </div>
      </Card>
      
      {/* History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Recent History</h3>
        
        {entries.length === 0 ? (
            <p className="text-text-muted text-center py-4 text-sm">No weight entries yet.</p>
        ) : (
            <div className="space-y-2">
                {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-bg-card/30 rounded-lg border border-white/5 group">
                        <span className="text-text-muted text-sm">
                            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">{entry.weight} lbs</span>
                            <button 
                                onClick={() => deleteEntry(entry.id)}
                                className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
