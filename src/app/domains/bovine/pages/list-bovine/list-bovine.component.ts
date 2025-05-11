import { Component, inject, signal, OnInit } from '@angular/core';
import { BovineComponent } from '../../components/bovine/bovine.component';
import { Bovine } from '../../../shared/models/bovine.model';
import { BovineService } from '../../../shared/services/bovine.service';

@Component({
  selector: 'app-list-bovine',
  imports: [BovineComponent],
  templateUrl: './list-bovine.component.html',
  styleUrl: './list-bovine.component.css',
})
export default class ListBovineComponent implements OnInit {
  bovines = signal<Bovine[]>([]);
  private bovineService = inject(BovineService);

  ngOnInit() {
    this.loadBovines();
  }

  private loadBovines() {
    this.bovineService.getAllBovines().subscribe({
      next: (bovines) => this.bovines.set(bovines),
      error: (error) => console.error('Error loading bovines:', error),
      complete: () => console.log('Bovines loaded successfully'),
    });
  }
}
