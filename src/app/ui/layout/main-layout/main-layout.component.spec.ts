import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleService } from 'src/app/core/services/role.service';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'org-header',
  template: ''
})
class MockHeaderComponent {
  @Input() config: any = {};
}

@Component({
  selector: 'org-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() menuItems: any[] = [];
}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let router: Router;
  let authService: { logout: jest.Mock, user$: any, getDecodedToken: jest.Mock };
  let roleService: { getUserRoles: jest.Mock, hasRole: jest.Mock };
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    // Arrange
    userSubject = new BehaviorSubject(null);
    
    authService = {
      logout: jest.fn(),
      user$: userSubject.asObservable(),
      getDecodedToken: jest.fn().mockReturnValue(null)
    };
    
    roleService = {
      getUserRoles: jest.fn().mockReturnValue({ isAdmin: true, isSeller: false, isBuyer: false }),
      hasRole: jest.fn()
    };
    
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MainLayoutComponent,
        MockHeaderComponent,
        MockSideMenuComponent
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: RoleService, useValue: roleService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as any;
    roleService = TestBed.inject(RoleService) as any;

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      // Act & Assert
      expect(component).toBeTruthy();
    });

    it('should initialize with default user info when no decoded token', () => {
      // Arrange
      authService.getDecodedToken.mockReturnValue(null);
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.user).toBeDefined();
      expect(component.user.name).toBe('Admin');
      expect(component.user.welcomeMessage).toBe('Bienvenido');
      expect(component.user.avatarUrl).toBe('/assets/images/avatar.jpg');
      expect(component.user.role).toBe('ADMIN');
    });

    it('should initialize with user info from decoded token', () => {
      // Arrange
      const mockToken = { name: 'Token User' };
      authService.getDecodedToken.mockReturnValue(mockToken);
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.user.name).toBe('Token User');
      expect(component.user.role).toBe('ADMIN');
    });

    it('should initialize with filtered menu items based on role', () => {
      // Act & Assert
      expect(component.menuItems.length).toBe(6);
      expect(component.menuItems[0].label).toBe('Dashboard');
      expect(component.menuItems[0].route).toBe('/dashboard');
      
      const categoriesItem = component.menuItems.find(item => item.id === 'categories');
      expect(categoriesItem).toBeTruthy();
      
      const usersItem = component.menuItems.find(item => item.id === 'users');
      expect(usersItem).toBeTruthy();
    });
  });

  describe('Menu Navigation', () => {
    it('should navigate when menu item with route is clicked', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');
      const menuItem = { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'dashboard.png', 
        route: '/dashboard', 
        disabled: false 
      };
      
      // Act
      component.onMenuItemClick(menuItem);
      
      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    });
    
    it('should not navigate when disabled menu item is clicked', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');
      const menuItem = { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: 'dashboard.png', 
        route: '/dashboard', 
        disabled: true 
      };
      
      // Act
      component.onMenuItemClick(menuItem);
      
      // Assert
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not navigate when menu item has no route', () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, 'navigate');
      const menuItem = { 
        id: 'action', 
        label: 'Action', 
        icon: 'action.png', 
        disabled: false 
      };
      
      // Act
      component.onMenuItemClick(menuItem);
      
      // Assert
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    it('should call authService.logout when onLogout is called', () => {
      // Act
      component.onLogout();
      
      // Assert
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('User Updates', () => {
    it('should update user info when authService.user$ emits new data', () => {
      // Arrange
      const userInfo = { name: 'Test User', roles: ['SELLER'] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      expect(component.user.name).toBe('Test User');
      expect(component.user.role).toBe('SELLER');
    });

    it('should reinitialize when authService.user$ emits null', () => {
      // Arrange
      const initSpy = jest.spyOn(component as any, 'initializeUserState');
      
      // Act
      userSubject.next(null);
      fixture.detectChanges();
      
      // Assert
      expect(initSpy).toHaveBeenCalled();
    });

    it('should handle user with no name gracefully', () => {
      // Arrange
      const userInfo = { roles: ['BUYER'] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      expect(component.user.name).toBe('Usuario');
      expect(component.user.role).toBe('BUYER');
    });
  });

  describe('Role-based Menu Filtering', () => {
    it('should filter menu items by SELLER role', () => {
      // Arrange
      roleService.getUserRoles.mockReturnValue({ isAdmin: false, isSeller: true, isBuyer: false });
      const userInfo = { name: 'Seller', roles: ['SELLER'] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      const usersItem = component.menuItems.find(item => item.id === 'users');
      expect(usersItem).toBeFalsy();
      
      const categoriesItem = component.menuItems.find(item => item.id === 'categories');
      expect(categoriesItem).toBeTruthy();
      
      const housesItem = component.menuItems.find(item => item.id === 'houses');
      expect(housesItem).toBeTruthy();
    });
    
    it('should filter menu items by BUYER role', () => {
      // Arrange
      roleService.getUserRoles.mockReturnValue({ isAdmin: false, isSeller: false, isBuyer: true });
      const userInfo = { name: 'Buyer', roles: ['BUYER'] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      const usersItem = component.menuItems.find(item => item.id === 'users');
      expect(usersItem).toBeFalsy();
      
      const categoriesItem = component.menuItems.find(item => item.id === 'categories');
      expect(categoriesItem).toBeFalsy();
      
      const housesItem = component.menuItems.find(item => item.id === 'houses');
      expect(housesItem).toBeFalsy();
      
      const locationsItem = component.menuItems.find(item => item.id === 'locations');
      expect(locationsItem).toBeFalsy();
      
      const dashboardItem = component.menuItems.find(item => item.id === 'dashboard');
      expect(dashboardItem).toBeTruthy();
    });

    it('should show all menu items for ADMIN role', () => {
      // Arrange
      roleService.getUserRoles.mockReturnValue({ isAdmin: true, isSeller: false, isBuyer: false });
      
      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.menuItems.length).toBe(6);
      
      const expectedItems = ['dashboard', 'categories', 'locations', 'houses', 'users', 'settings'];
      expectedItems.forEach(itemId => {
        const item = component.menuItems.find(item => item.id === itemId);
        expect(item).toBeTruthy();
      });
    });
  });

  describe('Role Determination', () => {
    it('should determine role correctly from valid roles array', () => {
      // Arrange
      const userInfo = { name: 'Test', roles: ['ADMIN', 'USER'] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      expect(component.user.role).toBe('ADMIN');
    });

    it('should return default role for invalid roles', () => {
      // Arrange
      const userInfo = { name: 'Test', roles: null };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      expect(component.user.role).toBe('USUARIO');
    });

    it('should return default role for empty roles array', () => {
      // Arrange
      const userInfo = { name: 'Test', roles: [] };
      
      // Act
      userSubject.next(userInfo);
      fixture.detectChanges();
      
      // Assert
      expect(component.user.role).toBe('USUARIO');
    });

    it('should prioritize roles correctly (ADMIN > SELLER > BUYER)', () => {
      // Arrange & Act & Assert
      const testCases = [
        { roles: ['SELLER'], expected: 'SELLER' },
        { roles: ['BUYER'], expected: 'BUYER' },
        { roles: ['BUYER', 'SELLER'], expected: 'SELLER' },
        { roles: ['ADMIN', 'SELLER', 'BUYER'], expected: 'ADMIN' },
        { roles: ['UNKNOWN'], expected: 'USUARIO' }
      ];

      testCases.forEach(testCase => {
        const userInfo = { name: 'Test', roles: testCase.roles };
        userSubject.next(userInfo);
        fixture.detectChanges();
        expect(component.user.role).toBe(testCase.expected);
      });
    });
  });

  describe('Component Cleanup', () => {
    it('should complete destroy subject on ngOnDestroy', () => {
      // Arrange
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      
      // Act
      component.ngOnDestroy();
      
      // Assert
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});