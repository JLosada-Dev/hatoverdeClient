import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bovine } from '../models/bovine.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BovineService {
  private http = inject(HttpClient);

  // Consultar todos los bovinos
  getAllBovines() {
    return this.http.get<Bovine[]>(`${environment.apiUrl}/bovines`);
  }
}
