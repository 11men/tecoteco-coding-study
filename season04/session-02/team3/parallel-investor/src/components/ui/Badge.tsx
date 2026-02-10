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
        variant === "default" && "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        variant === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
        variant === "danger" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        variant === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        variant === "info" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      )}
    >
      {label}
    </span>
  );
}
