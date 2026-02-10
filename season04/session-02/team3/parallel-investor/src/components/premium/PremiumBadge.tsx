"use client";

import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  size?: "sm" | "md";
}

export default function PremiumBadge({ size = "sm" }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 font-medium text-blue-400",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm"
      )}
    >
      <span aria-hidden="true">&#x26A1;</span>
      SOLID
    </span>
  );
}
