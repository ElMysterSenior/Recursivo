import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DatosService } from './datos.service';
import {  Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private isAuthenticated = false;
  constructor(
    private apiService: ApiService, 
    private datosService: DatosService,
    private router: Router
  ) {}

  login(nombreUsuario: string, clave: string) {
    this.apiService.verificarUsuario(nombreUsuario).subscribe(
      usuario => {
        this.isAuthenticated = true;
        this.datosService.setUsuario(
          usuario.ID,
          usuario.NombreUsuario,
          usuario.ClaveUsuario,
          usuario.NombreCompleto,
          usuario.TipoUsuario
        );
        // Redirección según el tipo de usuario
        const tipoUsuario = usuario?.TipoUsuario;
        if (tipoUsuario === 'Administrador') {
          this.router.navigate(['/admin']);
        } else if (tipoUsuario === 'Basico') {
          this.router.navigate(['/basico']);
        } else if (tipoUsuario === 'Consulta') {
          this.router.navigate(['/consulta']);
        } else {
          console.error('Usuario sin rol');
        }
      },
      error => {
        alert("Usuario no encontrado")
        console.error('Error al verificar usuario:', error);
        this.isAuthenticated = false;
      }
    );
  }

  logout() {
    // Lógica para cerrar sesión
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
