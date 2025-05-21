import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {
  GenderCounts,
  MilkSummary,
  Producer,
  BovineEvent,
  MonthlyProductionPoint,
} from '@shared/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private bovineUrl = `${environment.apiUrl}/bovines`;
  private milkUrl = `${environment.apiUrl}/milk-productions`;
  private eventUrl = `${environment.apiUrl}/bovine-events`;

  // 1. Conteo por género
  getGenderCounts() {
    return this.http.get<GenderCounts>(`${this.bovineUrl}/count-by-gender`);
  }

  // 2. Resumen diario global de producción
  getDailySummary(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<MilkSummary>(`${this.milkUrl}/daily-summary`, {
      params,
    });
  }

  // 3. Top y peor productor del día
  getTopAndLowestProducer(date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get<{ topProducer: Producer; lowestProducer: Producer }>(
      `${this.milkUrl}/top-and-lowest`,
      { params },
    );
  }

  // 4. Bovinos con alertas de salud recientes
  getHealthAlerts() {
    return this.http.get<BovineEvent[]>(`${this.eventUrl}/health`);
  }

  // 5. Bovinos con eventos reproductivos recientes
  getReproductiveEvents() {
    return this.http.get<BovineEvent[]>(`${this.eventUrl}/reproductive`);
  }

  // 6. Datos para el gráfico de producción mensual
  getMonthlyProduction(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<MonthlyProductionPoint[]>(`${this.milkUrl}/monthly`, {
      params,
    });
  }

  // 7. Producción total por mes (global, anual)
  getAnnualMonthlyTotal(year: number) {
    const params = new HttpParams().set('year', year);
    return this.http.get<{ month: string; totalYield: number }[]>(
      `${this.milkUrl}/annual/monthly-total`,
      { params },
    );
  }
}
