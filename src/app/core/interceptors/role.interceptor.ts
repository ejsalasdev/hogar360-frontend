import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RoleService } from '../services/role.service';
import { Router } from '@angular/router';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  constructor(private roleService: RoleService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/v1/auth')) {
      return next.handle(request);
    }

    const roles = this.roleService.getUserRoles();

    if (
      request.url.includes('/api/v1/category/create') &&
      request.method === 'POST'
    ) {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(
          () =>
            new HttpErrorResponse({
              error: { message: 'No tienes permisos para crear categorías' },
              status: 403,
            })
        );
      }
    }

    if (
      request.url.includes('/api/v1/ubication/create') &&
      request.method === 'POST'
    ) {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(
          () =>
            new HttpErrorResponse({
              error: { message: 'No tienes permisos para crear ubicaciones' },
              status: 403,
            })
        );
      }
    }

    if (
      request.url.includes('/api/v1/user/create') &&
      request.method === 'POST'
    ) {
      if (!roles.isAdmin) {
        this.router.navigate(['/access-denied']);
        return throwError(
          () =>
            new HttpErrorResponse({
              error: { message: 'No tienes permisos para crear usuarios' },
              status: 403,
            })
        );
      }
    }

    if (
      request.url.includes('/api/v1/house/create') &&
      request.method === 'POST'
    ) {
      if (!roles.isSeller) {
        this.router.navigate(['/access-denied']);
        return throwError(
          () =>
            new HttpErrorResponse({
              error: {
                message: 'No tienes permisos para publicar propiedades',
              },
              status: 403,
            })
        );
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.router.navigate(['/access-denied']);
        }
        return throwError(() => error);
      })
    );
  }
}
