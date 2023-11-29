import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private id: string | null = null;
  private nombreUsuario: string | null = null;
  private claveUsuario: string | null = null;
  private nombreCompleto: string | null = null;
  private tipoUsuario: string | null = null;

  setUsuario(id: string, nombreUsuario: string, claveUsuario: string, nombreCompleto: string, tipoUsuario: string) {
    this.id = id;
    this.nombreUsuario = nombreUsuario;
    this.claveUsuario = claveUsuario;
    this.nombreCompleto = nombreCompleto;
    this.tipoUsuario = tipoUsuario;
  }

  getUsuario() {
    return {
      id: this.id,
      nombreUsuario: this.nombreUsuario,
      claveUsuario: this.claveUsuario,
      nombreCompleto: this.nombreCompleto,
      tipoUsuario: this.tipoUsuario
    };
  }

  limpiarUsuario() {
    this.id = null;
    this.nombreUsuario = null;
    this.claveUsuario = null;
    this.nombreCompleto = null;
    this.tipoUsuario = null;
  }
}
