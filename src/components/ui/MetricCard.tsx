"use client";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "emerald" | "amber" | "cyan" | "coral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  default: "card-surface",
  emerald: "card-glow-emerald",
  amber: "card-glow-amber",
  cyan: "card-glow-cyan",
  coral: "card-glow-coral",
};

const sizeClasses = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const valueSizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
};

export function MetricCard({
  title,
  value,
  subtitle,
  variant = "default",
  size = "md",
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${sizeClasses[size]} hover-lift ${className}`}
    >
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className={`font-mono-numbers font-bold ${valueSizeClasses[size]}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
