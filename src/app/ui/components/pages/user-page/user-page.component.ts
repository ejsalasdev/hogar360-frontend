import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';

export function adultValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? null : { adult: true };
}

export function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  userForm: FormGroup;
  toastMessage: string | null = null;
  toastType: ToastType = 'info';
  userFormFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese su nombre',
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese su apellido',
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    {
      name: 'documentId',
      label: 'Cédula',
      type: 'input',
      inputType: 'number',
      placeholder: 'Ingrese su cédula',
      required: true,
      minLength: 8,
      maxLength: 10,
    },
    {
      name: 'phoneNumber',
      label: 'Teléfono Celular',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese su teléfono',
      required: true,
      minLength: 10,
      maxLength: 13,
    },
    {
      name: 'birthDate',
      label: 'Fecha de nacimiento',
      type: 'input',
      inputType: 'date',
      placeholder: 'Ingrese su fecha de nacimiento',
      required: true,
      minAge: 18,
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'input',
      inputType: 'email',
      placeholder: 'Ingrese su correo electrónico',
      required: true,
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'input',
      inputType: 'password',
      placeholder: 'Ingrese su contraseña',
      required: true,
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: 'input',
      inputType: 'password',
      placeholder: 'Ingrese su contraseña',
      required: true,
    },
  ]

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        documentId: [
          '',
          [
            Validators.required,
            Validators.pattern('^\\d+$'),
            Validators.minLength(8),
            Validators.maxLength(10),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('^\\+?\\d+$'),
            Validators.minLength(10),
            Validators.maxLength(13),
          ],
        ],
        birthDate: ['', [Validators.required, adultValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [passwordMatchValidator],
      }
    );
  }

  ngOnInit(): void {
  }

  private showToast(message: string, type: ToastType): void {
    this.toastMessage = message;
    this.toastType = type;
    this.changeDetectorRef.markForCheck();
  }

  onToastClosed(): void {
    this.toastMessage = null;
    this.changeDetectorRef.markForCheck();
  }

  onFormSubmit() {
    const user: User = this.userForm.value;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.createUser(user).subscribe({
      next: () => {
        this.showToast('Usuario creado exitosamente', 'success');
        this.userForm.reset();
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        this.showToast('Error al crear el usuario', 'error');
      },
    });
  }
}
