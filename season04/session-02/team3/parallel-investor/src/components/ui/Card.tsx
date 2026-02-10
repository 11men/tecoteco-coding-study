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
        "rounded-2xl border p-4 sm:p-5 transition-shadow",
        variant === "default" && "border-zinc-800 bg-zinc-900",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/5",
        variant === "danger" && "border-red-500/20 bg-red-500/5",
        variant === "highlight" && "border-blue-500/20 bg-blue-500/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
