// pages/bovine-detail/bovine-detail.component.ts
import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bovine } from '@shared/models/bovine.model';
import { MilkProduction } from '@shared/models/milk-production.model';
import { BovineEvent } from '@shared/models/bovine-event.model';

import { BovineService } from '@shared/services/bovine.service';
import { MilkProductionService } from '@shared/services/milk-production.service';
import { BovineEventService } from '@shared/services/bovine-event.service';

@Component({
  selector: 'app-bovine-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bovine-detail.component.html',
  styleUrls: ['./bovine-detail.component.css'],
})
export default class BovineDetailComponent implements OnInit {
  /** Input: bovine ID from parent */
  @Input({ required: true }) id!: string;

  /** Signals for data */
  bovine = signal<Bovine | null>(null);
  productions = signal<MilkProduction[]>([]);
  eventBovine = signal<BovineEvent[]>([]);

  /** Pagination signals */
  pageIndex = signal(0);
  pageSize = signal(5);

  /** Computed signals */
  paginatedProductions = computed<MilkProduction[]>(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.productions().slice(start, start + this.pageSize());
  });
  totalPages = computed(() =>
    Math.ceil(this.productions().length / this.pageSize()),
  );

  /** Injected services */
  private bovineSvc = inject(BovineService);
  private productionSvc = inject(MilkProductionService);
  private eventSvc = inject(BovineEventService);

  /** Lifecycle hook */
  ngOnInit() {
    this.loadBovine();
  }

  /** Load bovine details and related data */
  private loadBovine() {
    this.bovineSvc.getBovineById(this.id).subscribe({
      next: (b) => {
        this.bovine.set(b);
        this.loadProductions(b.bovine_id);
        this.loadEvents(Number(this.id));
      },
      error: (err) => console.error('Error fetching bovine details:', err),
    });
  }

  /** Load all productions and filter by bovine */
  private loadProductions(bovineId: number) {
    this.productionSvc.getAllMilkProduction().subscribe({
      next: (all) =>
        this.productions.set(all.filter((p) => p.bovine_id === bovineId)),
      error: (err) => console.error('Error loading productions:', err),
    });
  }

  /** Load all events and filter by bovine */
  private loadEvents(bovineId: number) {
    this.eventSvc.getAllBovineEvent().subscribe({
      next: (all) =>
        this.eventBovine.set(all.filter((e) => e.bovine_id === bovineId)),
      error: (err) => console.error('Error loading events:', err),
    });
  }

  /** Action handlers */
  onEditBovine() {
    console.log('Editar bovino', this.id);
  }

  onAddProduction() {
    console.log('Agregar producción para bovino', this.id);
  }

  onEditProduction(prod: MilkProduction) {
    console.log('Editar producción', prod.production_id);
  }

  onAddEvent() {
    console.log('Agregar evento para bovino', this.id);
  }

  onEditEvent(event: BovineEvent) {
    console.log('Editar evento', event.event_id);
  }

  /** Pagination controls */
  prevPage() {
    if (this.pageIndex() > 0) {
      this.pageIndex.update((i) => i - 1);
    }
  }

  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1) {
      this.pageIndex.update((i) => i + 1);
    }
  }
}
