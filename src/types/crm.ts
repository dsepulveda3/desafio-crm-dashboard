export type TipoAporte = "Dinero" | "Especie" | "1+1" | "Difusión Masiva" | "Servicios" | "";

export type Origen = "Directo" | "Convertido Pendiente" | "Convertido Pagado" | "";

export type CierreAporte = "Listo" | "En proceso" | "No" | "Pendiente" | "No Aplica" | "Entregado" | "";

export interface DonacionRecord {
  Empresa: string;
  Origen: Origen;
  "Responsable ": string;
  Tipo: TipoAporte;
  "Cierre Aporte": CierreAporte;
  "Monto Donación": number | string | undefined;
  Comentario: string;
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
