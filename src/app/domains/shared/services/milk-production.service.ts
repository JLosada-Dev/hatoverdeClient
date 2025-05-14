import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreateMilkProduction,
  MilkProduction,
} from '@shared/models/milk-production.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MilkProductionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/milk-productions`;
  getAllMilkProduction() {
    return this.http.get<MilkProduction[]>(
      `${environment.apiUrl}/milk-productions`,
    );
  }
  createMilkProduction(payload: CreateMilkProduction) {
    return this.http.post<MilkProduction>(this.base, payload);
  }

  updateMilkProduction(
    productionId: number,
    payload: Partial<CreateMilkProduction>,
  ) {
    return this.http.put<MilkProduction>(
      `${this.base}/${productionId}`,
      payload,
    );
  }
  deleteMilkProduction(productionId: number) {
    return this.http.delete<void>(`${this.base}/${productionId}`);
  }
}
