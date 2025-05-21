export interface BovineInfo {
  bovine_id: number;
  ear_tag: string;
  breed: string;
  date_of_birth: string; // ISO date string
  lactation_stage: number;
}

export interface MilkProductionWithBovine {
  production_id: number;
  milking_time: string; // ISO datetime string
  milk_yield: number;
  milk_fat?: number; // Optional: percentage of milk fat
  milk_protein?: number; // Optional: percentage of milk protein
  created_at?: string; // Optional: ISO datetime string
  updated_at?: string; // Optional: ISO datetime string
  bovine: {
    bovine_id: number;
    ear_tag: string;
    breed: string;
    date_of_birth: string; // ISO date string
    lactation_stage: number;
  };
}
