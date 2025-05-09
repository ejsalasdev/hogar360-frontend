import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderMoleculeComponent } from '../../components/molecules/header-molecule/header-molecule.component';
import { SideMenuMoleculeComponent } from '../../components/molecules/side-menu-molecule/side-menu-molecule.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let router: Router;
  let navigationEndSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    navigationEndSubject = new Subject<NavigationEnd>();
    
    await TestBed.configureTestingModule({
      declarations: [
        MainLayoutComponent,
        HeaderMoleculeComponent,
        SideMenuMoleculeComponent
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
  });

  it('should initialize with menu items', () => {
    expect(component.menuItems.length).toBe(5);
    expect(component.menuItems[0].label).toBe('Dashboard');
    expect(component.menuItems[0].route).toBe('/dashboard');
  });

  it('should update active menu item when route changes', fakeAsync(() => {
    const navigationEnd = new NavigationEnd(1, '/dashboard', '/dashboard');
    component['updateActiveMenuItem']('/dashboard');
    tick();
    
    expect(component.activeItemId).toBe('dashboard');
  }));

  it('should set activeItemId to null when no matching route', fakeAsync(() => {
    component['updateActiveMenuItem']('/non-existent-route');
    tick();
    
    expect(component.activeItemId).toBeNull();
  }));

  it('should navigate when menu item is clicked', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const menuItem = { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: 'dashboard.png' };
    
    component.onMenuItemClick(menuItem);
    tick();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should not navigate when menu item is disabled', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const menuItem = { 
      id: 'dashboard', 
      label: 'Dashboard', 
      route: '/dashboard', 
      icon: 'dashboard.png',
      disabled: true 
    };
    
    component.onMenuItemClick(menuItem);
    tick();
    
    expect(navigateSpy).not.toHaveBeenCalled();
  }));

  it('should handle route changes through router events', fakeAsync(() => {
    const navigationEnd = new NavigationEnd(1, '/dashboard', '/dashboard');
    const routerEventsSpy = jest.spyOn(router.events, 'pipe');
    
    component.ngOnInit();
    tick();
    
    expect(routerEventsSpy).toHaveBeenCalled();
  }));
});
