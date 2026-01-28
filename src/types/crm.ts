export type TipoAporte = "Dinero" | "Especie" | "1+1" | "Difusión Masiva" | "Servicios" | "";

export type OrigenStatus = "Directo" | "Convertido Pendiente" | "Convertido Pagado" | "";

export type CierreAporte = "Listo" | "En proceso" | "No" | "Pendiente" | "No Aplica" | "Entregado" | "";

// Datos crudos del Excel (pueden variar las columnas)
export interface RawExcelRecord {
  // Posibles nombres para empresa
  Empresa?: string;
  Origen?: string;
  // Posibles nombres para estado
  Origen_1?: string;
  // Otros campos
  "Responsable "?: string;
  Tipo?: TipoAporte;
  "Cierre Aporte"?: CierreAporte;
  "Monto Donación"?: number | string;
  "Fecha de cierre"?: number;
  Comentario?: string;
  [key: string]: unknown; // Para otros campos desconocidos
}

// Datos normalizados (siempre consistentes)
export interface DonacionRecord {
  empresa: string;
  estado: OrigenStatus;
  responsable: string;
  tipo: TipoAporte;
  cierreAporte: CierreAporte;
  monto: number | string | undefined;
  fechaCierre?: number;
  comentario?: string;
  _raw: RawExcelRecord; // Guardar datos originales por si acaso
}

export interface DashboardMetrics {
  totalRecaudado: number;
  cantidadDonantes: number;
  ticketPromedio: number;
  tasaConversion: number;
  pendientesPorCerrar: number;
  pagados: number;
  registrosConMonto: number;
  registrosSinMonto: number;
}

export interface ResponsableStats {
  nombre: string;
  totalRecaudado: number;
  cantidadEmpresas: number;
  pendientes: number;
  pagados: number;
}
