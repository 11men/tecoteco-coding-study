import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "danger" | "highlight";
}

export default function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-shadow",
        variant === "default" && "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        variant === "success" && "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950",
        variant === "danger" && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        variant === "highlight" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
