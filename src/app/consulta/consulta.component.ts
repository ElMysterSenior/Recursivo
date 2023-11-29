// consulta.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit,OnDestroy {
  usuariosConsulta: any[] = [];
  tipoUsuarioFilter: string = '';
  nombreUsuarioSearch: string = '';
  nombreCompletoSearch: string = '';

  constructor(private router:Router, private authService: AuthService,private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.obtenerTodosUsuarios().subscribe(
      (usuarios) => {
        this.usuariosConsulta = usuarios;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
    window.onpopstate = () => {
      this.logout();
    };
  }
  ngOnDestroy() {
    window.onpopstate = null; // Elimina el manejador del evento al destruir el componente
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al usuario al login
  }
}
