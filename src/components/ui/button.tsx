/**
 * Button Component - Modern Design
 * 
 * A versatile button component with multiple variants and sizes.
 * Supports loading states and disabled states.
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-600 hover:shadow-glow focus:ring-primary-500 shadow-soft",
      secondary: "bg-secondary-800 text-white hover:bg-secondary-900 focus:ring-secondary-500 shadow-soft",
      outline: "border-2 border-secondary-200 text-secondary-700 hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-primary-500",
      ghost: "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 focus:ring-secondary-500",
      danger: "bg-danger text-white hover:bg-danger-dark focus:ring-danger shadow-soft",
      gradient: "bg-gradient-to-r from-primary to-primary-600 text-white hover:shadow-glow focus:ring-primary-500 shadow-soft hover:scale-[1.02]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
