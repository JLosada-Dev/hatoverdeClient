import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CreateMilkProduction,
  MilkProduction,
  DailySummary,
  HourlyPoint,
} from '@shared/models/milk-production.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MilkProductionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/milk-productions`;
  getAllMilkProduction() {
    return this.http.get<MilkProduction[]>(
      `${environment.apiUrl}/milk-productions`,
    );
  }
  createMilkProduction(payload: CreateMilkProduction) {
    return this.http.post<MilkProduction>(this.baseUrl, payload);
  }

  updateMilkProduction(
    productionId: number,
    payload: Partial<CreateMilkProduction>,
  ) {
    return this.http.put<MilkProduction>(
      `${this.baseUrl}/${productionId}`,
      payload,
    );
  }
  deleteMilkProduction(productionId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${productionId}`);
  }

  dailySummary(bovineId: number, date: string) {
    const url = `${this.baseUrl}/bovine/${bovineId}/daily-summary`;
    const params = new HttpParams().set('date', date);
    return this.http.get<DailySummary>(url, { params });
  }

  dailyHourly(bovineId: number, date: string) {
    const url = `${this.baseUrl}/bovine/${bovineId}/daily-hourly`;
    const params = new HttpParams().set('date', date);
    return this.http.get<HourlyPoint[]>(url, { params });
  }
}
