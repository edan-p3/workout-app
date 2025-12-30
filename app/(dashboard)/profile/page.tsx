"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { User, Settings, LogOut, ChevronRight, Moon } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* User Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            ED
        </div>
        <div>
            <h1 className="text-2xl font-heading font-bold text-white">Ed Andvora</h1>
            <p className="text-text-muted">Pro Member</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <Card className="p-3 bg-bg-card/50">
            <p className="text-2xl font-mono font-bold text-white">42</p>
            <p className="text-[10px] uppercase text-text-muted">Workouts</p>
        </Card>
        <Card className="p-3 bg-bg-card/50">
            <p className="text-2xl font-mono font-bold text-white">14</p>
            <p className="text-[10px] uppercase text-text-muted">Streak</p>
        </Card>
        <Card className="p-3 bg-bg-card/50">
            <p className="text-2xl font-mono font-bold text-white">1.2M</p>
            <p className="text-[10px] uppercase text-text-muted">Points</p>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <section className="space-y-3">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Preferences</h3>
            <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-white/5">
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-white">Units</span>
                        <span className="text-text-muted text-sm flex items-center gap-2">
                            lbs / mi <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-white">Rest Timer</span>
                        <span className="text-text-muted text-sm flex items-center gap-2">
                            90s <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                     <div className="p-4 flex items-center justify-between">
                        <span className="text-white">Theme</span>
                        <span className="text-text-muted text-sm flex items-center gap-2">
                            <Moon className="w-4 h-4 mr-1" /> Dark Mode
                        </span>
                    </div>
                </div>
            </Card>
        </section>

        <section className="space-y-3">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Account</h3>
            <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-white/5">
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-white">Edit Profile</span>
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-white">Subscription</span>
                         <span className="text-primary text-sm font-bold">PRO</span>
                    </div>
                </div>
            </Card>
        </section>

         <Button variant="secondary" className="w-full text-error hover:text-error hover:bg-error/10 border-error/20">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
         </Button>

         <p className="text-center text-xs text-text-muted">Version 1.0.0 (MVP)</p>
      </div>
    </div>
  )
}

