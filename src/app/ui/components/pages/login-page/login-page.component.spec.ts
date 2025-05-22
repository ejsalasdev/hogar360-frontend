import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: any;
  let router: any;
  let debugElement: DebugElement;

  let localStorageSpy: jest.SpyInstance;

  beforeEach(async () => {
    const authServiceSpy = {
      login: jest.fn(),
    };
    const routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
      ],
      declarations: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize login form with email and password controls', () => {
      expect(component.loginForm.contains('email')).toBeTruthy();
      expect(component.loginForm.contains('password')).toBeTruthy();
    });

    it('should make the email control required', () => {
      const control = component.loginForm.get('email');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const control = component.loginForm.get('email');

      control?.setValue('invalid-email');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('email')).toBeTruthy();

      control?.setValue('valid@email.com');
      expect(control?.valid).toBeTruthy();
    });

    it('should make the password control required', () => {
      const control = component.loginForm.get('password');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should validate the password length', () => {
      const control = component.loginForm.get('password');

      control?.setValue('short');
      expect(control?.valid).toBeFalsy();
      expect(control?.hasError('minlength')).toBeTruthy();

      control?.setValue('password12345');
      expect(control?.valid).toBeTruthy();
    });

    it('should mark form as invalid when any field is invalid', () => {
      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('password12345');
      expect(component.loginForm.valid).toBeFalsy();

      component.loginForm.get('email')?.setValue('valid@email.com');
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as valid when all fields are valid', () => {
      component.loginForm.get('email')?.setValue('valid@email.com');
      component.loginForm.get('password')?.setValue('password12345');
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('Form submission', () => {
    it('should show error toast when form is invalid', () => {
      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(component.toastMessage).toBeTruthy();
      expect(component.toastType).toBe('error');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login when form is valid', () => {
      const testEmail = 'test@example.com';
      const testPassword = 'password12345';

      component.loginForm.get('email')?.setValue(testEmail);
      component.loginForm.get('password')?.setValue(testPassword);

      authService.login.mockReturnValue(of({ token: 'fake-token' }));

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith({
        email: testEmail,
        password: testPassword,
      });
      expect(component.loading).toBeFalsy();
    });

    it('should navigate to dashboard after successful login', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password12345');

      authService.login.mockReturnValue(of({ token: 'fake-token' }));

      component.onSubmit();

      expect(localStorageSpy).toHaveBeenCalledWith('token', 'fake-token');

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle login errors', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password12345');

      authService.login.mockReturnValue(
        throwError(() => new Error('Login error'))
      );

      component.onSubmit();

      expect(component.toastMessage).toBe(
        'Error en el servicio de autenticación.'
      );
      expect(component.toastType).toBe('error');
      expect(component.loading).toBeFalsy();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Toast functionality', () => {
    it('should clear toast message when onToastClosed is called', () => {
      component.toastMessage = 'Test message';

      component.onToastClosed();

      expect(component.toastMessage).toBeNull();
    });

    it('should set loading to false after onToastClosed is called', () => {
      component.loading = true;
      component.toastMessage = 'Test message';

      component.onToastClosed();

      expect(component.loading).toBeTruthy();
    });
  });

  describe('UI Elements', () => {
    it('should render the login form correctly', () => {
      const formElement = debugElement.query(By.css('mol-form'));
      expect(formElement).toBeTruthy();
    });

    it('should pass correct fields to mol-form component', () => {
      expect(component.loginFormFields.length).toBe(2);
      expect(component.loginFormFields[0].name).toBe('email');
      expect(component.loginFormFields[1].name).toBe('password');
    });

    it('should configure email field correctly', () => {
      const emailField = component.loginFormFields.find(
        (field) => field.name === 'email'
      );
      expect(emailField).toBeTruthy();
      expect(emailField?.label).toBe('Correo electrónico');
      expect(emailField?.type).toBe('input');
      expect(emailField?.inputType).toBe('email');
      expect(emailField?.required).toBe(true);
    });

    it('should configure password field correctly', () => {
      const passwordField = component.loginFormFields.find(
        (field) => field.name === 'password'
      );
      expect(passwordField).toBeTruthy();
      expect(passwordField?.label).toBe('Contraseña');
      expect(passwordField?.type).toBe('input');
      expect(passwordField?.inputType).toBe('password');
      expect(passwordField?.required).toBe(true);
      expect(passwordField?.minlength).toBe(8);
    });

    it('should show toast when message is available', () => {
      component.toastMessage = null;
      fixture.detectChanges();
      let toastElement = debugElement.query(By.css('atm-toast'));
      expect(toastElement).toBeFalsy();

      component.toastMessage = 'Test message';
      fixture.detectChanges();
      toastElement = debugElement.query(By.css('atm-toast'));
      expect(toastElement).toBeTruthy();
    });
  });

  describe('Login process', () => {
    it('should set loading to true during login process', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password12345');

      authService.login.mockReturnValue({
        subscribe: jest.fn((callbacks) => {}),
      });

      expect(component.loading).toBeFalsy();

      component.onSubmit();

      expect(component.loading).toBeTruthy();
    });

    it('should properly handle token storage and navigation on successful login', () => {
      const testToken = 'test-jwt-token-12345';

      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password12345');

      authService.login.mockReturnValue(of({ token: testToken }));

      expect(localStorageSpy).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      component.onSubmit();

      expect(localStorageSpy).toHaveBeenCalledWith('token', testToken);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.loading).toBeFalsy();
    });

    it('should not navigate or store token when login fails', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password12345');

      authService.login.mockReturnValue(
        throwError(() => new Error('Login failed'))
      );

      component.onSubmit();

      expect(localStorageSpy).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      expect(component.toastMessage).toBe(
        'Error en el servicio de autenticación.'
      );
      expect(component.toastType).toBe('error');
    });
  });
});
