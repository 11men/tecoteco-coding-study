import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  size?: "sm" | "md";
}

export default function BadgeUI({ label, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        variant === "default" && "bg-zinc-800 text-zinc-400",
        variant === "success" && "bg-emerald-500/15 text-emerald-400",
        variant === "danger" && "bg-red-500/15 text-red-400",
        variant === "warning" && "bg-amber-500/15 text-amber-400",
        variant === "info" && "bg-blue-500/15 text-blue-300"
      )}
    >
      {label}
    </span>
  );
}
