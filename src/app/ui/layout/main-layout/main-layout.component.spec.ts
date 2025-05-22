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
  let authService: { logout: jest.Mock, user$: any };
  let roleService: { getUserRoles: jest.Mock, hasRole: jest.Mock };
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject(null);
    
    authService = {
      logout: jest.fn(),
      user$: userSubject.asObservable()
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default user info', () => {
    expect(component.user).toBeDefined();
    expect(component.user.name).toBe('Admin');
    expect(component.user.welcomeMessage).toBe('Bienvenido');
    expect(component.user.avatarUrl).toBe('/assets/images/avatar.jpg');
    expect(component.user.role).toBe('ADMIN');
  });

  it('should initialize with filtered menu items based on role', () => {
    expect(component.menuItems.length).toBe(6);
    expect(component.menuItems[0].label).toBe('Dashboard');
    expect(component.menuItems[0].route).toBe('/dashboard');
    
    const categoriesItem = component.menuItems.find(item => item.id === 'categories');
    expect(categoriesItem).toBeTruthy();
    
    const usersItem = component.menuItems.find(item => item.id === 'users');
    expect(usersItem).toBeTruthy();
  });
  
  it('should navigate when menu item with route is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const menuItem = { id: 'dashboard', label: 'Dashboard', icon: 'dashboard.png', route: '/dashboard', disabled: false };
    
    component.onMenuItemClick(menuItem);
    
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });
  
  it('should not navigate when disabled menu item is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const menuItem = { id: 'dashboard', label: 'Dashboard', icon: 'dashboard.png', route: '/dashboard', disabled: true };
    
    component.onMenuItemClick(menuItem);
    
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  
  it('should call authService.logout when onLogout is called', () => {
    component.onLogout();
    
    expect(authService.logout).toHaveBeenCalled();
  });
  
  it('should update user info when authService.user$ emits new data', () => {
    const userInfo = { name: 'Test User', roles: ['SELLER'] };
    
    userSubject.next(userInfo);
    fixture.detectChanges();
    
    expect(component.user.name).toBe('Test User');
    expect(component.user.role).toBe('SELLER');
  });
  
  it('should filter menu items by SELLER role', () => {
    roleService.getUserRoles.mockReturnValue({ isAdmin: false, isSeller: true, isBuyer: false });
    const userInfo = { name: 'Seller', roles: ['SELLER'] };
    
    userSubject.next(userInfo);
    fixture.detectChanges();
    
    const usersItem = component.menuItems.find(item => item.id === 'users');
    expect(usersItem).toBeFalsy();
    
    const categoriesItem = component.menuItems.find(item => item.id === 'categories');
    expect(categoriesItem).toBeTruthy();
  });
  
  it('should filter menu items by BUYER role', () => {
    roleService.getUserRoles.mockReturnValue({ isAdmin: false, isSeller: false, isBuyer: true });
    const userInfo = { name: 'Buyer', roles: ['BUYER'] };
    
    userSubject.next(userInfo);
    fixture.detectChanges();
    
    const usersItem = component.menuItems.find(item => item.id === 'users');
    expect(usersItem).toBeFalsy();
    
    const categoriesItem = component.menuItems.find(item => item.id === 'categories');
    expect(categoriesItem).toBeFalsy();
    
    const dashboardItem = component.menuItems.find(item => item.id === 'dashboard');
    expect(dashboardItem).toBeTruthy();
  });
});