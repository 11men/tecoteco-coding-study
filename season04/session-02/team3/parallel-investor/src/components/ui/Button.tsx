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
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]",
        variant === "primary" && "bg-blue-500 text-white hover:bg-blue-600",
        variant === "secondary" && "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        variant === "ghost" && "bg-transparent text-zinc-400 hover:bg-zinc-800",
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
