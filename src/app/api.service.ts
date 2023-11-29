import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  verificarUsuario(nombreUsuario: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/verificar/${nombreUsuario}`;
    return this.http.get(url);
  }

  actualizarUsuario(id: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/usuarios/${id}`;
    return this.http.put(url, userData);
  }
// En tu ApiService
obtenerTodosUsuarios(): Observable<any> {
  const url = `${this.apiUrl}/api/usuarios`;
  return this.http.get(url);
}
crearNuevoUsuario(datosUsuario: any): Observable<any> {
  const url = `${this.apiUrl}/api/usuarios`; // Asegúrate de que esta ruta coincida con tu endpoint de backend
  return this.http.post(url, datosUsuario);
}
eliminarUsuarioPorNombreUsuario(nombreUsuario: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/usuarios/eliminar/${nombreUsuario}`);
}
actualizarUsuarioAdmin(id: number, userData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/usuarios-admin/${id}`, userData);
}
validarRecaptcha(token: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/validar-recaptcha`, { token });
}


}
