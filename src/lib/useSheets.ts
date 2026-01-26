"use client";

import useSWR from "swr";
import { useEffect, useRef } from "react";

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
  const cachedSheets = useRef<SheetResponse['sheets'] | undefined>(undefined);

  const { data, error, isLoading, mutate } = useSWR<SheetResponse>(
    "/api/sheets",
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Actualizar caché en useEffect para evitar problemas de render
  useEffect(() => {
    if (data?.success && data.sheets && data.sheets.length > 0) {
      cachedSheets.current = data.sheets;
    }
  }, [data]);

  // Usar datos actuales si existen, sino usar caché
  const sheets = (data?.success && data.sheets) ? data.sheets : cachedSheets.current;

  // Solo mostrar error si no hay datos disponibles (ni actuales ni en caché)
  const hasError = (error || data?.success === false) && !sheets;

  // Solo mostrar loading en carga inicial (no hay caché)
  const showLoading = isLoading && !cachedSheets.current;

  return {
    sheets,
    isLoading: showLoading,
    isError: hasError,
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
