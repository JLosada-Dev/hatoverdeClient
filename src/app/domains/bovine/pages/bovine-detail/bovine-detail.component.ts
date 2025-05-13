// pages/bovine-detail/bovine-detail.component.ts
import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bovine } from '../../../shared/models/bovine.model';
import { BovineService } from '../../../shared/services/bovine.service';
import { MilkProductionService } from '../../../shared/services/milk-production.service';
import { MilkProduction } from '@shared/models/milk-production.model';
import { BovineEvent } from '@shared/models/bovine-event.model';
import { BovineEventService } from '@shared/services/bovine-event.service';

@Component({
  selector: 'app-bovine-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bovine-detail.component.html',
  styleUrls: ['./bovine-detail.component.css'],
})
export default class BovineDetailComponent implements OnInit {
  /** Recibimos el ID desde el padre (por ejemplo [id]="paramId") */
  @Input({ required: true }) id!: string;

  /** Señal para el bovino */
  bovine = signal<Bovine | null>(null);

  /** Señal para las producciones diarias */
  productions = signal<MilkProduction[]>([]);

  eventBovine = signal<BovineEvent[]>([]);

  private bovineSvc = inject(BovineService);
  private productionSvc = inject(MilkProductionService);
  private eventSvc = inject(BovineEventService);

  ngOnInit() {
    // 1) Cargar datos del bovino
    this.bovineSvc.getBovineById(this.id).subscribe({
      next: (b) => {
        this.bovine.set(b);

        // 2) Tras recibir el bovino, cargar y filtrar producciones
        this.loadProductions(b.bovine_id);
        this.loadEvents(Number(this.id));
      },
      error: (err) => console.error('Error fetching bovine details:', err),
    });
  }

  private loadProductions(bovineId: number) {
    this.productionSvc.getAllMilkProduction().subscribe({
      next: (all) => {
        // filtramos sólo las de este bovino
        const filtered = all.filter((p) => p.bovine_id === bovineId);
        this.productions.set(filtered);
      },
      error: (err) => console.error('Error loading productions:', err),
    });
  }

  private loadEvents(bovineId: number) {
    this.eventSvc.getAllBovineEvent().subscribe({
      next: (all) => {
        const filtered = all.filter((e) => e.bovine_id === bovineId);
        this.eventBovine.set(filtered);
      },
      error: (err) => console.error('Error loading events:', err),
    });
  }

  /** Handler para “+ Agregar” */
  onAddProduction() {
    // Aquí abrirías un modal o navegarías a un formulario
    console.log('Agregar producción para bovino', this.id);
  }

  /** Handler para “Editar” en cada fila */
  onEditProduction(prod: MilkProduction) {
    // Abre modal con prod o navega
    console.log('Editar producción', prod.production_id);
  }

  onAddEvent() {
    // Aquí abrirías un modal o navegarías a un formulario
    console.log('Agregar evento para bovino', this.id);
  }
  onEditEvent(event: BovineEvent) {
    console.log('Editar evento', event.event_id);
  }

  // Señales para paginación
  pageIndex = signal(0);
  pageSize = signal(5); // 5 filas por página

  // Computed: slice sobre productions()
  paginatedProductions = computed<MilkProduction[]>(() => {
    const all = this.productions();
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  // Número total de páginas
  totalPages = computed(() =>
    Math.ceil(this.productions().length / this.pageSize()),
  );

  // Handlers
  prevPage() {
    if (this.pageIndex() > 0) this.pageIndex.update((i) => i - 1);
  }
  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1)
      this.pageIndex.update((i) => i + 1);
  }
}
