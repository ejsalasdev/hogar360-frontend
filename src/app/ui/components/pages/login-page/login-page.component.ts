import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  toastMessage: string | null = null;
  toastType: ToastType = 'success';
  loginFormFields = [
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'input',
      inputType: 'email',
      placeholder: 'Ingresa tu correo',
      required: true,
      patternError: 'Correo inválido'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'input',
      inputType: 'password',
      placeholder: 'Ingresa tu contraseña',
      required: true,
      minlength: 8,
      patternError: 'La contraseña debe tener al menos 8 caracteres'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastMessage = 'Por favor, completa todos los campos correctamente.';
      this.toastType = 'error';
      this.cdr.markForCheck();
      return;
    }
    this.loading = true;
    this.toastMessage = null;
    this.toastType = 'success';
    const credentials: LoginRequest = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastMessage = 'Error en el servicio de autenticación.';
        this.toastType = 'error';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onToastClosed(): void {
    this.toastMessage = null;
    this.cdr.markForCheck();
  }
}
