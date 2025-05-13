import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BovineComponent } from '../../components/bovine/bovine.component';
import { Bovine } from '../../../shared/models/bovine.model';
import { BovineService } from '../../../shared/services/bovine.service';
import { debounceTime } from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-list-bovine',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BovineComponent,
    RouterLinkWithHref,
  ],
  templateUrl: './list-bovine.component.html',
  styleUrls: ['./list-bovine.component.css'],
})
export default class ListBovineComponent implements OnInit {
  private bovineService = inject(BovineService);

  // Señales
  bovines = signal<Bovine[]>([]);
  searchTerm = signal<string>('');
  selectedBreed = signal<string | null>(null);
  searchControl = new FormControl('');

  // Computed: lista filtrada
  filteredBovines = computed(() => {
    let list = this.bovines();
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      list = list.filter((b) => b.ear_tag.toLowerCase().includes(term));
    }
    const breed = this.selectedBreed();
    if (breed) {
      list = list.filter((b) => b.breed === breed);
    }
    return list;
  });

  ngOnInit() {
    this.loadBovines();
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((v) => this.searchTerm.set(v ?? ''));
  }

  private loadBovines() {
    this.bovineService.getAllBovines().subscribe({
      next: (data) => this.bovines.set(data),
      error: (err) => console.error('Error loading bovines:', err),
    });
  }

  onBreedSelected(breed: string | null) {
    this.selectedBreed.set(breed);
  }
}
