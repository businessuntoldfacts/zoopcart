import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[16px] font-medium transition-transform active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-br from-zyp-accent to-zyp-accentSecondary text-white shadow-sm shadow-zyp-accent/20 hover:-translate-y-0.5": variant === "primary",
            "bg-transparent border border-zyp-textMuted/30 text-zyp-textPrimary hover:bg-zyp-surface hover:-translate-y-0.5": variant === "secondary",
            "bg-zyp-danger text-white hover:opacity-90": variant === "danger",
            "hover:bg-zyp-surface text-zyp-textPrimary": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-sm rounded-[12px]": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
