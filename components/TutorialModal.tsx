"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { X, TrendingUp, Trophy, Dumbbell, Calendar, Plus, ChevronRight, Scale, Activity } from "lucide-react"

interface TutorialSection {
  id: string
  icon: any
  title: string
  description: string
  steps: string[]
}

const tutorialSections: TutorialSection[] = [
  {
    id: "weekly-summary",
    icon: TrendingUp,
    title: "Weekly Summary",
    description: "Track your fitness progress at a glance",
    steps: [
      "View your workouts, volume, time, and weight from the last 7 days",
      "Workouts: Number of workout sessions you completed",
      "Volume: Total weight lifted (weight × reps × sets) in pounds",
      "Time: Total minutes spent exercising",
      "Weight: Your current body weight - tap to enter new measurements",
      "💡 Tip: Log your weight daily or after each workout to track your progress over time"
    ]
  },
  {
    id: "actions",
    icon: Activity,
    title: "Quick Actions",
    description: "Fast access to key features",
    steps: [
      "Log Workout: Start a new workout session - track your exercises and sets in real-time",
      "Leaderboard: See how you rank against other users based on points, workouts, or streak",
      "Compete with friends and stay motivated by climbing the ranks!",
      "💡 Tip: Complete workouts consistently to earn points and improve your ranking"
    ]
  },
  {
    id: "workout-programs",
    icon: Dumbbell,
    title: "Workout Programs",
    description: "Pre-loaded workouts like having a personal trainer",
    steps: [
      "Choose your fitness level: Beginner, Intermediate, or Advanced",
      "Each level has tailored workouts with proper form instructions",
      "Tap any workout to see the full exercise plan with sets, reps, and duration",
      "Click 'Start This Workout' to begin - all exercises are pre-loaded for you",
      "💡 Tip: Tap the info icon (ℹ️) on any exercise to see proper form cues and tips"
    ]
  },
  {
    id: "recent-activity",
    icon: Calendar,
    title: "Recent Activity",
    description: "View and manage your workout history",
    steps: [
      "See your last 5 completed workouts with date and exercise count",
      "Tap any workout card to view full details, exercises, and sets",
      "Edit workout: Change the date if you logged it late",
      "Delete workout: Remove workouts you want to delete",
      "💡 Tip: Review past workouts to track your progress and plan future sessions"
    ]
  },
  {
    id: "log-workout",
    icon: Plus,
    title: "Logging a Workout",
    description: "Track your exercises, sets, and reps",
    steps: [
      "Option 1: Start from a pre-loaded workout template (recommended for beginners)",
      "Option 2: Create your own custom workout by selecting exercises manually",
      "Add exercises: Tap '+Add Exercise' and browse by category (Push, Pull, Legs, etc.)",
      "Log sets: Enter weight, reps, or time/distance for cardio exercises",
      "View form instructions: Tap the info icon (ℹ️) to see proper form while working out",
      "Finish: Tap 'Finish' when done - your workout saves automatically to your profile",
      "💡 Tip: Use the music buttons to open Spotify or Apple Music without leaving the app"
    ]
  },
  {
    id: "weight-tracking",
    icon: Scale,
    title: "Weight Tracking",
    description: "Monitor your body weight progress",
    steps: [
      "Tap 'Weight' in your Weekly Summary to open the weight tracker",
      "Log your weight: Enter your current weight and tap 'Add Entry'",
      "Track trends: See your weight history and weekly averages",
      "Dashboard shows your latest weight and change since last measurement",
      "💡 Tip: Weigh yourself at the same time each day for consistency (morning works best)"
    ]
  },
  {
    id: "gamification",
    icon: Trophy,
    title: "Points & Streaks",
    description: "Stay motivated with achievements",
    steps: [
      "Earn 100 points for each completed workout",
      "Build your streak by working out consistently",
      "Check your stats on the Profile page: Workouts, Streak, Points",
      "Compete on the Leaderboard: Switch between Points, Workouts, and Streak tabs",
      "💡 Tip: Working out daily helps maintain your streak and climb the leaderboard!"
    ]
  }
]

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  if (!isOpen) return null

  const currentSection = tutorialSections.find(s => s.id === selectedSection)

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="sticky top-0 bg-bg-card backdrop-blur-sm p-6 border-b border-white/10 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                📚 App Tutorial
              </h2>
              <p className="text-sm text-text-muted mt-1">Learn how to use Rep It! like a pro</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-text-muted hover:text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedSection ? (
            /* Section Selection View */
            <div className="space-y-3">
              <p className="text-text-muted text-sm mb-4">Select a topic to learn more:</p>
              {tutorialSections.map((section) => {
                const Icon = section.icon
                return (
                  <Card
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className="p-4 hover:border-primary/50 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-xs text-text-muted">{section.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            /* Section Detail View */
            currentSection && (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mb-2"
                >
                  ← Back to Topics
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <currentSection.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentSection.title}</h3>
                    <p className="text-sm text-text-muted">{currentSection.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentSection.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      {step.startsWith('💡') ? (
                        <span className="text-xl flex-shrink-0">💡</span>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                      )}
                      <p className={`text-sm ${step.startsWith('💡') ? 'text-yellow-400 font-medium italic' : 'text-text-secondary'}`}>
                        {step.replace('💡 Tip: ', '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="sticky bottom-0 bg-bg-card backdrop-blur-sm p-6 border-t border-white/10">
          <Button 
            onClick={onClose}
            variant="secondary"
            className="w-full"
          >
            Got it, let's go! 💪
          </Button>
        </div>
      </Card>
    </div>
  )
}

