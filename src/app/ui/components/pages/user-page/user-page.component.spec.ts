import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UserPageComponent } from './user-page.component';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let userServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      createUser: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el formulario con los campos esperados', () => {
    // Arrange & Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.contains('name')).toBe(true);
    expect(component.userForm.contains('lastName')).toBe(true);
    expect(component.userForm.contains('documentId')).toBe(true);
    expect(component.userForm.contains('phoneNumber')).toBe(true);
    expect(component.userForm.contains('birthDate')).toBe(true);
    expect(component.userForm.contains('email')).toBe(true);
    expect(component.userForm.contains('password')).toBe(true);
    expect(component.userForm.contains('confirmPassword')).toBe(true);
  });

  it('debería marcar el formulario como inválido si los campos requeridos están vacíos', () => {
    // Arrange
    component.userForm.reset();
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.invalid).toBe(true);
  });

  it('debería validar el mínimo de caracteres en el nombre', () => {
    // Arrange
    component.userForm.get('name')?.setValue('Jo');
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.get('name')?.errors?.['minlength']).toBeTruthy();
  });

  it('debería validar el patrón de cédula (solo números)', () => {
    // Arrange
    component.userForm.get('documentId')?.setValue('abc123');
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.get('documentId')?.errors?.['pattern']).toBeTruthy();
  });

  it('debería validar el email', () => {
    // Arrange
    component.userForm.get('email')?.setValue('no-es-email');
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('debería validar la edad mínima (mayor de 18)', () => {
    // Arrange
    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 16);
    component.userForm.get('birthDate')?.setValue(fechaMenor.toISOString().substring(0, 10));
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.get('birthDate')?.errors?.['adult']).toBeTruthy();
  });

  it('debería validar que las contraseñas coincidan', () => {
    // Arrange
    component.userForm.get('password')?.setValue('password123');
    component.userForm.get('confirmPassword')?.setValue('diferente');
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.userForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    // Arrange
    component.userForm.get('name')?.setValue(''); // Campo requerido vacío
    // Act
    component.onFormSubmit();
    // Assert
    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('debería crear el usuario y mostrar toast de éxito', () => {
    // Arrange
    const userData = {
      name: 'Juan',
      lastName: 'Pérez',
      documentId: '12345678',
      phoneNumber: '+573001112233',
      birthDate: '1990-01-01',
      email: 'juan@correo.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    component.userForm.setValue(userData);
    userServiceMock.createUser.mockReturnValue(of({}));
    // Act
    component.onFormSubmit();
    // Assert
    expect(userServiceMock.createUser).toHaveBeenCalledWith(expect.objectContaining(userData));
    expect(component.toastMessage).toBe('Usuario creado exitosamente');
    expect(component.toastType).toBe('success');
    expect(component.userForm.pristine).toBe(true); // El formulario se resetea
  });

  it('debería mostrar toast de error si el servicio falla', () => {
    // Arrange
    const userData = {
      name: 'Juan',
      lastName: 'Pérez',
      documentId: '12345678',
      phoneNumber: '+573001112233',
      birthDate: '1990-01-01',
      email: 'juan@correo.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    component.userForm.setValue(userData);
    userServiceMock.createUser.mockReturnValue(throwError(() => new Error('Error')));
    // Act
    component.onFormSubmit();
    // Assert
    expect(userServiceMock.createUser).toHaveBeenCalled();
    expect(component.toastMessage).toBe('Error al crear el usuario');
    expect(component.toastType).toBe('error');
  });

  it('debería cerrar el toast correctamente', () => {
    // Arrange
    component.toastMessage = 'Mensaje de prueba';
    // Act
    component.onToastClosed();
    // Assert
    expect(component.toastMessage).toBeNull();
  });
});
