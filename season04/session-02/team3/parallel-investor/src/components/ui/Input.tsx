"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          "rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-base outline-none transition-colors",
          "placeholder:text-zinc-400",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
