import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, LoginRequest, LoginResponse, UserInfo } from './auth.service';
import { RoleService } from './role.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;
  let roleServiceMock: { [key in keyof RoleService]: jest.Mock };
  let jwtHelperServiceMock: { [key in keyof JwtHelperService]: jest.Mock };
  
  let localStorageBackingStore: { [key: string]: string | null };
  let mockLocalStorageFunctions: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };

  const mockUser: UserInfo = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    roles: ['USER']
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mockToken'
  };

  const setupTestBedAndCreateService = () => {
    TestBed.resetTestingModule();

    localStorageBackingStore = localStorageBackingStore || {};

    mockLocalStorageFunctions = {
      getItem: jest.fn((key: string) => localStorageBackingStore[key] || null),
      setItem: jest.fn((key: string, value: string) => { localStorageBackingStore[key] = value; }),
      removeItem: jest.fn((key: string) => { delete localStorageBackingStore[key]; }),
      clear: jest.fn(() => { localStorageBackingStore = {}; })
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorageFunctions,
      writable: true,
      configurable: true,
    });
    
    jest.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        AuthService,
        { provide: RoleService, useValue: roleServiceMock }, 
        { provide: JwtHelperService, useValue: jwtHelperServiceMock }, 
        { provide: JWT_OPTIONS, useValue: { tokenGetter: () => mockLocalStorageFunctions.getItem('token') || '' } }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    
    return TestBed.inject(AuthService);
  };

  beforeEach(() => {
    roleServiceMock = {
      hasRole: jest.fn(),
      isTokenExpired: jest.fn(),
      getUserRoles: jest.fn()
    };

    jwtHelperServiceMock = {
      decodeToken: jest.fn(),
      isTokenExpired: jest.fn(),
      getTokenExpirationDate: jest.fn(),
      urlBase64Decode: jest.fn(),
      tokenGetter: jest.fn(), 
      getAuthScheme: jest.fn() 
    } as { [key in keyof JwtHelperService]: jest.Mock };
    
    localStorageBackingStore = {}; 
    
    service = setupTestBedAndCreateService(); 
  });

  afterEach(() => {
    if (httpMock) {
        httpMock.verify();
    }
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadUserInfo (called by constructor)', () => {
    it('should not load user info if no token is present initially', () => {
      localStorageBackingStore = {}; 
      const newService = setupTestBedAndCreateService(); 
      
      expect((newService as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((newService as any).jwtHelper.isTokenExpired.mock).toBeDefined();

      newService.user$.subscribe(user => {
        expect(user).toBeNull();
      });
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
    });

    it('should load user info if a valid token is present initially', () => {
      const token = 'validToken';
      const decodedToken = { sub: 1, name: 'Test User', email: 'test@example.com', roles: ['USER'] };
      localStorageBackingStore = { 'token': token }; 
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);
      jwtHelperServiceMock.decodeToken.mockReturnValue(decodedToken);

      const newService = setupTestBedAndCreateService();
      expect((newService as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((newService as any).jwtHelper.isTokenExpired.mock).toBeDefined();
      expect((newService as any).jwtHelper.decodeToken.mock).toBeDefined();

      newService.user$.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
      expect(jwtHelperServiceMock.isTokenExpired).toHaveBeenCalledWith(token);
      expect(jwtHelperServiceMock.decodeToken).toHaveBeenCalledWith(token);
    });

    it('should logout if token is expired during initial load', () => {
      const token = 'expiredToken';
      localStorageBackingStore = { 'token': token };
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(true);

      const newService = setupTestBedAndCreateService();
      expect((newService as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((newService as any).jwtHelper.isTokenExpired.mock).toBeDefined();
      
      newService.user$.subscribe(user => {
        expect(user).toBeNull();
      });
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token'); 
      expect(jwtHelperServiceMock.isTokenExpired).toHaveBeenCalledWith(token);
      expect(mockLocalStorageFunctions.removeItem).toHaveBeenCalledWith('token'); 
      expect(router.navigate).toHaveBeenCalledWith(['/login']); 
    });
    
    it('should handle token with "authorities" as string for roles during initial load', () => {
      const token = 'authoritiesToken';
      const decodedToken = { sub: 1, name: 'Test User', email: 'test@example.com', authorities: 'ADMIN' };
      localStorageBackingStore = { 'token': token };
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);
      jwtHelperServiceMock.decodeToken.mockReturnValue(decodedToken);
      const newService = setupTestBedAndCreateService();
      newService.user$.subscribe(user => {
        expect(user?.roles).toEqual(['ADMIN']);
      });
    });

    it('should handle token with "authorities" as array for roles during initial load', () => {
      const token = 'authoritiesTokenArray';
      const decodedToken = { sub: 1, name: 'Test User', email: 'test@example.com', authorities: ['ADMIN', 'USER'] };
      localStorageBackingStore = { 'token': token };
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);
      jwtHelperServiceMock.decodeToken.mockReturnValue(decodedToken);
      const newService = setupTestBedAndCreateService();
      newService.user$.subscribe(user => {
        expect(user?.roles).toEqual(['ADMIN', 'USER']);
      });
    });
    
    it('should set user to null if decoding token fails during initial load', () => {
      const token = 'invalidToken';
      localStorageBackingStore = { 'token': token };
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);
      jwtHelperServiceMock.decodeToken.mockImplementation(() => { throw new Error('decoding error'); });
      
      const newService = setupTestBedAndCreateService();
      newService.user$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('login', () => {
    it('should store token and load user info on successful login', () => {
      const loginRequest: LoginRequest = { email: 'test@example.com', password: 'password' };
      const decodedToken = { sub: 1, name: 'Test User', email: 'test@example.com', roles: ['USER'] };

      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);
      jwtHelperServiceMock.decodeToken.mockReturnValue(decodedToken);

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.userApiUrl}/api/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);

      expect(mockLocalStorageFunctions.setItem).toHaveBeenCalledWith('token', mockLoginResponse.token);
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token'); 
      expect(jwtHelperServiceMock.isTokenExpired).toHaveBeenCalledWith(mockLoginResponse.token);
      expect(jwtHelperServiceMock.decodeToken).toHaveBeenCalledWith(mockLoginResponse.token);
      
      service.user$.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('logout', () => {
    it('should remove token, clear user subject, and navigate to login', () => {
      localStorageBackingStore['token'] = 'someToken'; 
      
      service.logout();

      expect(mockLocalStorageFunctions.removeItem).toHaveBeenCalledWith('token');
      service.user$.subscribe(user => {
        expect(user).toBeNull();
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if no token is present', () => {
      localStorageBackingStore['token'] = null;
      expect(service.isAuthenticated()).toBeFalsy();
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
    });

    it('should return false if token is expired', () => {
      localStorageBackingStore['token'] = 'expiredToken';
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(true);
      
      expect((service as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((service as any).jwtHelper.isTokenExpired.mock).toBeDefined();

      expect(service.isAuthenticated()).toBeFalsy();
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
      expect(jwtHelperServiceMock.isTokenExpired).toHaveBeenCalledWith('expiredToken');
    });

    it('should return true if token is present and not expired', () => {
      localStorageBackingStore['token'] = 'validToken';
      jwtHelperServiceMock.isTokenExpired.mockReturnValue(false);

      expect((service as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((service as any).jwtHelper.isTokenExpired.mock).toBeDefined();

      expect(service.isAuthenticated()).toBeTruthy();
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
      expect(jwtHelperServiceMock.isTokenExpired).toHaveBeenCalledWith('validToken');
    });
  });

  describe('hasRole', () => {
    it('should call RoleService.hasRole with the given role', () => {
      const role = 'ADMIN';
      roleServiceMock.hasRole.mockReturnValue(true);
      expect(service.hasRole(role)).toBeTruthy();
      expect(roleServiceMock.hasRole).toHaveBeenCalledWith(role);

      roleServiceMock.hasRole.mockReturnValue(false);
      expect(service.hasRole(role)).toBeFalsy();
      expect(roleServiceMock.hasRole).toHaveBeenCalledWith(role);
    });
  });

  describe('getDecodedToken', () => {
    it('should return null if no token is present', () => {
      localStorageBackingStore['token'] = null;
      expect(service.getDecodedToken()).toBeNull();
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
    });

    it('should return decoded token if token is present', () => {
      const token = 'validToken';
      const decoded = { userId: 1 };
      localStorageBackingStore['token'] = token;
      jwtHelperServiceMock.decodeToken.mockReturnValue(decoded);

      expect((service as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((service as any).jwtHelper.decodeToken.mock).toBeDefined();

      expect(service.getDecodedToken()).toEqual(decoded);
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
      expect(jwtHelperServiceMock.decodeToken).toHaveBeenCalledWith(token);
    });

    it('should return null if decoding fails', () => {
      const token = 'invalidToken';
      localStorageBackingStore['token'] = token;
      jwtHelperServiceMock.decodeToken.mockImplementation(() => { throw new Error('decoding error'); });

      expect((service as any).jwtHelper).toBe(jwtHelperServiceMock);
      expect((service as any).jwtHelper.decodeToken.mock).toBeDefined();

      expect(service.getDecodedToken()).toBeNull();
      expect(mockLocalStorageFunctions.getItem).toHaveBeenCalledWith('token');
      expect(jwtHelperServiceMock.decodeToken).toHaveBeenCalledWith(token);
    });
  });
});
