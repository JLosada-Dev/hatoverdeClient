// Para conteo por género
export interface GenderCounts {
  total: number;
  males: number;
  females: number;
}

// Para resumen global diario de producción
export interface MilkSummary {
  date: string; // '2024-05-21'
  total: number; // litros totales del día
  count: number; // número de ordeños
  average: number; // promedio por ordeño
  min: number;
  max: number;
}

// Para top y peor productor del día
export interface Producer {
  bovine_id: number;
  ear_tag: string;
  breed: string;
  date_of_birth: string;
  lactation_stage: number;
  totalYield: number; // producción total del día
}

// Para el gráfico de producción mensual
export interface MonthlyProductionPoint {
  date: string; // '2024-05-01'
  totalYield: number; // litros ese día
}

// Para el gráfico anual
export interface AnnualMonthlyTotal {
  month: string; // '2024-01-01T00:00:00.000Z'
  totalYield: number;
}

// Para eventos recientes de salud o reproducción
export interface BovineEvent {
  bovine_id: number;
  ear_tag: string;
  breed: string;
  date_of_birth: string;
  lactation_stage: number;
  last_event: {
    type: string; // Tipo de evento
    date: string; // Fecha ISO
    severity?: string; // solo si aplica
  };
}
