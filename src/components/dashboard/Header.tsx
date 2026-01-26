"use client";

import Link from "next/link";

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: "emerald" | "cyan";
  onRefresh?: () => void;
}

const variantColors = {
  emerald: "from-emerald-500/20",
  cyan: "from-cyan-500/20",
};

export function Header({
  title,
  subtitle,
  variant = "emerald",
  onRefresh,
}: HeaderProps) {
  return (
    <header
      className={`bg-gradient-to-r ${variantColors[variant]} to-transparent border-b border-slate-800`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto-refresh activo
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
