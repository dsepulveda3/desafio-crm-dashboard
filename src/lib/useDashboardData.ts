"use client";

import { useSheet } from "./useSheets";
import { useMemo } from "react";
import { RawExcelRecord, DonacionRecord, DashboardMetrics, ResponsableStats } from "@/types/crm";
import { parseMonto } from "./formatters";
import { normalizeRecords } from "./normalizeData";
import { SHEET_NAME } from "./constants";

export function useDashboardData(refreshInterval = 10000) {
  const { data, isLoading, isError, errorMessage, refresh } = useSheet(
    SHEET_NAME,
    refreshInterval
  );

  // Normalizar datos crudos del Excel
  const records = useMemo(() => {
    if (!data) return [];
    const rawData = data as unknown as RawExcelRecord[];
    return normalizeRecords(rawData);
  }, [data]);

  // Filtros por tipo
  const dineroRecords = useMemo(
    () => records.filter((r) => r.tipo === "Dinero" || r.tipo === "1+1"),
    [records]
  );

  const especieRecords = useMemo(
    () => records.filter((r) => r.tipo === "Especie"),
    [records]
  );

  // Dinero: Directo vs Prospección
  const dineroDirecto = useMemo(
    () => dineroRecords.filter((r) => r.estado === "Directo"),
    [dineroRecords]
  );

  const dineroProspeccion = useMemo(
    () =>
      dineroRecords.filter(
        (r) =>
          r.estado === "Convertido Pendiente" ||
          r.estado === "Convertido Pagado"
      ),
    [dineroRecords]
  );

  const dineroPendiente = useMemo(
    () => dineroRecords.filter((r) =>
      r.estado === "Convertido Pendiente" && r.tipo !== "1+1"
    ),
    [dineroRecords]
  );

  const dineroPagado = useMemo(
    () => dineroRecords.filter((r) => r.estado === "Convertido Pagado"),
    [dineroRecords]
  );

  // 1+1 específicos
  const unoMasUnoRecords = useMemo(
    () => records.filter((r) => r.tipo === "1+1"),
    [records]
  );

  // Especies por estado (Convertido Pagado = Entregado, Convertido Pendiente = Pendiente)
  const especieEntregado = useMemo(
    () => especieRecords.filter((r) => r.estado === "Convertido Pagado"),
    [especieRecords]
  );

  const especiePendiente = useMemo(
    () => especieRecords.filter((r) => r.estado === "Convertido Pendiente"),
    [especieRecords]
  );

  // Calcular métricas
  const calculateMetrics = (data: DonacionRecord[]): DashboardMetrics => {
    const conMonto = data.filter((r) => parseMonto(r.monto) > 0);
    const totalRecaudado = conMonto.reduce(
      (sum, r) => sum + parseMonto(r.monto),
      0
    );
    const pagados = data.filter((r) => r.estado === "Convertido Pagado").length;
    const pendientes = data.filter(
      (r) => r.estado === "Convertido Pendiente"
    ).length;

    return {
      totalRecaudado,
      cantidadDonantes: data.length,
      ticketPromedio: conMonto.length > 0 ? totalRecaudado / conMonto.length : 0,
      tasaConversion:
        pagados + pendientes > 0 ? (pagados / (pagados + pendientes)) * 100 : 0,
      pendientesPorCerrar: pendientes,
      pagados,
      registrosConMonto: conMonto.length,
      registrosSinMonto: data.length - conMonto.length,
    };
  };

  // Totales específicos para Dashboard Dinero
  // Total Recaudado = Directo + Convertido Pagado
  // Total Pendiente = Convertido Pendiente
  const calculateDineroTotals = useMemo(() => {
    const directoTotal = dineroDirecto.reduce(
      (sum, r) => sum + parseMonto(r.monto),
      0
    );
    const pagadoTotal = dineroPagado.reduce(
      (sum, r) => sum + parseMonto(r.monto),
      0
    );
    const pendienteTotal = dineroPendiente.reduce(
      (sum, r) => sum + parseMonto(r.monto),
      0
    );

    return {
      totalRecaudado: directoTotal + pagadoTotal,
      totalPendiente: pendienteTotal,
      directoTotal,
      pagadoTotal,
    };
  }, [dineroDirecto, dineroPagado, dineroPendiente]);

  // Stats por responsable
  const getResponsableStats = (data: DonacionRecord[]): ResponsableStats[] => {
    const byResponsable = new Map<string, DonacionRecord[]>();

    data.forEach((r) => {
      const resp = r.responsable || "Sin asignar";
      if (!byResponsable.has(resp)) byResponsable.set(resp, []);
      byResponsable.get(resp)!.push(r);
    });

    return Array.from(byResponsable.entries())
      .map(([nombre, recs]) => ({
        nombre,
        totalRecaudado: recs.reduce(
          (sum, r) => sum + parseMonto(r.monto),
          0
        ),
        cantidadEmpresas: recs.length,
        pendientes: recs.filter((r) => r.estado === "Convertido Pendiente")
          .length,
        pagados: recs.filter((r) => r.estado === "Convertido Pagado").length,
      }))
      .sort((a, b) => b.totalRecaudado - a.totalRecaudado);
  };

  // Lista única de responsables
  const responsables = useMemo(() => {
    const unique = new Set(
      records.map((r) => r.responsable).filter(Boolean)
    );
    return Array.from(unique).sort();
  }, [records]);

  return {
    isLoading,
    isError,
    errorMessage,
    refresh,
    records,
    dineroRecords,
    especieRecords,
    dineroDirecto,
    dineroProspeccion,
    dineroPendiente,
    dineroPagado,
    unoMasUnoRecords,
    especieEntregado,
    especiePendiente,
    responsables,
    calculateMetrics,
    calculateDineroTotals,
    getResponsableStats,
  };
}
