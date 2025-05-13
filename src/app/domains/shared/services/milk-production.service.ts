import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MilkProduction } from '@shared/models/milk-production.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MilkProductionService {
  private http = inject(HttpClient);
  getAllMilkProduction() {
    return this.http.get<MilkProduction[]>(
      `${environment.apiUrl}/milk-productions`,
    );
  }
}
