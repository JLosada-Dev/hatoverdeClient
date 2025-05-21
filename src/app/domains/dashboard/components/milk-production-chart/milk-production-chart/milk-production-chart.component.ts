import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonthlyProductionPoint } from '@shared/models/dashboard.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-milk-production-chart',
  templateUrl: './milk-production-chart.component.html',
  standalone: true,
  imports: [BaseChartDirective], // <-- Agrégalo aquí
})
export class MilkProductionChartComponent implements OnChanges {
  @Input() data: MonthlyProductionPoint[] = [];

  chartLabels: string[] = [];
  chartData: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartLabels = this.data.map((d) => d.date);
      this.chartData = this.data.map((d) => d.totalYield);
    }
  }
}
