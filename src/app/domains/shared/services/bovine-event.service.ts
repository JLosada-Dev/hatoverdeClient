// src/app/shared/services/bovine-event.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {
  BovineEvent,
  CreateBovineEvent,
  UpdateBovineEvent,
} from '@shared/models/bovine-event.model';

@Injectable({
  providedIn: 'root',
})
export class BovineEventService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/bovine-events`;

  /**
   * Recupera todos los eventos de bovinos
   */
  getAllBovineEvent() {
    return this.http.get<BovineEvent[]>(this.baseUrl);
  }

  // POST /bovine-events
  createBovineEvent(event: CreateBovineEvent) {
    return this.http.post<BovineEvent>(this.baseUrl, event);
  }

  // PUT /bovine-events/:id
  updateBovineEvent(id: number, event: UpdateBovineEvent) {
    return this.http.put<BovineEvent>(`${this.baseUrl}/${id}`, event);
  }
}
