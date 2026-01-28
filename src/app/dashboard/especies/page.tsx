"use client";

import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { DataTable } from "@/components/ui/DataTable";
import { useDashboardData } from "@/lib/useDashboardData";
import { formatCurrency } from "@/lib/formatters";

export default function DashboardEspecies() {
  const {
    especieRecords,
    especieEntregado,
    especiePendiente,
    calculateMetrics,
    calculateEspeciesTotals,
    isLoading,
    isError,
    refresh,
  } = useDashboardData();

  // Métricas
  const metricsGlobal = calculateMetrics(especieRecords);
  const especiesTotals = calculateEspeciesTotals;
  const progresoEntrega =
    especieRecords.length > 0
      ? (especieEntregado.length / especieRecords.length) * 100
      : 0;

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
        title="Dashboard Especies"
        subtitle="Donaciones en especies"
        variant="cyan"
        onRefresh={refresh}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Métricas Globales */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
          <div className="animate-slide-up stagger-1">
            <MetricCard
              title="Empresas Comprometidas"
              value={metricsGlobal.cantidadDonantes}
              variant="cyan"
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <MetricCard
              title="Entregas Completadas"
              value={especieEntregado.length}
              variant="emerald"
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <MetricCard
              title="Pendientes Entrega"
              value={especiePendiente.length}
              variant="amber"
            />
          </div>
          <div className="animate-slide-up stagger-4">
            <MetricCard
              title="Monto Entregado"
              value={formatCurrency(especiesTotals.totalEntregado)}
              variant="emerald"
            />
          </div>
          <div className="animate-slide-up stagger-5">
            <MetricCard
              title="Monto Pendiente"
              value={formatCurrency(especiesTotals.totalPendiente)}
              variant="amber"
            />
          </div>
        </section>

        {/* Progreso de Entregas */}
        <section className="card-surface rounded-xl p-4 sm:p-8 animate-slide-up stagger-5">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Progreso de Entregas</h3>
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
            <ProgressRing
              value={progresoEntrega}
              size={120}
              color="cyan"
              label={`${especieEntregado.length}/${especieRecords.length}`}
              sublabel="completadas"
            />

            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              {/* Barra Entregados */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-emerald-400">Entregado</span>
                  <span className="font-mono-numbers">
                    {especieEntregado.length}
                  </span>
                </div>
                <div className="h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        especieRecords.length > 0
                          ? (especieEntregado.length / especieRecords.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Barra Pendientes */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-amber-400">Pendiente</span>
                  <span className="font-mono-numbers">
                    {especiePendiente.length}
                  </span>
                </div>
                <div className="h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        especieRecords.length > 0
                          ? (especiePendiente.length / especieRecords.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tablas por Estado */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Entregas Completadas */}
          <div className="card-glow-emerald rounded-xl p-4 sm:p-6 animate-slide-up stagger-6">
            <h3 className="font-semibold text-emerald-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Entregas Completadas ({especieEntregado.length})
            </h3>
            {especieEntregado.length > 0 ? (
              <DataTable
                data={especieEntregado}
                initialRows={8}
                compact
                hideEstado
                showDateFilter
              />
            ) : (
              <p className="text-slate-500 text-center py-4 text-sm">
                No hay entregas completadas
              </p>
            )}
          </div>

          {/* Pendientes de Entrega */}
          <div className="card-glow-amber rounded-xl p-4 sm:p-6 animate-slide-up stagger-6">
            <h3 className="font-semibold text-amber-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Pendientes de Entrega ({especiePendiente.length})
            </h3>
            {especiePendiente.length > 0 ? (
              <DataTable
                data={especiePendiente}
                initialRows={8}
                compact
                hideEstado
                hideMonto
              />
            ) : (
              <p className="text-slate-500 text-center py-4 text-sm">
                No hay entregas pendientes
              </p>
            )}
          </div>
        </section>

        {/* Tabla Completa */}
        <section className="card-surface rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Todas las Especies</h3>
          <DataTable
            data={especieRecords}
            initialRows={15}
            hideEstado
          />
        </section>
      </main>
    </div>
  );
}
