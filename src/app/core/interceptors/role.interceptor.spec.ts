import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RoleService } from '../services/role.service';
import { RoleInterceptor } from './role.interceptor';

describe('RoleInterceptor', () => {
  let interceptor: RoleInterceptor;
  let roleService: { getUserRoles: jest.Mock };
  let router: { navigate: jest.Mock };
  let mockHandler: { handle: jest.Mock };

  beforeEach(() => {
    roleService = {
      getUserRoles: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoleInterceptor,
        { provide: RoleService, useValue: roleService },
        { provide: Router, useValue: router },
      ],
    });

    interceptor = TestBed.inject(RoleInterceptor);
    mockHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Creation and Authentication Requests', () => {
    it('should be created', () => {
      expect(interceptor).toBeTruthy();
    });

    it('should allow authentication requests without role check', () => {
      const request = new HttpRequest('POST', '/api/v1/auth/login', {});
      interceptor.intercept(request, mockHandler as any);
      expect(roleService.getUserRoles).not.toHaveBeenCalled();
      expect(mockHandler.handle).toHaveBeenCalledWith(request);
    });
  });

  describe('Category Management', () => {
    it('should allow admin to create categories', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: true });
      const request = new HttpRequest('POST', '/api/v1/category/create', {});

      interceptor.intercept(request, mockHandler as any);

      expect(mockHandler.handle).toHaveBeenCalledWith(request);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block non-admin from creating categories', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: false });
      const request = new HttpRequest('POST', '/api/v1/category/create', {});

      const result = interceptor.intercept(request, mockHandler as any);

      expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
      result.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.error.message).toBe(
            'No tienes permisos para crear categorías'
          );
        },
      });
    });
  });

  describe('Location Management', () => {
    it('should allow admin to create locations', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: true });
      const request = new HttpRequest('POST', '/api/v1/ubication/create', {});

      interceptor.intercept(request, mockHandler as any);

      expect(mockHandler.handle).toHaveBeenCalledWith(request);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block non-admin from creating locations', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: false });
      const request = new HttpRequest('POST', '/api/v1/ubication/create', {});

      const result = interceptor.intercept(request, mockHandler as any);

      expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
      result.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.error.message).toBe(
            'No tienes permisos para crear ubicaciones'
          );
        },
      });
    });
  });

  describe('User Management', () => {
    it('should allow admin to create seller users', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: true });
      const request = new HttpRequest('POST', '/api/v1/user/create', {});

      interceptor.intercept(request, mockHandler as any);

      expect(mockHandler.handle).toHaveBeenCalledWith(request);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block non-admin from creating users', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: false });
      const request = new HttpRequest('POST', '/api/v1/user/create', {});

      const result = interceptor.intercept(request, mockHandler as any);

      expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
      result.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.error.message).toBe(
            'No tienes permisos para crear usuarios'
          );
        },
      });
    });
  });

  describe('House Management', () => {
    it('should allow seller to create houses', () => {
      roleService.getUserRoles.mockReturnValue({
        isAdmin: false,
        isSeller: true,
      });
      const request = new HttpRequest('POST', '/api/v1/house/create', {});

      interceptor.intercept(request, mockHandler as any);

      expect(mockHandler.handle).toHaveBeenCalledWith(request);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block regular users from creating houses', () => {
      roleService.getUserRoles.mockReturnValue({
        isAdmin: false,
        isSeller: false,
      });
      const request = new HttpRequest('POST', '/api/v1/house/create', {});

      const result = interceptor.intercept(request, mockHandler as any);

      expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
      result.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.error.message).toBe(
            'No tienes permisos para publicar propiedades'
          );
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server-side 403 errors', () => {
      roleService.getUserRoles.mockReturnValue({ isAdmin: true });
      const request = new HttpRequest('POST', '/api/v1/any/endpoint', {});
      mockHandler.handle.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403 }))
      );

      const result = interceptor.intercept(request, mockHandler as any);

      result.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
        },
      });
    });
  });
});
