"use client";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusColors: Record<string, string> = {
  Listo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Entregado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "En proceso": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Pendiente: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  No: "bg-red-500/20 text-red-400 border-red-500/30",
  "No Aplica": "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "Convertido Pagado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Convertido Pendiente": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Directo: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const sizeClasses = {
  sm: "text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5",
  md: "text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const colorClass = statusColors[status] || statusColors["No Aplica"];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClasses[size]}`}
    >
      {status || "Sin estado"}
    </span>
  );
}
