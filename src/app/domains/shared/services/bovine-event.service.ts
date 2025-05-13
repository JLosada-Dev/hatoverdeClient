import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BovineEvent } from '@shared/models/bovine-event.model';

@Injectable({
  providedIn: 'root',
})
export class BovineEventService {
  private http = inject(HttpClient);
  getAllBovineEvent() {
    return this.http.get<BovineEvent[]>(`${environment.apiUrl}/bovine-events`);
  }
}
