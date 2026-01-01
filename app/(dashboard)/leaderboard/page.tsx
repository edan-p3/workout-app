"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Trophy, Flame, TrendingUp, Medal } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils/cn"

interface LeaderboardUser {
  id: string
  user_id: string
  total_workouts: number
  current_streak: number
  total_points: number
  users?: {
    settings: any
  }
}

type LeaderboardTab = 'workouts' | 'streak' | 'points'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('points')
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [activeTab])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Determine sort column based on active tab
      const sortColumn = activeTab === 'workouts' ? 'total_workouts' 
                       : activeTab === 'streak' ? 'current_streak' 
                       : 'total_points'

      // Get top users
      const { data, error } = await supabase
        .from('gamification_data')
        .select(`
          *,
          users (
            settings
          )
        `)
        .order(sortColumn, { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading leaderboard:', error)
        return
      }

      if (data) {
        setLeaderboard(data)
        
        // Find current user's rank
        if (user) {
          const userIndex = data.findIndex(u => u.user_id === user.id)
          setCurrentUserRank(userIndex >= 0 ? userIndex + 1 : null)
        }
      }
    } catch (error) {
      console.error('Error in loadLeaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserName = (userData: LeaderboardUser) => {
    return userData.users?.settings?.full_name || 'Anonymous'
  }

  const getValue = (userData: LeaderboardUser) => {
    switch (activeTab) {
      case 'workouts':
        return userData.total_workouts
      case 'streak':
        return userData.current_streak
      case 'points':
        return formatPoints(userData.total_points)
      default:
        return 0
    }
  }

  const formatPoints = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`
    return points.toString()
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />
    return null
  }

  const tabs = [
    { id: 'points' as LeaderboardTab, label: 'Points', icon: Trophy },
    { id: 'workouts' as LeaderboardTab, label: 'Workouts', icon: TrendingUp },
    { id: 'streak' as LeaderboardTab, label: 'Streak', icon: Flame },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-muted">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold text-white">Leaderboard</h1>
        <p className="text-text-muted">See how you rank against others</p>
      </div>

      {/* Your Rank Card */}
      {currentUserRank && (
        <Card className="p-4 bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase">Your Rank</p>
              <p className="text-2xl font-mono font-bold text-white">#{currentUserRank}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted uppercase">{tabs.find(t => t.id === activeTab)?.label}</p>
              <p className="text-xl font-mono font-bold text-primary">
                {getValue(leaderboard.find(u => u.user_id === currentUser?.id) || {} as LeaderboardUser)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white/5 text-text-muted hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.map((userData, index) => {
          const rank = index + 1
          const isCurrentUser = userData.user_id === currentUser?.id
          
          return (
            <Card
              key={userData.id}
              className={cn(
                "p-4 transition-all",
                isCurrentUser && "border-primary/50 bg-primary/5",
                rank <= 3 && "border-l-4",
                rank === 1 && "border-l-yellow-400",
                rank === 2 && "border-l-gray-400",
                rank === 3 && "border-l-orange-400"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-12 text-center">
                  {getRankIcon(rank) || (
                    <span className="text-xl font-mono font-bold text-text-muted">#{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                  {getUserName(userData).substring(0, 2).toUpperCase()}
                </div>

                {/* Name & Stats */}
                <div className="flex-1">
                  <p className="font-bold text-white flex items-center gap-2">
                    {getUserName(userData)}
                    {isCurrentUser && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">You</span>
                    )}
                  </p>
                  <p className="text-sm text-text-muted">
                    {userData.total_workouts} workouts • {userData.current_streak} day streak
                  </p>
                </div>

                {/* Value */}
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-white">{getValue(userData)}</p>
                </div>
              </div>
            </Card>
          )
        })}

        {leaderboard.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No data yet. Be the first to complete a workout!</p>
          </div>
        )}
      </div>
    </div>
  )
}

