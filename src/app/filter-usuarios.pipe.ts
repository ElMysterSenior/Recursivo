// filter-usuarios.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsuarios'
})
export class FilterUsuariosPipe implements PipeTransform {
  transform(usuarios: any[], tipoUsuarioFilter: string, nombreUsuarioSearch: string, nombreCompletoSearch: string): any[] {
    console.log('Tipo Usuario Filter:', tipoUsuarioFilter);
    console.log('Nombre Usuario Search:', nombreUsuarioSearch);
    console.log('Nombre Completo Search:', nombreCompletoSearch);

    const filteredUsuarios = usuarios
      .filter(user => tipoUsuarioFilter ? user.TipoUsuario.toLowerCase() === tipoUsuarioFilter.toLowerCase() : true)
      .filter(user => nombreUsuarioSearch ? user.NombreUsuario.toLowerCase().includes(nombreUsuarioSearch.toLowerCase()) : true)
      .filter(user => nombreCompletoSearch ? user.NombreCompleto.toLowerCase().includes(nombreCompletoSearch.toLowerCase()) : true);
  
    console.log('Usuarios filtrados:', filteredUsuarios);
  
    return filteredUsuarios;
  }
}
