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
        variant === "default" && "border-zinc-200 bg-white",
        variant === "success" && "border-emerald-200 bg-emerald-50",
        variant === "danger" && "border-red-200 bg-red-50",
        variant === "highlight" && "border-teal-200 bg-teal-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
