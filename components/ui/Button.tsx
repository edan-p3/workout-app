import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-gradient-to-r from-primary to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-primary/30":
              variant === "primary",
            "bg-secondary hover:bg-secondary/80 text-text-primary border border-white/10":
              variant === "secondary",
            "border border-primary text-primary hover:bg-primary/10":
              variant === "outline",
            "hover:bg-white/5 text-text-secondary hover:text-text-primary":
              variant === "ghost",
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
