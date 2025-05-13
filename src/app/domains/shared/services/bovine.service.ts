import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateBovine, Bovine } from '@shared/models/bovine.model';
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
  getBovineById(id: string) {
    return this.http.get<Bovine>(`${environment.apiUrl}/bovines/${id}`);
  }
  createBovine(bovine: CreateBovine) {
    return this.http.post<Bovine>(`${environment.apiUrl}/bovines`, bovine);
  }
  updateBovine(id: string, bovine: Partial<Bovine>) {
    return this.http.put<Bovine>(`${environment.apiUrl}/bovines/${id}`, bovine);
  }
}
