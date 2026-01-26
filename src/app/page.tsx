"use client";

import Link from "next/link";
import { useDashboardData } from "@/lib/useDashboardData";
import { formatCurrency } from "@/lib/formatters";

export default function Home() {
  const {
    dineroRecords,
    especieRecords,
    calculateMetrics,
    isLoading,
  } = useDashboardData();

  const dineroMetrics = calculateMetrics(dineroRecords);
  const especieMetrics = calculateMetrics(especieRecords);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-bold mb-4">CRM Emergencia 2026</h1>
        <p className="text-slate-400 text-lg">
          Centro de comando para gestión de donaciones
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl w-full">
        <Link
          href="/dashboard/dinero"
          className="card-glow-emerald p-8 rounded-2xl hover-lift animate-slide-up stagger-1 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
            $
          </div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Dinero</h2>
          <p className="text-slate-400 mb-6">Donaciones dinero y 1+1</p>

          {!isLoading && (
            <div className="pt-4 border-t border-emerald-500/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total recaudado</span>
                <span className="font-mono-numbers font-semibold text-emerald-400">
                  {formatCurrency(dineroMetrics.totalRecaudado)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Empresas</span>
                <span className="font-mono-numbers">
                  {dineroMetrics.cantidadDonantes}
                </span>
              </div>
            </div>
          )}
        </Link>

        <Link
          href="/dashboard/especies"
          className="card-glow-cyan p-8 rounded-2xl hover-lift animate-slide-up stagger-2 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
            +
          </div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Especies</h2>
          <p className="text-slate-400 mb-6">Donaciones en especies</p>

          {!isLoading && (
            <div className="pt-4 border-t border-cyan-500/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Comprometidas</span>
                <span className="font-mono-numbers font-semibold text-cyan-400">
                  {especieMetrics.cantidadDonantes} empresas
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Valor estimado</span>
                <span className="font-mono-numbers">
                  {formatCurrency(especieMetrics.totalRecaudado)}
                </span>
              </div>
            </div>
          )}
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-2 text-sm text-slate-500 animate-slide-up stagger-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Datos actualizándose cada 10 segundos
      </div>
    </div>
  );
}
