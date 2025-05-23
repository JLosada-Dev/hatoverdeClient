import { MilkProduction } from './milk-production.model';
import { BovineEvent } from './bovine-event.model';
import { MilkPrediction } from './milk-prediction.model';

export interface Bovine {
  bovine_id: number;
  ear_tag: string;
  breed: 'Holstein' | 'Ayrshire' | 'Jersey';
  date_of_birth: string; // ISO date, e.g. "2025-05-10"
  weight_kg: number;
  sex: 'Male' | 'Female';
  lactation_stage: number; // 1–5
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  productions?: MilkProduction[];
  events?: BovineEvent[];
  predictions?: MilkPrediction[];
}
export type CreateBovine = Omit<
  Bovine,
  | 'bovine_id'
  | 'created_at'
  | 'updated_at'
  | 'productions'
  | 'events'
  | 'predictions'
>;

export interface EarTag {
  bovine_id: number;
  ear_tag: string;
}
