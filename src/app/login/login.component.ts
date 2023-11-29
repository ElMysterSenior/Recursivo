import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { DatosService } from '../datos.service';
import { AuthService } from '../authservice.service';

interface FieldErrors {
  required?: string;
  minlength?: string;
  pattern?: string;
}

interface ErrorMessages {
  [field: string]: FieldErrors;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  recaptchaResolved = false;
  errorMessages: ErrorMessages = {
    usuario: {
      required: 'El nombre de usuario es obligatorio.'
    },
    clave: {
      required: 'La contraseña es obligatoria.',
      minlength: 'La contraseña debe tener al menos 6 caracteres.',
      pattern: 'La contraseña debe contener al menos 1 mayúscula, 1 número y 1 carácter especial (/*#$%_).'
    }
  };

  constructor(private apiService: ApiService,private fb: FormBuilder,private authService: AuthService, private router: Router,private datosService: DatosService) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      clave: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d.*[/*#$%_]).*$/)
        ]
      ]
    });
  }

  getErrorMessage(field: string) {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return this.errorMessages[field]?.required;
    } else if (control?.hasError('minlength')) {
      return this.errorMessages[field]?.minlength;
    } else if (control?.hasError('pattern')) {
      return this.errorMessages[field]?.pattern;
    }
    return '';
  }

  handleSubmit() {
    if (this.form.valid && this.recaptchaResolved) {
      const nombreUsuario = this.form.value.usuario;
      const clave = this.form.value.clave;
      this.authService.login(nombreUsuario, clave);
    } else {
      alert('Formulario inválido o reCAPTCHA no resuelto');

    }
  }

  onRecaptchaResponse(token: string | null) {
    if (token) {
      this.recaptchaResolved = true;
      this.apiService.validarRecaptcha(token).subscribe({
        next: (response) => {
          if (response.recaptchaValido) {
            this.handleSubmit(); // Si el reCAPTCHA es válido, procede con el inicio de sesión
          } else {
            console.error('Validación de reCAPTCHA fallida');
            this.recaptchaResolved = false;
          }
        },
        error: (error) => {
          console.error('Error al validar reCAPTCHA', error);
          // Manejar el error de la solicitud aquí
        }
      });
    } else {
      console.error('No se recibió un token de reCAPTCHA');
      // Manejar la situación cuando el token es null
    }
  }
  
}