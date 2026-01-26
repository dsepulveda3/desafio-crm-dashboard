"use client";

import { InfoTooltip } from "./InfoTooltip";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: "emerald" | "amber" | "cyan";
  label?: string;
  sublabel?: string;
  infoTooltip?: string;
}

const colorClasses = {
  emerald: "stroke-emerald-500",
  amber: "stroke-amber-500",
  cyan: "stroke-cyan-500",
};

export function ProgressRing({
  value,
  size = 100,
  strokeWidth = 8,
  color = "emerald",
  label,
  sublabel,
  infoTooltip,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            className="stroke-slate-700"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`${colorClasses[color]} progress-ring-circle`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-numbers text-2xl font-bold">
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {label && <p className="text-sm text-slate-300">{label}</p>}
        {infoTooltip && <InfoTooltip text={infoTooltip} />}
      </div>
      {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}
