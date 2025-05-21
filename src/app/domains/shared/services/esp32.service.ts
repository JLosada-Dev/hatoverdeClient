// src/app/domains/shared/services/esp32.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Esp32Error, PendingProduction } from '@shared/models/esp32.model';
import { environment } from '../../../../environments/environment.development';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Esp32Service {
  private http = inject(HttpClient);
  /** Endpoint general de errores en tu backend */
  private baseUrl = `${environment.apiUrl}/error-esp32`;
  private baseUrlMilkProd = `${environment.apiUrl}/milk-productions`;
  /** Endpoint de producción de leche en tu backend */
  /** URL base de tu ESP32 */
  private esp32Url = environment.esp32Url;

  /**
   * Envía la configuración al ESP32:
   * { bovine_id, milk_fat, milk_protein }
   */
  enviarConfigAlEsp32(data: {
    bovine_id: number;
    milk_fat: number;
    milk_protein: number;
  }): Observable<{ message: string }> {
    const url = `${this.esp32Url}/config-bovine`;
    return this.http.post<{ message: string }>(url, data).pipe(
      catchError((err) => {
        console.error('Error al enviar config al ESP32', err);
        return throwError(() => new Error('No se pudo conectar con el ESP32'));
      }),
    );
  }

  /**
   * Stream de errores vía SSE
   */
  getEsp32ErrorStream(): EventSource {
    return new EventSource(`${this.baseUrl}/stream`);
  }

  /**
   * Obtiene una producción pendiente (o null)
   */
  getPendingProduction(): Observable<PendingProduction | null> {
    const url = `${this.esp32Url}/pending-production`;
    return this.http.get<PendingProduction>(url, { observe: 'response' }).pipe(
      map((resp) => (resp.status === 204 ? null : resp.body!)),
      catchError((err) => {
        console.error('Error al consultar pending', err);
        return throwError(() => new Error('No se pudo consultar ESP32'));
      }),
    );
  }

  /**
   * Limpia la producción pendiente en el ESP32
   */
  clearPending(): Observable<void> {
    const url = `${this.esp32Url}/clear-pending`;
    return this.http.post<void>(url, {}).pipe(
      catchError((err) => {
        console.error('Error al clear-pending', err);
        return throwError(() => new Error('No se pudo limpiar pending'));
      }),
    );
  }

  /**
   * Recupera errores históricos (opcional)
   */
  getEsp32Errors(): Observable<Esp32Error[]> {
    return this.http.get<Esp32Error[]>(this.baseUrl).pipe(
      catchError((err) => {
        console.error('Error al obtener errores ESP32', err);
        return throwError(
          () => new Error('No se pudieron obtener los errores del ESP32'),
        );
      }),
    );
  }

  /**
   * Recupera errores desde una fecha (fetch puro)
   */
  getErrorsSince(since?: string) {
    const url = since
      ? `${this.baseUrl}?since=${encodeURIComponent(since)}`
      : this.baseUrl;
    return fetch(url).then((res) => res.json());
  }

  getProductionStream(): EventSource {
    return new EventSource(`${this.baseUrlMilkProd}/stream`);
  }
}
