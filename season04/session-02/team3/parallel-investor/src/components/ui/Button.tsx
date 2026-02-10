"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        variant === "ghost" && "bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-base",
        size === "lg" && "px-7 py-3.5 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
