export const TIPOS_APORTE = ["Dinero", "Especie", "1+1", "Difusión Masiva", "Servicios"] as const;

export const ORIGENES = ["Directo", "Convertido Pendiente", "Convertido Pagado"] as const;

export const CIERRE_ESTADOS = ["Listo", "En proceso", "No", "Pendiente", "No Aplica", "Entregado"] as const;

export const COLORES_ESTADO: Record<string, string> = {
  Listo: "emerald",
  Entregado: "emerald",
  "En proceso": "amber",
  Pendiente: "cyan",
  No: "red",
  "No Aplica": "slate",
};

export const COLORES_ORIGEN: Record<string, string> = {
  Directo: "slate",
  "Convertido Pendiente": "amber",
  "Convertido Pagado": "emerald",
};

export const SHEET_NAME = "CRM Emergencia 2026";
