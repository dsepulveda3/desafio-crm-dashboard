"use client";

import { ResponsableStats } from "@/types/crm";
import { formatCurrency } from "@/lib/formatters";

interface ResponsablesRankingProps {
  stats: ResponsableStats[];
  limit?: number;
  metric?: "totalRecaudado" | "cantidadEmpresas";
}

export function ResponsablesRanking({
  stats,
  limit = 5,
  metric = "totalRecaudado",
}: ResponsablesRankingProps) {
  const sortedStats =
    metric === "totalRecaudado"
      ? [...stats].sort((a, b) => b.totalRecaudado - a.totalRecaudado)
      : [...stats].sort((a, b) => b.cantidadEmpresas - a.cantidadEmpresas);

  const displayStats = sortedStats.slice(0, limit);
  const maxValue =
    metric === "totalRecaudado"
      ? Math.max(...displayStats.map((s) => s.totalRecaudado))
      : Math.max(...displayStats.map((s) => s.cantidadEmpresas));

  return (
    <div className="card-surface rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Ranking Responsables</h3>
      <div className="space-y-4">
        {displayStats.map((stat, idx) => {
          const value =
            metric === "totalRecaudado"
              ? stat.totalRecaudado
              : stat.cantidadEmpresas;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={stat.nombre} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-500 w-6">
                    #{idx + 1}
                  </span>
                  <span className="font-medium">{stat.nombre}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono-numbers font-semibold">
                    {metric === "totalRecaudado"
                      ? formatCurrency(stat.totalRecaudado)
                      : stat.cantidadEmpresas}
                  </span>
                  <span className="text-sm text-slate-500 ml-2">
                    {stat.cantidadEmpresas} empresas
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
