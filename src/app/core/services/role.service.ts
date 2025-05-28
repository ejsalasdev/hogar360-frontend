import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface UserRoles {
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private jwtHelper = new JwtHelperService();

  constructor() { }

  getUserRoles(): UserRoles {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAdmin: false, isSeller: false, isBuyer: false };
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      
      const hasAdmin = this.checkRoleInToken(decodedToken, 'ADMIN');
      const hasSeller = this.checkRoleInToken(decodedToken, 'SELLER');
      const hasBuyer = this.checkRoleInToken(decodedToken, 'BUYER');
      
      return {
        isAdmin: hasAdmin,
        isSeller: hasSeller,
        isBuyer: hasBuyer
      };
    } catch (error) {
      return { isAdmin: false, isSeller: false, isBuyer: false };
    }
  }
  
  private checkRoleInToken(decodedToken: any, roleName: string): boolean {
    if (decodedToken.roles && Array.isArray(decodedToken.roles)) {
      if (decodedToken.roles.includes(roleName)) {
        return true;
      }
    }
    
    if (decodedToken.authorities) {
      if (typeof decodedToken.authorities === 'string') {
        return decodedToken.authorities === roleName;
      } else if (Array.isArray(decodedToken.authorities)) {
        return decodedToken.authorities.includes(roleName);
      }
    }
    
    return false;
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return roles.isAdmin;
      case 'SELLER':
        return roles.isSeller;
      case 'BUYER':
        return roles.isBuyer;
      default:
        return false;
    }
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true;
    }
    
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      return true;
    }
  }
}
