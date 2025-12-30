import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-card border border-accent-blue/30 rounded-2xl p-6 shadow-xl",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }

