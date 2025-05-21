export interface Esp32Config {
  bovine_id: number;
  milk_fat: number;
  milk_protein: number;
}

export interface PendingProduction {
  bovine_id: number;
  milk_fat: number;
  milk_protein: number;
  milk_yield: number;
  timestamp: number;
}

export interface Esp32Error {
  error_id: number;
  production_id?: number;
  error_code: number;
  mensaje: string;
  timestamp: string;
}
