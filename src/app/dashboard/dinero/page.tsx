"use client";

import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { DataTable } from "@/components/ui/DataTable";
import { useDashboardData } from "@/lib/useDashboardData";
import { formatCurrency } from "@/lib/formatters";

export default function DashboardDinero() {
  const {
    dineroRecords,
    dineroDirecto,
    dineroPendiente,
    dineroPagado,
    unoMasUnoRecords,
    calculateMetrics,
    calculateDineroTotals,
    isLoading,
    isError,
    refresh,
  } = useDashboardData();

  // Métricas
  const metricsGlobal = calculateMetrics(dineroRecords);
  const metricsDirecto = calculateMetrics(dineroDirecto);
  const metricsUnoMasUno = calculateMetrics(unoMasUnoRecords);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">Cargando datos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-400">Error cargando datos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard Dinero"
        subtitle="Donaciones dinero y programa 1+1"
        variant="emerald"
        onRefresh={refresh}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Métricas Globales */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="animate-slide-up stagger-1">
            <MetricCard
              title="Total Recaudado"
              value={formatCurrency(calculateDineroTotals.totalRecaudado)}
              subtitle="Directo + Convertido Pagado"
              variant="emerald"
              size="lg"
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <MetricCard
              title="Total Pendiente"
              value={formatCurrency(calculateDineroTotals.totalPendiente)}
              subtitle="Convertido Pendiente"
              variant="amber"
              size="lg"
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <MetricCard
              title="Empresas"
              value={metricsGlobal.cantidadDonantes}
              subtitle={`${metricsGlobal.pagados} pagados, ${metricsGlobal.pendientesPorCerrar} pendientes`}
            />
          </div>
          <div className="animate-slide-up stagger-4 flex justify-center items-center">
            <ProgressRing
              value={metricsGlobal.tasaConversion}
              color="emerald"
              label="Conversión"
              sublabel="Pagado vs Total"
              infoTooltip="Fórmula: Convertido Pagado / (Convertido Pagado + Convertido Pendiente) × 100. Solo considera prospecciones, no incluye los Directos."
            />
          </div>
        </section>

        {/* Sección Directo */}
        <section className="card-surface rounded-xl p-4 sm:p-6 animate-slide-up stagger-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Aportes Directos</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Transferencias sin prospección previa
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xl sm:text-2xl font-mono-numbers font-bold">
                {formatCurrency(metricsDirecto.totalRecaudado)}
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                {dineroDirecto.length} empresas
              </p>
            </div>
          </div>
          {dineroDirecto.length > 0 && (
            <DataTable
              data={dineroDirecto}
              initialRows={5}
              compact
              hideEstado
              showDateFilter
            />
          )}
        </section>

        {/* Sección Prospección */}
        <section className="space-y-3 sm:space-y-4 animate-slide-up stagger-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Prospección Convertida</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Empresas contactadas que confirmaron aporte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Pendientes */}
            <div className="card-glow-amber rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-amber-400 text-sm sm:text-base">
                  Pendientes de Pago
                </h3>
                <span className="text-xl sm:text-2xl font-mono-numbers font-bold">
                  {dineroPendiente.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                Pipeline:{" "}
                <span className="font-mono-numbers text-amber-400">
                  {formatCurrency(calculateMetrics(dineroPendiente).totalRecaudado)}
                </span>
              </p>
              {dineroPendiente.length > 0 && (
                <DataTable
                  data={dineroPendiente}
                  initialRows={5}
                  compact
                  hideEstado
                />
              )}
            </div>

            {/* Pagados */}
            <div className="card-glow-emerald rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-emerald-400 text-sm sm:text-base">
                  Pagos Recibidos
                </h3>
                <span className="text-xl sm:text-2xl font-mono-numbers font-bold">
                  {dineroPagado.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                Recaudado:{" "}
                <span className="font-mono-numbers text-emerald-400">
                  {formatCurrency(calculateMetrics(dineroPagado).totalRecaudado)}
                </span>
              </p>
              {dineroPagado.length > 0 && (
                <DataTable
                  data={dineroPagado}
                  initialRows={5}
                  compact
                  hideEstado
                  showDateFilter
                />
              )}
            </div>
          </div>
        </section>

        {/* Sección 1+1 */}
        <section className="card-surface rounded-xl p-4 sm:p-6 border-2 border-dashed border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🤝</span>
                Programa 1+1
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Empresas que duplican donaciones de empleados
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xl sm:text-2xl font-mono-numbers font-bold">
                {formatCurrency(metricsUnoMasUno.totalRecaudado)}
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                {unoMasUnoRecords.length} empresas
              </p>
            </div>
          </div>
          {unoMasUnoRecords.length > 0 && (
            <DataTable
              data={unoMasUnoRecords}
              initialRows={10}
              hideEstado
            />
          )}
        </section>
      </main>
    </div>
  );
}
