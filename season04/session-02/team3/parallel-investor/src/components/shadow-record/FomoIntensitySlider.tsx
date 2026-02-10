"use client";

import { FomoIntensity } from "@/lib/types";
import { FOMO_INTENSITY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FomoIntensitySliderProps {
  value: FomoIntensity | null;
  onChange: (v: FomoIntensity) => void;
}

const INTENSITY_EMOJIS: Record<FomoIntensity, string> = {
  1: "\u{1F60C}",
  2: "\u{1F61F}",
  3: "\u{1F630}",
  4: "\u{1F525}",
  5: "\u{1F6A8}",
};

const TRACK_COLORS: Record<FomoIntensity, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

export default function FomoIntensitySlider({
  value,
  onChange,
}: FomoIntensitySliderProps) {
  const current: FomoIntensity = value ?? 1;
  const trackColor = TRACK_COLORS[current];
  const percentage = ((current - 1) / 4) * 100;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700">FOMO 강도</label>

      <div className="flex items-center justify-between px-1 text-lg">
        {([1, 2, 3, 4, 5] as FomoIntensity[]).map((level) => (
          <span
            key={level}
            className={cn(
              "transition-all duration-200",
              current === level ? "scale-125" : "opacity-40 scale-100"
            )}
          >
            {INTENSITY_EMOJIS[level]}
          </span>
        ))}
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={current}
        onChange={(e) => onChange(Number(e.target.value) as FomoIntensity)}
        className="fomo-slider w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${trackColor} ${percentage}%, #e4e4e7 ${percentage}%)`,
        }}
      />

      <div className="flex items-center justify-between px-1">
        {([1, 2, 3, 4, 5] as FomoIntensity[]).map((level) => (
          <span
            key={level}
            className={cn(
              "text-xs",
              current === level
                ? "text-zinc-700 font-semibold"
                : "text-zinc-400"
            )}
          >
            {level}
          </span>
        ))}
      </div>

      {value && (
        <p className="text-sm font-medium" style={{ color: trackColor }}>
          {INTENSITY_EMOJIS[value]} {FOMO_INTENSITY_LABELS[value]}
        </p>
      )}

      <style jsx>{`
        .fomo-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${trackColor};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .fomo-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${trackColor};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: border-color 0.2s;
        }
      `}</style>
    </div>
  );
}
