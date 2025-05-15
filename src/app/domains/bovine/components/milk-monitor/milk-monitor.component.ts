import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import {
  DailySummary,
  HourlyPoint,
} from '@shared/models/milk-production.model';
import { MilkProductionService } from '@shared/services/milk-production.service';

@Component({
  selector: 'app-milk-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './milk-monitor.component.html',
  styleUrls: ['./milk-monitor.component.css'],
})
export class MilkMonitorComponent implements OnInit {
  @Input({ required: true }) bovineId!: number;

  summary = signal<DailySummary | null>(null);
  hourly = signal<HourlyPoint[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private svc: MilkProductionService) {}

  ngOnInit() {
    const today = new Date().toISOString().slice(0, 10);
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      summary: this.svc.dailySummary(this.bovineId, today),
      hourly: this.svc.dailyHourly(this.bovineId, today),
    }).subscribe({
      next: ({ summary, hourly }) => {
        this.summary.set(summary);
        this.hourly.set(hourly);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No fue posible cargar los datos.');
        this.loading.set(false);
      },
    });
  }
}
