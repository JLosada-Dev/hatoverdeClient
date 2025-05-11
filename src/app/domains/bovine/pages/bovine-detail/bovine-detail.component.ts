import { Component, inject, Input, signal, OnInit } from '@angular/core';
import { Bovine } from '../../../shared/models/bovine.model';
import { BovineService } from '../../../shared/services/bovine.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bovine-detail',
  imports: [CommonModule],
  templateUrl: './bovine-detail.component.html',
  styleUrl: './bovine-detail.component.css',
})
export default class BovineDetailComponent implements OnInit {
  @Input() id?: string;

  bovine = signal<Bovine | null>(null);

  private bovineService = inject(BovineService);
  ngOnInit() {
    if (this.id) {
      this.bovineService.getBovineById(this.id).subscribe({
        next: (bovine) => {
          this.bovine.set(bovine);
        },
        error: (error) => {
          console.error('Error fetching bovine details:', error);
        },
        complete: () => {
          console.log('Bovine details fetched successfully');
        },
      });
    }
  }
}
