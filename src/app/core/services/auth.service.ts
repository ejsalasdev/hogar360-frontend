import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { RoleService } from './role.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userApiUrl = `${environment.apiUrl}/api/v1/auth`;
  private userSubject = new BehaviorSubject<UserInfo | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private roleService: RoleService,
    private jwtHelper: JwtHelperService
  ) {
    this.loadUserInfo();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.userApiUrl}/login`, request)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.loadUserInfo();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    return this.roleService.hasRole(role);
  }

  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  // Force reload user information - useful for ensuring state consistency
  reloadUserInfo(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.userSubject.next(null);
      return;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      this.logout();
      return;
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      let roles: string[] = [];
      if (decodedToken.roles && Array.isArray(decodedToken.roles)) {
        roles = decodedToken.roles;
      } else if (decodedToken.authorities) {
        if (typeof decodedToken.authorities === 'string') {
          roles = [decodedToken.authorities];
        } else if (Array.isArray(decodedToken.authorities)) {
          roles = decodedToken.authorities;
        }
      }

      const userInfo: UserInfo = {
        id: decodedToken.sub || 0,
        name: decodedToken.name || 'Usuario',
        email: decodedToken.email || '',
        roles: roles,
      };

      this.userSubject.next(userInfo);
    } catch (error) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
    }
  }
}
