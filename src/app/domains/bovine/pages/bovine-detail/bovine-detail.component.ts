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

import { Bovine, CreateBovine } from '@shared/models/bovine.model';
import {
  MilkProduction,
  CreateMilkProduction,
  UpdateMilkProduction,
} from '@shared/models/milk-production.model';
import {
  BovineEvent,
  CreateBovineEvent,
  UpdateBovineEvent,
} from '@shared/models/bovine-event.model';

import { BovineService } from '@shared/services/bovine.service';
import { MilkProductionService } from '@shared/services/milk-production.service';
import { BovineEventService } from '@shared/services/bovine-event.service';

import { BovineEditModalComponent } from '@shared/components/bovine-edit-modal/bovine-edit-modal.component';
import { MilkProductionModalComponent } from '@shared/components/milk-production-modal/milk-production-modal.component';
import { BovineEventModalComponent } from '@shared/components/bovine-event-modal/bovine-event-modal.component';
import { MilkMonitorComponent } from '@bovine/components/milk-monitor/milk-monitor.component';

@Component({
  selector: 'app-bovine-detail',
  standalone: true,
  imports: [
    CommonModule,
    BovineEditModalComponent,
    MilkProductionModalComponent,
    BovineEventModalComponent,
    MilkMonitorComponent,
  ],
  templateUrl: './bovine-detail.component.html',
  styleUrls: ['./bovine-detail.component.css'],
})
export default class BovineDetailComponent implements OnInit {
  //───────────────────────────────────────────────────────────────────────────────
  // Input & Data Signals
  //───────────────────────────────────────────────────────────────────────────────
  @Input({ required: true }) id!: string;

  bovine = signal<Bovine | null>(null);
  productions = signal<MilkProduction[]>([]);
  eventBovine = signal<BovineEvent[]>([]);

  //───────────────────────────────────────────────────────────────────────────────
  // Pagination Signals & Computed
  //───────────────────────────────────────────────────────────────────────────────
  pageIndex = signal(0);
  pageSize = signal(8);

  paginatedProductions = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.productions().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.ceil(this.productions().length / this.pageSize()),
  );

  //───────────────────────────────────────────────────────────────────────────────
  // Modal Visibility Signals
  //───────────────────────────────────────────────────────────────────────────────
  isEditOpen = signal(false); // Edit bovine
  isAddProdOpen = signal(false); // Create production
  isEditProdOpen = signal(false); // Edit production
  selectedProd = signal<MilkProduction | null>(null);

  isAddEventOpen = signal(false); // Create event
  isEditEventOpen = signal(false); // Edit event
  selectedEvent = signal<BovineEvent | null>(null);

  //───────────────────────────────────────────────────────────────────────────────
  // Service injections
  //───────────────────────────────────────────────────────────────────────────────
  private bovineSvc = inject(BovineService);
  private productionSvc = inject(MilkProductionService);
  private eventSvc = inject(BovineEventService);

  //───────────────────────────────────────────────────────────────────────────────
  // Lifecycle
  //───────────────────────────────────────────────────────────────────────────────
  ngOnInit() {
    this.loadBovine();
  }

  //───────────────────────────────────────────────────────────────────────────────
  // Data Loading
  //───────────────────────────────────────────────────────────────────────────────
  private loadBovine() {
    this.bovineSvc.getBovineById(this.id).subscribe({
      next: (b) => {
        this.bovine.set(b);
        this.loadProductions(b.bovine_id);
        this.loadEvents(b.bovine_id);
      },
      error: (err) => console.error('Error fetching bovine:', err),
    });
  }

  private loadProductions(bovineId: number) {
    this.productionSvc.getAllMilkProduction().subscribe({
      next: (all) =>
        this.productions.set(all.filter((p) => p.bovine_id === bovineId)),
      error: (err) => console.error('Error loading productions:', err),
    });
  }

  private loadEvents(bovineId: number) {
    this.eventSvc.getAllBovineEvent().subscribe({
      next: (all) =>
        this.eventBovine.set(all.filter((e) => e.bovine_id === bovineId)),
      error: (err) => console.error('Error loading events:', err),
    });
  }

  //───────────────────────────────────────────────────────────────────────────────
  // Handlers: Edit Bovine
  //───────────────────────────────────────────────────────────────────────────────
  onEditBovine() {
    this.isEditOpen.set(true);
  }
  onSaveEdit(payload: CreateBovine) {
    if (!this.bovine()) return;
    this.bovineSvc
      .updateBovine(this.bovine()!.bovine_id, payload)
      .subscribe((updated) => {
        this.bovine.set(updated);
        this.isEditOpen.set(false);
      });
  }

  //───────────────────────────────────────────────────────────────────────────────
  // Handlers: Productions
  //───────────────────────────────────────────────────────────────────────────────
  onAddProduction() {
    this.selectedProd.set(null);
    this.isAddProdOpen.set(true);
  }

  onEditProduction(prod: MilkProduction) {
    this.selectedProd.set(prod);
    this.isEditProdOpen.set(true);
  }

  onSaveProduction(event: {
    id?: number;
    data: CreateMilkProduction | UpdateMilkProduction;
  }) {
    const { id, data } = event;
    const call$ = id
      ? this.productionSvc.updateMilkProduction(id, data)
      : this.productionSvc.createMilkProduction(data as CreateMilkProduction);

    call$.subscribe({
      next: () => {
        this.loadProductions(this.bovine()!.bovine_id);
        this.isAddProdOpen.set(false);
        this.isEditProdOpen.set(false);
      },
      error: (err) => console.error('Error saving production:', err),
    });
  }

  //───────────────────────────────────────────────────────────────────────────────
  // Handlers: Events
  //───────────────────────────────────────────────────────────────────────────────
  onAddEvent() {
    this.selectedEvent.set(null);
    this.isAddEventOpen.set(true);
  }

  onEditEvent(ev: BovineEvent) {
    this.selectedEvent.set(ev);
    this.isEditEventOpen.set(true);
  }

  onSaveEvent(payload: {
    id?: number;
    data: CreateBovineEvent | UpdateBovineEvent;
  }) {
    const { id, data } = payload;
    const call$ = id
      ? this.eventSvc.updateBovineEvent(id, data as UpdateBovineEvent)
      : this.eventSvc.createBovineEvent(data as CreateBovineEvent);

    call$.subscribe({
      next: () => {
        this.loadEvents(this.bovine()!.bovine_id);
        this.isAddEventOpen.set(false);
        this.isEditEventOpen.set(false);
      },
      error: (err) => console.error('Error guardando evento:', err),
    });
  }

  //───────────────────────────────────────────────────────────────────────────────
  // Pagination Controls
  //───────────────────────────────────────────────────────────────────────────────
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
  //───────────────────────────────────────────────────────────────────────────────
  // Activar / Desactivar bovino
  //───────────────────────────────────────────────────────────────────────────────
  toggleActive() {
    const b = this.bovine();
    if (!b) return;
    this.bovineSvc.toggleActiveBovine(b.bovine_id, !b.is_active).subscribe({
      next: ({ is_active }) =>
        this.bovine.update((c) => (c ? { ...c, is_active } : c)),
      error: (err) => console.error('Error toggling active:', err),
    });
  }
}
