import { Component, inject } from '@angular/core';
import { MilkProductionService } from '@shared/services/milk-production.service';

@Component({
  selector: 'app-production-esp32',
  templateUrl: './production-esp32.component.html',
  standalone: true,
  providers: [],
  imports: [],
})
export default class ProductionEsp32Component {
  private milkService = inject(MilkProductionService);

  enviarConfiguracion() {
    this.milkService
      .enviarConfigAlEsp32({
        bovine_id: 12, // ← aquí puedes conectar con un formulario si deseas
        grasa: 3.6,
        proteina: 3.2,
      })
      .subscribe({
        next: () => console.log('Configuración enviada al ESP32'),
        error: (err) => console.error('Error al conectar con ESP32', err),
      });
  }
}
