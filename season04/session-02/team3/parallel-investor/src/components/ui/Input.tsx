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
        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          "rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-base text-zinc-100 outline-none transition-colors min-h-[44px]",
          "placeholder:text-zinc-500",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
