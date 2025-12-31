"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { LogOut, ChevronRight, Moon, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface UserSettings {
  units: string
  restTimer: number
  theme: string
  full_name?: string
}

interface GamificationData {
  total_workouts: number
  current_streak: number
  total_points: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<UserSettings>({ units: 'lbs', restTimer: 90, theme: 'dark' })
  const [gamification, setGamification] = useState<GamificationData>({ total_workouts: 0, current_streak: 0, total_points: 0 })
  const [loading, setLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showUnitsModal, setShowUnitsModal] = useState(false)
  const [showRestTimerModal, setShowRestTimerModal] = useState(false)
  const [fullName, setFullName] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Load user settings
      const { data: userSettings } = await supabase
        .from('users')
        .select('settings')
        .eq('id', currentUser.id)
        .single()

      if (userSettings?.settings) {
        setSettings(userSettings.settings as UserSettings)
        setFullName(userSettings.settings.full_name || currentUser.user_metadata?.full_name || '')
      }

      // Load gamification data
      const { data: gamData } = await supabase
        .from('gamification_data')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (gamData) {
        setGamification({
          total_workouts: gamData.total_workouts,
          current_streak: gamData.current_streak,
          total_points: gamData.total_points,
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return

    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    await supabase
      .from('users')
      .update({ settings: updatedSettings })
      .eq('id', user.id)
  }

  const updateProfile = async () => {
    if (!user) return

    const updatedSettings = { ...settings, full_name: fullName }
    setSettings(updatedSettings)

    await supabase
      .from('users')
      .update({ settings: updatedSettings })
      .eq('id', user.id)

    setShowEditProfile(false)
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const formatPoints = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`
    return points.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  const displayName = settings.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* User Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {getInitials(displayName)}
          </div>
          <div>
              <h1 className="text-2xl font-heading font-bold text-white">{displayName}</h1>
              <p className="text-text-muted">Pro Member</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <Card className="p-3 bg-bg-card/50">
              <p className="text-2xl font-mono font-bold text-white">{gamification.total_workouts}</p>
              <p className="text-[10px] uppercase text-text-muted">Workouts</p>
          </Card>
          <Card className="p-3 bg-bg-card/50">
              <p className="text-2xl font-mono font-bold text-white">{gamification.current_streak}</p>
              <p className="text-[10px] uppercase text-text-muted">Streak</p>
          </Card>
          <Card className="p-3 bg-bg-card/50">
              <p className="text-2xl font-mono font-bold text-white">{formatPoints(gamification.total_points)}</p>
              <p className="text-[10px] uppercase text-text-muted">Points</p>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <section className="space-y-3">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Preferences</h3>
              <Card className="p-0 overflow-hidden">
                  <div className="divide-y divide-white/5">
                      <button
                        onClick={() => setShowUnitsModal(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                          <span className="text-white">Units</span>
                          <span className="text-text-muted text-sm flex items-center gap-2">
                              {settings.units} <ChevronRight className="w-4 h-4" />
                          </span>
                      </button>
                      <button
                        onClick={() => setShowRestTimerModal(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                          <span className="text-white">Rest Timer</span>
                          <span className="text-text-muted text-sm flex items-center gap-2">
                              {settings.restTimer}s <ChevronRight className="w-4 h-4" />
                          </span>
                      </button>
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
                      <button
                        onClick={() => setShowEditProfile(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                          <span className="text-white">Edit Profile</span>
                          <ChevronRight className="w-4 h-4 text-text-muted" />
                      </button>
                      <button
                        onClick={() => setShowSubscription(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                          <span className="text-white">Subscription</span>
                          <span className="text-primary text-sm font-bold">PRO</span>
                      </button>
                  </div>
              </Card>
          </section>

          <Button 
            variant="secondary" 
            className="w-full text-error hover:text-error hover:bg-error/10 border-error/20"
            onClick={handleSignOut}
          >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>

          <p className="text-center text-xs text-text-muted">Version 1.0.0 (MVP)</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Email</label>
              <Input value={user?.email || ''} disabled className="opacity-50" />
              <p className="text-xs text-text-muted ml-1">Email cannot be changed</p>
            </div>
            <Button onClick={updateProfile} className="w-full">
              Save Changes
            </Button>
          </Card>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Subscription</h2>
              <button onClick={() => setShowSubscription(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-lg font-bold text-white">Pro Member</h3>
              <p className="text-text-muted">You have full access to all features</p>
              <div className="pt-4 text-sm text-text-muted">
                <p>• Unlimited workouts</p>
                <p>• Advanced analytics</p>
                <p>• Custom programs</p>
                <p>• Priority support</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setShowSubscription(false)} className="w-full">
              Close
            </Button>
          </Card>
        </div>
      )}

      {/* Units Modal */}
      {showUnitsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Units</h2>
              <button onClick={() => setShowUnitsModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  updateSettings({ units: 'lbs' })
                  setShowUnitsModal(false)
                }}
                className={`w-full p-4 rounded-lg border ${
                  settings.units === 'lbs' 
                    ? 'border-primary bg-primary/10 text-white' 
                    : 'border-white/10 text-text-muted hover:bg-white/5'
                }`}
              >
                Pounds (lbs) / Miles (mi)
              </button>
              <button
                onClick={() => {
                  updateSettings({ units: 'kg' })
                  setShowUnitsModal(false)
                }}
                className={`w-full p-4 rounded-lg border ${
                  settings.units === 'kg' 
                    ? 'border-primary bg-primary/10 text-white' 
                    : 'border-white/10 text-text-muted hover:bg-white/5'
                }`}
              >
                Kilograms (kg) / Kilometers (km)
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Rest Timer Modal */}
      {showRestTimerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Rest Timer</h2>
              <button onClick={() => setShowRestTimerModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-2">
              {[30, 60, 90, 120, 180].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => {
                    updateSettings({ restTimer: seconds })
                    setShowRestTimerModal(false)
                  }}
                  className={`w-full p-4 rounded-lg border ${
                    settings.restTimer === seconds 
                      ? 'border-primary bg-primary/10 text-white' 
                      : 'border-white/10 text-text-muted hover:bg-white/5'
                  }`}
                >
                  {seconds} seconds
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

