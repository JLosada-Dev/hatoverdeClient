import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateBovine, Bovine, EarTag } from '@shared/models/bovine.model';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BovineService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/bovines`;
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
  updateBovine(id: number, bovine: Partial<Bovine>) {
    return this.http.patch<Bovine>(
      `${environment.apiUrl}/bovines/${id}`,
      bovine,
    );
  }
  toggleActiveBovine(id: number, isActive: boolean) {
    return this.http.patch<{ id: number; is_active: boolean }>(
      `${this.baseUrl}/${id}/toggle-active`,
      { is_active: isActive },
    );
  }

  listActiveEarTags(): Observable<EarTag[]> {
    return this.http.get<EarTag[]>(`${this.baseUrl}/list-active-ear-tags`);
  }
}
