import { Component, OnInit, Renderer2,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosService } from '../datos.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AuthService } from '../authservice.service';

interface FieldErrors {
  required?: string;
  minlength?: string;
  pattern?: string;
  passwordMismatch?: string; // Agregamos passwordMismatch al tipo FieldErrors
}

interface ErrorMessages {
  [field: string]: FieldErrors;
}

@Component({
  selector: 'app-basico',
  templateUrl: './basico.component.html',
  styleUrls: ['./basico.component.css']
})
export class BasicoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  usuario: any; // Usuario actual

  errorMessages: ErrorMessages = {
    nombreUsuario: {
      required: 'El nombre de usuario es obligatorio.',
      pattern: 'El nombre de usuario solo puede contener letras y números.'
    },
    claveUsuario: {
      required: 'La contraseña es obligatoria.',
      minlength: 'La contraseña debe tener al menos 6 caracteres.',
      pattern: 'La contraseña debe contener al menos 1 mayúscula, 1 número y 1 carácter especial (/*#$%_).'
    },
    confirmarClave: {
      required: 'Confirmar la contraseña es obligatorio.',
      passwordMismatch: 'Las contraseñas no coinciden.'
    }
  };

  constructor( private authService: AuthService,private router: Router,private apiService: ApiService,private fb: FormBuilder, private datosService: DatosService, private renderer: Renderer2) {
    this.form = this.fb.group({
      id: [''],
      nombreUsuario: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      claveUsuario: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*\d.*[/*#$%_]).*$/)]
      ],
      confirmarClave: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*\d.*[/*#$%_]).*$/)]
      ],
      nombreCompleto: [''],
      tipoUsuario: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Cargar datos del usuario actual al inicializar el componente
    this.usuario = this.datosService.getUsuario();

    this.form.setValue({
      id: this.usuario.id,
      nombreUsuario: this.usuario.nombreUsuario,
      claveUsuario: this.usuario.claveUsuario,
      confirmarClave: '',
      nombreCompleto: this.usuario.nombreCompleto,
      tipoUsuario: this.usuario.tipoUsuario
    });
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
  onSubmit() {
    if (this.form.valid) {
      // Obtener el ID del usuario
      const userId = this.form.get('id')?.value;
  
      // Obtener los datos del formulario
      const userData = {
        nombreUsuario: this.form.get('nombreUsuario')?.value,
        claveUsuario: this.form.get('claveUsuario')?.value,
        // ... Otros campos
      };
  
      // Llamar al servicio para actualizar el usuario
      this.apiService.actualizarUsuario(userId, userData).subscribe(
        (response) => {
          console.log('Usuario actualizado correctamente:', response);
  
          // Redirigir al usuario al componente de login
          this.router.navigate(['/login']);
  
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      );
  
    } else {
      console.error('Formulario inválido');
      this.showPasswordMismatchAlert();
    }
  }
  

  getErrorMessage(field: string) {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return this.errorMessages[field]?.required;
    } else if (control?.hasError('minlength')) {
      return this.errorMessages[field]?.minlength;
    } else if (control?.hasError('pattern')) {
      return this.errorMessages[field]?.pattern;
    } else if (control?.hasError('passwordMismatch')) {
      return this.errorMessages[field]?.passwordMismatch;
    }
    return '';
  }

  // Función para mostrar una alerta si las contraseñas no coinciden
  private showPasswordMismatchAlert() {
    const alertMessage = 'Las contraseñas no coinciden.';
    window.alert(alertMessage);
  }

  // Custom validator para verificar si la contraseña y la confirmación de la contraseña coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('claveUsuario')?.value;
    const confirmPassword = form.get('confirmarClave')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
