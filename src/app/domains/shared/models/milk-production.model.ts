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

export type CreateMilkProduction = Omit<
  MilkProduction,
  'production_id' | 'created_at' | 'updated_at'
>;

/** Lo que pide el PUT /milk-productions/:id */
export type UpdateMilkProduction = Omit<CreateMilkProduction, 'bovine_id'>;

export interface DailySummary {
  date: string;
  total: number;
  count: number;
  average: number;
  min: number;
  max: number;
}

export interface HourlyPoint {
  hour: string; // "08:00"
  totalYield: number;
}
