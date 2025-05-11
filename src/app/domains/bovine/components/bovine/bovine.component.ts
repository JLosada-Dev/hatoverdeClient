import { Component, Input } from '@angular/core';
import { Bovine } from '../../../shared/models/bovine.model';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-bovine',
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './bovine.component.html',
  styleUrl: './bovine.component.css',
})
export class BovineComponent {
  @Input({ required: true }) bovine!: Bovine;
}
