"use client";

import useSWR from "swr";

interface SheetResponse {
  success: boolean;
  sheets: {
    name: string;
    rowCount: number;
    data: Record<string, unknown>[];
  }[];
  error?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSheets(refreshInterval = 10000) {
  const { data, error, isLoading, mutate } = useSWR<SheetResponse>(
    "/api/sheets",
    fetcher,
    {
      refreshInterval, // Revalida cada X ms (default 10 segundos)
      revalidateOnFocus: true, // Revalida cuando el usuario vuelve a la pestaña
      revalidateOnReconnect: true, // Revalida cuando se reconecta a internet
      keepPreviousData: true, // Mantener datos anteriores durante revalidación
    }
  );

  return {
    sheets: data?.sheets,
    isLoading, // Solo true en carga inicial, no en revalidaciones
    isError: error || (data && !data.success),
    errorMessage: data?.error || error?.message,
    refresh: mutate, // Función para forzar refresh manual
  };
}

export function useSheet(sheetName: string, refreshInterval = 10000) {
  const { sheets, isLoading, isError, errorMessage, refresh } =
    useSheets(refreshInterval);

  const sheet = sheets?.find(
    (s) => s.name.toLowerCase() === sheetName.toLowerCase()
  );

  // Solo mostrar error de hoja no encontrada si ya terminó de cargar y hay sheets pero no la específica
  const sheetNotFound = !isLoading && sheets && sheets.length > 0 && !sheet;

  return {
    data: sheet?.data,
    rowCount: sheet?.rowCount,
    isLoading,
    isError: isError || sheetNotFound,
    errorMessage: sheetNotFound ? `Hoja "${sheetName}" no encontrada` : errorMessage,
    refresh,
  };
}
