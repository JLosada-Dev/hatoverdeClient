// bovine-event.model.ts
export interface BovineEvent {
  eventId: number;
  bovineId: number;
  eventDate: string; // ISO datetime
  eventCategory: 'Health' | 'Reproduction';
  eventType: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  result?: 'Positive' | 'Negative' | 'Unknown';
  lactationAffected: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
