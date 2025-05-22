import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RoleService } from '../services/role.service';
import { Router } from '@angular/router';

/**
 * Interceptor para verificar los permisos antes de enviar solicitudes al servidor
 * según las reglas de negocio:
 * 
 * - Solo administradores pueden crear categorías o ubicaciones
 * - Solo administradores pueden crear usuarios vendedores
 * - Solo vendedores (o administradores) pueden publicar casas
 */
@Injectable()
export class RoleInterceptor implements HttpInterceptor {

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // No aplicar verificaciones a solicitudes de autenticación
    if (request.url.includes('/api/v1/auth')) {
      return next.handle(request);
    }

    // Obtener los roles del usuario actual
    const roles = this.roleService.getUserRoles();
    
    // Verificar permisos según la URL y el método
    
    // Creación de categorías - Solo administradores
    if (request.url.includes('/api/v1/category/create') && request.method === 'POST') {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(() => new HttpErrorResponse({
          error: { message: 'No tienes permisos para crear categorías' },
          status: 403
        }));
      }
    }
    
    // Creación de ubicaciones - Solo administradores
    if (request.url.includes('/api/v1/ubication/create') && request.method === 'POST') {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(() => new HttpErrorResponse({
          error: { message: 'No tienes permisos para crear ubicaciones' },
          status: 403
        }));
      }
    }
    
    // Creación de usuarios vendedores - Solo administradores
    if (request.url.includes('/api/v1/user/create') && request.method === 'POST') {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(() => new HttpErrorResponse({
          error: { message: 'No tienes permisos para crear usuarios' },
          status: 403
        }));
      }
    }
    
    // Publicación de casas - Solo vendedores o administradores
    if (request.url.includes('/api/v1/house/create') && request.method === 'POST') {
      if (!roles.isSeller && !roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(() => new HttpErrorResponse({
          error: { message: 'No tienes permisos para publicar propiedades' },
          status: 403
        }));
      }
    }
    
    // Continuar con la solicitud si pasó todas las verificaciones
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el servidor devuelve un error 403 (Forbidden), redirigir a la página de acceso denegado
        if (error.status === 403) {
          this.router.navigate(['/access-denied']);
        }
        return throwError(() => error);
      })
    );
  }
}
