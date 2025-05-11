// milk-prediction.model.ts
export interface MilkPrediction {
  predictionId: number;
  bovineId: number;
  predictionDate: string; // ISO date
  predictedWeekStart: string; // ISO date
  predictedWeekEnd: string; // ISO date
  predictedMilkYield: number;
  predictionAccuracy?: number;
  createdAt?: string;
  updatedAt?: string;
}
