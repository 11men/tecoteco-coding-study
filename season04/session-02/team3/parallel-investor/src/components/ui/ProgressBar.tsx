import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: "blue" | "emerald" | "amber" | "red";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "blue",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color === "blue" && "bg-blue-500",
            color === "emerald" && "bg-emerald-500",
            color === "amber" && "bg-amber-500",
            color === "red" && "bg-red-500"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-zinc-500">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
