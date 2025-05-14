// src/app/shared/models/bovine-event.model.ts

export interface BovineEvent {
  event_id: number;
  bovine_id: number;
  event_date: string;
  event_category: 'Health' | 'Reproduction';
  event_type: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  result?: 'Positive' | 'Negative' | 'Unknown';
  lactation_affected: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Payload para crear (requiere bovine_id)
export type CreateBovineEvent = Omit<
  BovineEvent,
  'event_id' | 'created_at' | 'updated_at'
>;

// Payload para actualizar (no lleva bovine_id ni event_id)
export type UpdateBovineEvent = Partial<
  Omit<BovineEvent, 'event_id' | 'bovine_id' | 'created_at' | 'updated_at'>
>;
