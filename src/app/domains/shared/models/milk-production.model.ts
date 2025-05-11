export interface MilkProduction {
  production_id: number;
  bovine_id: number;
  milking_time: string; // ISO datetime
  milk_yield: number;
  milk_fat?: number;
  milk_protein?: number;
  created_at?: string;
  updated_at?: string;
}
