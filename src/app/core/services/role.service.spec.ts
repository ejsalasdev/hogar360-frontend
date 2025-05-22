import { TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let jwtHelper: JwtHelperService;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleService]
    });
    service = TestBed.inject(RoleService);
    jwtHelper = new JwtHelperService();
    localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRoles', () => {
    it('should return empty roles when no token exists', () => {
      localStorageSpy.mockReturnValue(null);

      const roles = service.getUserRoles();

      expect(roles).toEqual({ isAdmin: false, isSeller: false, isBuyer: false });
    });

    it('should detect roles in array format', () => {
      const token = generateToken({ roles: ['ADMIN', 'SELLER'] });
      localStorageSpy.mockReturnValue(token);

      const roles = service.getUserRoles();

      expect(roles).toEqual({ isAdmin: true, isSeller: true, isBuyer: false });
    });

    it('should detect roles in authorities array format', () => {
      const token = generateToken({ authorities: ['ADMIN', 'BUYER'] });
      localStorageSpy.mockReturnValue(token);

      const roles = service.getUserRoles();

      expect(roles).toEqual({ isAdmin: true, isSeller: false, isBuyer: true });
    });

    it('should detect single role in authorities string format', () => {
      const token = generateToken({ authorities: 'SELLER' });
      localStorageSpy.mockReturnValue(token);

      const roles = service.getUserRoles();

      expect(roles).toEqual({ isAdmin: false, isSeller: true, isBuyer: false });
    });

    it('should handle invalid tokens', () => {
      localStorageSpy.mockReturnValue('token_invalido');

      const roles = service.getUserRoles();

      expect(roles).toEqual({ isAdmin: false, isSeller: false, isBuyer: false });
    });
  });

  describe('hasRole', () => {
    it('should verify admin role', () => {
      const token = generateToken({ roles: ['ADMIN'] });
      localStorageSpy.mockReturnValue(token);

      const hasAdminRole = service.hasRole('ADMIN');

      expect(hasAdminRole).toBe(true);
    });

    it('should verify seller role', () => {
      const token = generateToken({ roles: ['SELLER'] });
      localStorageSpy.mockReturnValue(token);

      const hasSellerRole = service.hasRole('SELLER');

      expect(hasSellerRole).toBe(true);
    });

    it('should verify buyer role', () => {
      const token = generateToken({ roles: ['BUYER'] });
      localStorageSpy.mockReturnValue(token);

      const hasBuyerRole = service.hasRole('BUYER');

      expect(hasBuyerRole).toBe(true);
    });

    it('should handle non-existent roles', () => {
      const token = generateToken({ roles: ['ADMIN'] });
      localStorageSpy.mockReturnValue(token);

      const hasUnknownRole = service.hasRole('UNKNOWN');

      expect(hasUnknownRole).toBe(false);
    });

    it('should be case insensitive', () => {
      const token = generateToken({ roles: ['ADMIN'] });
      localStorageSpy.mockReturnValue(token);

      const hasAdminRole = service.hasRole('admin');

      expect(hasAdminRole).toBe(true);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no token exists', () => {
      localStorageSpy.mockReturnValue(null);

      const isExpired = service.isTokenExpired();

      expect(isExpired).toBe(true);
    });

    it('should verify expired token', () => {
      const expiredToken = generateExpiredToken();
      localStorageSpy.mockReturnValue(expiredToken);

      const isExpired = service.isTokenExpired();

      expect(isExpired).toBe(true);
    });

    it('should verify valid token', () => {
      const validToken = generateValidToken();
      localStorageSpy.mockReturnValue(validToken);

      const isExpired = service.isTokenExpired();

      expect(isExpired).toBe(false);
    });

    it('should handle malformed tokens', () => {
      localStorageSpy.mockReturnValue('token_malformado');

      const isExpired = service.isTokenExpired();

      expect(isExpired).toBe(true);
    });
  });
});

function generateToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'signature';
  return `${header}.${encodedPayload}.${signature}`;
}

function generateValidToken(): string {
  return generateToken({
    exp: Math.floor(Date.now() / 1000) + 3600,
    roles: ['ADMIN']
  });
}

function generateExpiredToken(): string {
  return generateToken({
    exp: Math.floor(Date.now() / 1000) - 3600,
    roles: ['ADMIN']
  });
}