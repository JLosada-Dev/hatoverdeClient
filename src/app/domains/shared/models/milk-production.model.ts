export interface MilkProduction {
  productionId: number;
  bovineId: number;
  milkingTime: string; // ISO datetime
  milkYield: number;
  milkFat?: number;
  milkProtein?: number;
  createdAt?: string;
  updatedAt?: string;
}
