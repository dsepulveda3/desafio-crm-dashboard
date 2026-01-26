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
    isLoading,
    isError,
    refresh,
  } = useDashboardData();

  // Métricas
  const metricsGlobal = calculateMetrics(especieRecords);
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

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Métricas Globales */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="animate-slide-up stagger-1">
            <MetricCard
              title="Empresas Comprometidas"
              value={metricsGlobal.cantidadDonantes}
              variant="cyan"
              size="lg"
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
              title="Valor Estimado"
              value={formatCurrency(metricsGlobal.totalRecaudado)}
              subtitle="Solo registros con monto"
            />
          </div>
        </section>

        {/* Progreso de Entregas */}
        <section className="card-surface rounded-xl p-8 animate-slide-up stagger-5">
          <h3 className="text-xl font-semibold mb-6">Progreso de Entregas</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ProgressRing
              value={progresoEntrega}
              size={140}
              color="cyan"
              label={`${especieEntregado.length}/${especieRecords.length}`}
              sublabel="completadas"
            />

            <div className="flex-1 space-y-4 w-full">
              {/* Barra Entregados */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Entregado (Convertido Pagado)</span>
                  <span className="font-mono-numbers">
                    {especieEntregado.length}
                  </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
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
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-400">Pendiente (Convertido Pendiente)</span>
                  <span className="font-mono-numbers">
                    {especiePendiente.length}
                  </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
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
        <section className="grid md:grid-cols-2 gap-6">
          {/* Entregas Completadas */}
          <div className="card-glow-emerald rounded-xl p-6 animate-slide-up stagger-6">
            <h3 className="font-semibold text-emerald-400 mb-4">
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
              <p className="text-slate-500 text-center py-4">
                No hay entregas completadas
              </p>
            )}
          </div>

          {/* Pendientes de Entrega */}
          <div className="card-glow-amber rounded-xl p-6 animate-slide-up stagger-6">
            <h3 className="font-semibold text-amber-400 mb-4">
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
              <p className="text-slate-500 text-center py-4">
                No hay entregas pendientes
              </p>
            )}
          </div>
        </section>

        {/* Tabla Completa */}
        <section className="card-surface rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Todas las Especies</h3>
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
