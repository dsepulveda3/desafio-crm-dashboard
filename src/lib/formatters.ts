export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CL").format(value);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function parseMonto(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

// Convierte fecha serial de Excel a Date de JavaScript
export function excelDateToJS(serial: number | undefined): Date | null {
  if (!serial || typeof serial !== "number") return null;
  // Excel cuenta días desde el 1 de enero de 1900
  // Ajuste por el bug del año bisiesto de Excel
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400 * 1000;
  return new Date(utcValue);
}

// Compara si una fecha está dentro de un rango
export function isDateInRange(
  date: Date | null,
  from: Date | null,
  to: Date | null
): boolean {
  if (!date) return false;
  if (from && date < from) return false;
  if (to) {
    // Ajustar "to" al final del día
    const toEnd = new Date(to);
    toEnd.setHours(23, 59, 59, 999);
    if (date > toEnd) return false;
  }
  return true;
}
