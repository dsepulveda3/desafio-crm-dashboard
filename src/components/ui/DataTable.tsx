"use client";

import { useState, useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, parseMonto, excelDateToJS, isDateInRange } from "@/lib/formatters";
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
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  // Ordenar por monto descendente
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => parseMonto(b.monto) - parseMonto(a.monto));
  }, [data]);

  // Filtrar por rango de fechas
  const filteredData = useMemo(() => {
    if (!showDateFilter || (!fechaDesde && !fechaHasta)) return sortedData;

    const fromDate = fechaDesde ? new Date(fechaDesde) : null;
    const toDate = fechaHasta ? new Date(fechaHasta) : null;

    return sortedData.filter((row) => {
      const rowDate = excelDateToJS(row.fechaCierre);
      // Si no tiene fecha, mostrar solo si no hay filtros activos
      if (!rowDate) return !fechaDesde && !fechaHasta;
      return isDateInRange(rowDate, fromDate, toDate);
    });
  }, [sortedData, fechaDesde, fechaHasta, showDateFilter]);

  // Calcular total filtrado
  const filteredTotal = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + parseMonto(row.monto), 0);
  }, [filteredData]);

  const displayData = filteredData.slice(0, displayCount);
  const hasMore = displayCount < filteredData.length;
  const hasActiveFilter = fechaDesde || fechaHasta;

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  const handleClearFilters = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {showDateFilter && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm text-slate-400">Desde:</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:border-slate-500"
            />
            <label className="text-xs sm:text-sm text-slate-400">Hasta:</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:border-slate-500"
            />
            {hasActiveFilter && (
              <button
                onClick={handleClearFilters}
                className="text-xs sm:text-sm text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
          {hasActiveFilter && !hideMonto && (
            <div className="text-xs sm:text-sm text-slate-300">
              Total filtrado:{" "}
              <span className="font-mono-numbers font-semibold text-emerald-400">
                {formatCurrency(filteredTotal)}
              </span>
              <span className="text-slate-500 ml-2">
                ({filteredData.length} registros)
              </span>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="data-table text-xs sm:text-sm min-w-full">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Empresa</th>
              <th className="whitespace-nowrap">Origen</th>
              {!compact && <th className="whitespace-nowrap hidden sm:table-cell">Responsable</th>}
              {!hideMonto && <th className="whitespace-nowrap">Monto</th>}
              {!hideEstado && <th className="whitespace-nowrap">Estado</th>}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, idx) => {
              const monto = parseMonto(row.monto);
              return (
                <tr key={`${row.empresa}-${idx}`}>
                  <td className="font-medium max-w-[120px] sm:max-w-none truncate">{row.empresa}</td>
                  <td>
                    <StatusBadge status={row.estado} />
                  </td>
                  {!compact && (
                    <td className="text-slate-400 hidden sm:table-cell">
                      {row.responsable || "Sin asignar"}
                    </td>
                  )}
                  {!hideMonto && (
                    <td className="font-mono-numbers whitespace-nowrap">
                      {monto > 0 ? formatCurrency(monto) : "-"}
                    </td>
                  )}
                  {!hideEstado && (
                    <td>
                      <StatusBadge status={row.cierreAporte} />
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
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
          >
            Mostrar más (+20)
          </button>
          <p className="text-xs text-slate-500 mt-1 sm:mt-2">
            Mostrando {displayCount} de {filteredData.length}
          </p>
        </div>
      )}
    </div>
  );
}
