import { MilkProduction } from './milk-production.model';
import { BovineEvent } from './bovine-event.model';
import { MilkPrediction } from './milk-prediction.model';

export interface Bovine {
  bovineId: number;
  earTag: string;
  breed: 'Holstein' | 'Ayrshire' | 'Jersey';
  dateOfBirth: string; // ISO date, e.g. "2025-05-10"
  weightKg: number;
  sex: 'Male' | 'Female';
  lactationStage: number; // 1–5
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  productions?: MilkProduction[];
  events?: BovineEvent[];
  predictions?: MilkPrediction[];
}
