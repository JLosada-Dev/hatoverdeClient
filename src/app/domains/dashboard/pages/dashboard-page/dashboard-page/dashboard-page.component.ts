import { Component, OnInit, computed, signal } from '@angular/core';
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
    // Aquí puedes agregar más componentes (StatsCard, AlertBox, etc.)
  ],
})
export class DashboardPageComponent implements OnInit {
  // Estado reactivo
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

  // Computado para mostrar tarjetas estadísticas
  readonly stats = computed(() => {
    const g = this.genderCounts();
    const m = this.milkSummary();

    return [
      {
        label: 'Bovinos activos',
        value: g?.total ?? '--',
      },
      {
        label: 'Leche producida hoy',
        value: m?.total ? `${m.total.toFixed(1)} L` : '--',
      },
      {
        label: 'Promedio por bovino',
        value: m?.average ? `${m.average.toFixed(1)} L` : '--',
      },
      {
        label: 'Machos / Hembras',
        value: g ? `${g.males ?? 0} / ${g.females ?? 0}` : '--',
      },
    ];
  });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.loading.set(true);
    this.error.set(null);

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
        console.error('Error cargando el dashboard:', err);
      })
      .finally(() => this.loading.set(false));
  }
}
