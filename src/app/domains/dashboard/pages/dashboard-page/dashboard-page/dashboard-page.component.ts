import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '@shared/services/dashboard.service';
import {
  GenderCounts,
  MilkSummary,
  Producer,
  BovineEvent,
  MonthlyProductionPoint,
  AnnualMonthlyTotal,
} from '@shared/models/dashboard.model';
import { CommonModule } from '@angular/common';
import { MilkProductionChartComponent } from '../../../components/milk-production-chart/milk-production-chart/milk-production-chart.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MilkProductionChartComponent,
    // Aquí irán los componentes secundarios una vez creados
    // StatsCardComponent, BovineStatsComponent, etc.
  ],
})
export class DashboardPageComponent implements OnInit {
  // Signals para estado reactivo
  genderCounts = signal<GenderCounts | null>(null);
  milkSummary = signal<MilkSummary | null>(null);
  topProducer = signal<Producer | null>(null);
  lowestProducer = signal<Producer | null>(null);
  healthAlerts = signal<BovineEvent[]>([]);
  reproductiveEvents = signal<BovineEvent[]>([]);
  monthlyProduction = signal<MonthlyProductionPoint[]>([]);
  annualMonthlyTotal = signal<AnnualMonthlyTotal[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Para ejemplo: la fecha actual (puedes ajustar zona horaria según necesidad)
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.loading.set(true);
    this.error.set(null);

    // Llamadas paralelas a los endpoints necesarios usando firstValueFrom
    Promise.all([
      firstValueFrom(this.dashboardService.getGenderCounts()),
      firstValueFrom(this.dashboardService.getDailySummary(today)),
      firstValueFrom(this.dashboardService.getTopAndLowestProducer(today)),
      firstValueFrom(this.dashboardService.getHealthAlerts()),
      firstValueFrom(this.dashboardService.getReproductiveEvents()),
      firstValueFrom(this.dashboardService.getMonthlyProduction(year, month)),
      firstValueFrom(this.dashboardService.getAnnualMonthlyTotal(year)),
    ])
      .then(
        ([
          genderCounts,
          milkSummary,
          producers,
          healthAlerts,
          reproductiveEvents,
          monthlyProduction,
          annualMonthlyTotal,
        ]) => {
          this.genderCounts.set(genderCounts ?? null);
          this.milkSummary.set(milkSummary ?? null);
          this.topProducer.set(producers?.topProducer ?? null);
          this.lowestProducer.set(producers?.lowestProducer ?? null);
          this.healthAlerts.set(healthAlerts ?? []);
          this.reproductiveEvents.set(reproductiveEvents ?? []);
          this.monthlyProduction.set(monthlyProduction ?? []);
          this.annualMonthlyTotal.set(annualMonthlyTotal ?? []);
        },
      )
      .catch((err) => {
        this.error.set('Error cargando el dashboard');
        // Puedes mostrar detalles de error si lo deseas
        console.error('Error cargando el dashboard:', err);
        // Aquí podrías manejar el error de forma más específica
      })
      .finally(() => this.loading.set(false));
  }
}
