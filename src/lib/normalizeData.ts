import { RawExcelRecord, DonacionRecord, OrigenStatus, TipoAporte, CierreAporte } from "@/types/crm";

const VALID_ESTADOS: OrigenStatus[] = ["Directo", "Convertido Pendiente", "Convertido Pagado"];

function isValidEstado(value: unknown): value is OrigenStatus {
  return typeof value === "string" && VALID_ESTADOS.includes(value as OrigenStatus);
}

/**
 * Normaliza un registro crudo del Excel a un formato consistente.
 * Detecta automáticamente qué columnas contienen qué datos.
 */
export function normalizeRecord(raw: RawExcelRecord): DonacionRecord {
  // Detectar dónde está el estado (puede ser en Origen o Origen_1)
  let estado: OrigenStatus = "";
  let empresa: string = "";

  if (isValidEstado(raw.Origen_1)) {
    // Caso: Origen = empresa, Origen_1 = estado
    estado = raw.Origen_1;
    empresa = (raw.Origen as string) || "";
  } else if (isValidEstado(raw.Origen)) {
    // Caso: Empresa = empresa, Origen = estado
    estado = raw.Origen as OrigenStatus;
    empresa = raw.Empresa || "";
  } else {
    // Fallback: usar lo que haya
    empresa = raw.Empresa || (raw.Origen as string) || "";
    estado = "";
  }

  return {
    empresa,
    estado,
    responsable: raw["Responsable "]?.trim() || "",
    tipo: (raw.Tipo as TipoAporte) || "",
    cierreAporte: (raw["Cierre Aporte"] as CierreAporte) || "",
    monto: raw["Monto Donación"],
    fechaCierre: raw["Fecha de cierre"],
    comentario: raw.Comentario,
    _raw: raw,
  };
}

/**
 * Normaliza un array de registros crudos del Excel.
 */
export function normalizeRecords(rawData: RawExcelRecord[]): DonacionRecord[] {
  return rawData.map(normalizeRecord);
}
