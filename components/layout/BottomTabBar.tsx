"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp, Plus, Calendar, User, Trophy } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export function BottomTabBar() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Stats",
      href: "/",
      icon: TrendingUp,
    },
    {
      name: "Rank",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      name: "Log",
      href: "/log",
      icon: Plus,
      isPrimary: true,
    },
    {
      name: "History",
      href: "/history",
      icon: Calendar,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  // Hide on login/signup pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          if (tab.isPrimary) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative -top-5"
              >
                <div className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-pink-600 shadow-lg shadow-primary/30 transition-transform active:scale-95",
                  isActive && "ring-2 ring-white ring-offset-2 ring-offset-bg-primary"
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 space-y-1 transition-colors",
                isActive ? "text-primary" : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "animate-pulse-subtle")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {tab.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

