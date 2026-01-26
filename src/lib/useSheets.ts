"use client";

import useSWR from "swr";
import { useRef } from "react";

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
  // Caché manual para preservar datos durante refresh
  const cachedSheets = useRef<SheetResponse['sheets'] | undefined>(undefined);

  const { data, error, isLoading, isValidating, mutate } = useSWR<SheetResponse>(
    "/api/sheets",
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
    }
  );

  // Actualizar caché cuando tenemos datos válidos
  if (data?.success && data.sheets) {
    cachedSheets.current = data.sheets;
  }

  // Usar datos del caché si están disponibles, sino usar data directamente
  const sheets = cachedSheets.current ?? data?.sheets;

  // Solo mostrar error si hay un error real Y no tenemos datos en caché
  const hasRealError = (error || data?.success === false) && !cachedSheets.current;

  return {
    sheets,
    isLoading: isLoading && !cachedSheets.current,
    isError: hasRealError,
    errorMessage: data?.error || error?.message,
    refresh: mutate,
  };
}

export function useSheet(sheetName: string, refreshInterval = 10000) {
  const { sheets, isLoading, isError, errorMessage, refresh } =
    useSheets(refreshInterval);

  const sheet = sheets?.find(
    (s) => s.name.toLowerCase() === sheetName.toLowerCase()
  );

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
