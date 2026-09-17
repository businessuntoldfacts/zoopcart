import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    
    let variantClasses = ""
    switch (variant) {
      case "primary":
        variantClasses = "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20"
        break
      case "secondary":
        variantClasses = "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm"
        break
      case "ghost":
        variantClasses = "hover:bg-slate-50 text-slate-900"
        break
      case "danger":
        variantClasses = "bg-red-50 text-red-600 hover:bg-red-100"
        break
      case "success":
        variantClasses = "bg-green-50 text-green-600 hover:bg-green-100"
        break
    }

    let sizeClasses = ""
    switch (size) {
      case "default":
        sizeClasses = "h-10 px-4 py-2"
        break
      case "sm":
        sizeClasses = "h-8 rounded-md px-3 text-xs"
        break
      case "lg":
        sizeClasses = "h-12 rounded-xl px-8 text-base"
        break
      case "icon":
        sizeClasses = "h-10 w-10"
        break
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
