import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../authservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit,OnDestroy  {
  usuariosForm: FormGroup;
  usuarios: any[] = [];
  nombreUsuarioSearch: string = '';
  filtroNombreUsuario: string = '';
  filtroNombreCompleto: string = '';
  filtroTipoUsuario: string = '';
  usuarioEditandoId: number | null = null;

  constructor(private router: Router,private authService: AuthService,private apiService: ApiService, private fb: FormBuilder) {
    // Inicializa el formulario aquí para asegurarte de que siempre tenga un valor antes de ser usado.
    this.usuariosForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      nombreCompleto: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      claveUsuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[/\\*#$%_]).+$')]],
      tipoUsuario: ['', [Validators.required]] // Asegúrate de que este campo también esté validado.
    });
  }

  ngOnInit() {
    this.cargarUsuarios();

    window.onpopstate = () => {
      this.logout();
    };
  }
  ngOnDestroy() {
    window.onpopstate = null; // Elimina el manejador del evento al destruir el componente
  }
  cargarUsuarios(): void {
    this.apiService.obtenerTodosUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener datos: ', error);
      }
    );
  }
  
 modificarUsuario(usuario: any) {
  this.usuarioEditandoId = usuario.ID; // Asumiendo que cada usuario tiene una propiedad ID
  // Rellenar el formulario con los datos del usuario para editarlos
  this.usuariosForm.setValue({
    nombreUsuario: [usuario.NombreUsuario, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
    nombreCompleto: [usuario.NombreCompleto, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    claveUsuario: [usuario.ClaveUsuario, [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[/\\*#$%_]).+$')]],
    tipoUsuario: [usuario.TipoUsuario, [Validators.required]]
  });
}

  
  eliminarUsuario(nombreUsuario: string) {
    console.log("Nombre de usuario a eliminar:", nombreUsuario); // Añade esto para depurar
    if(confirm("¿Estás seguro de que deseas eliminar a este usuario?")) {
      this.apiService.eliminarUsuarioPorNombreUsuario(nombreUsuario).subscribe(
        response => {
          console.log("Usuario eliminado", response);
          this.cargarUsuarios(); // Recargar la lista de usuarios
        },
        error => {
          console.error("Error al eliminar usuario", error);
        }
      );
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al usuario al login
  }

  guardarUsuario(usuario: any) {
    if (this.validarUsuario(usuario)) {
      console.log('Datos a guardar:', usuario);
      // Llamar al método actualizarUsuarioAdmin de ApiService
      this.apiService.actualizarUsuarioAdmin(usuario.ID, {
        nombreUsuario: usuario.NombreUsuario,
        claveUsuario: usuario.ClaveUsuario,
        nombreCompleto: usuario.NombreCompleto,
        tipoUsuario: usuario.TipoUsuario
        // Asegúrate de incluir todos los campos editables
      }).subscribe(
        response => {
          console.log('Usuario actualizado', response);
          this.usuarioEditandoId = null; // Finalizar edición
          this.cargarUsuarios(); // Recargar lista de usuarios
        },
        error => {
          console.error('Error al actualizar usuario', error);
        }
      );
    } else {
      alert("Por favor, asegúrate de que todos los campos estén correctamente llenados: \n" +
      "- El nombre de usuario solo puede contener letras y números.\n" +
      "- El nombre completo solo puede contener letras y espacios.\n" +
      "- La contraseña debe tener al menos 6 caracteres, incluyendo al menos una mayúscula, un número y un carácter especial (/*#$%_).\n" +
      "- El tipo de usuario es requerido.");
console.error('Validación fallida');
    }
  }
  
  
  validarUsuario(usuario: any): boolean {
    // Verificar que los campos no estén vacíos
    const camposNoVacios = usuario.NombreUsuario && usuario.NombreCompleto && usuario.ClaveUsuario && usuario.TipoUsuario;
  
    // Verificar los patrones de validación
    const nombreUsuarioValido = /^[a-zA-Z0-9]+$/.test(usuario.NombreUsuario);
    const nombreCompletoValido = /^[a-zA-Z ]+$/.test(usuario.NombreCompleto);
    const claveUsuarioValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[/\*#$%_]).{6,}$/.test(usuario.ClaveUsuario);
    const tipoUsuarioValido = usuario.TipoUsuario.length > 0;
  
    return camposNoVacios && nombreUsuarioValido && nombreCompletoValido && claveUsuarioValida && tipoUsuarioValido;
  }
  
  
  
  cancelarEdicion() {
    this.usuarioEditandoId = null;
    this.usuariosForm.reset(); // Limpia el formulario o restablece los valores anteriores
    this.cargarUsuarios(); // Recarga los usuarios para restablecer los valores originales
  }
  
  
  onSubmit() {
    if (this.usuariosForm.valid) {
      console.log(this.usuariosForm)
      this.apiService.crearNuevoUsuario(this.usuariosForm.value).subscribe(
        (respuesta) => {
          console.log("Usuario creado con éxito", respuesta);
          this.usuariosForm.reset();
          this.cargarUsuarios();
        },
        (error) => {
          console.error("Hubo un error al crear el usuario", error);
        }
      );
    } else {
      this.usuariosForm.markAllAsTouched(); // Marca todos los campos como 'touched' para mostrar los errores.
    }
  }
}
