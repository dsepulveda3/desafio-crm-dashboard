"use client";

import { useState, useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, parseMonto } from "@/lib/formatters";
import { DonacionRecord } from "@/types/crm";

interface DataTableProps {
  data: DonacionRecord[];
  compact?: boolean;
  initialRows?: number;
  hideEstado?: boolean;
  hideMonto?: boolean;
  showDateFilter?: boolean;
}

export function DataTable({
  data,
  compact = false,
  initialRows = 5,
  hideEstado = false,
  hideMonto = false,
  showDateFilter = false,
}: DataTableProps) {
  const [displayCount, setDisplayCount] = useState(initialRows);
  const [dateFilter, setDateFilter] = useState<string>("");

  // Filtrar por fecha si está activo
  const filteredData = useMemo(() => {
    if (!showDateFilter || !dateFilter) return data;
    // Parsear fecha del filtro
    const filterDate = new Date(dateFilter);
    return data.filter((row) => {
      // Asumiendo que puede haber un campo de fecha (por ahora no filtramos ya que no hay campo fecha en los datos)
      return true;
    });
  }, [data, dateFilter, showDateFilter]);

  const displayData = filteredData.slice(0, displayCount);
  const hasMore = displayCount < filteredData.length;

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showDateFilter && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400">Filtrar por fecha:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-slate-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-sm text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Origen</th>
              {!compact && <th>Responsable</th>}
              {!hideMonto && <th>Monto</th>}
              {!hideEstado && <th>Estado</th>}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, idx) => {
              const monto = parseMonto(row["Monto Donación"]);
              return (
                <tr key={`${row.Empresa}-${idx}`}>
                  <td className="font-medium">{row.Empresa}</td>
                  <td>
                    <StatusBadge status={row.Origen} />
                  </td>
                  {!compact && (
                    <td className="text-slate-400">
                      {row["Responsable "]?.trim() || "Sin asignar"}
                    </td>
                  )}
                  {!hideMonto && (
                    <td className="font-mono-numbers">
                      {monto > 0 ? formatCurrency(monto) : "-"}
                    </td>
                  )}
                  {!hideEstado && (
                    <td>
                      <StatusBadge status={row["Cierre Aporte"]} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            Mostrar más (+20)
          </button>
          <p className="text-xs text-slate-500 mt-2">
            Mostrando {displayCount} de {filteredData.length} registros
          </p>
        </div>
      )}
    </div>
  );
}
