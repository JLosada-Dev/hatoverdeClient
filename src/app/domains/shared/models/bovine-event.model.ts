// bovine-event.model.ts
export interface BovineEvent {
  event_id: number;
  bovine_id: number;
  event_date: string; // ISO datetime
  event_category: 'Health' | 'Reproduction';
  event_type: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  result?: 'Positive' | 'Negative' | 'Unknown';
  lactation_affected: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
