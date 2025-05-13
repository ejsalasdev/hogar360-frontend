import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'mol-header',
  template: ''
})
class MockHeaderComponent {
  @Input() logoText: string = '';
  @Input() welcomeMessage: string = '';
  @Input() userName: string = '';
  @Input() userAvatarUrl: string = '';
  @Input() config: any = {};
}

@Component({
  selector: 'mol-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() menuItems: any[] = [];
  @Input() activeItemId: string | null = null;
}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let router: Router;
  let navigationEndSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    navigationEndSubject = new Subject<NavigationEnd>();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MainLayoutComponent,
        MockHeaderComponent,
        MockSideMenuComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router.events, 'pipe').mockReturnValue(navigationEndSubject);

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
  });

  it('should initialize with menu items', () => {
    expect(component.menuItems.length).toBe(5);
    expect(component.menuItems[0].label).toBe('Dashboard');
    expect(component.menuItems[0].route).toBe('/dashboard');
  });

  describe('Route Listener', () => {
    it('should update active menu item on navigation end', () => {
      const mockEvent = new NavigationEnd(1, '/admin/categories', '/admin/categories');
      navigationEndSubject.next(mockEvent);
      expect(component.activeItemId).toBe('categories');
    });

    it('should handle navigation to unknown route', () => {
      const mockEvent = new NavigationEnd(1, '/unknown', '/unknown');
      navigationEndSubject.next(mockEvent);
    expect(component.activeItemId).toBeNull();
    });
  });

  describe('Menu Item Click', () => {
    it('should navigate to valid route', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
      component.onMenuItemClick({
        id: 'categories',
        route: '/admin/categories',
        disabled: false,
        label: 'Categories',
        icon: 'pi-list'
      });
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/categories']);
    });

    it('should not navigate if item is disabled', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
      component.onMenuItemClick({
        id: 'categories',
        route: '/admin/categories',
        disabled: true,
        label: 'Categories',
        icon: 'pi-list'
      });
    expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should navigate to empty route if route is invalid', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.onMenuItemClick({
        id: 'invalid',
        route: '',
        disabled: false,
        label: 'Invalid',
        icon: 'pi-times'
      });
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });
  });

  describe('Active Menu Item', () => {
    it('should update active item for matching route', () => {
      const mockEvent = new NavigationEnd(1, '/admin/categories', '/admin/categories');
      navigationEndSubject.next(mockEvent);
      expect(component.activeItemId).toBe('categories');
    });

    it('should set active item to null for non-matching route', () => {
      const mockEvent = new NavigationEnd(1, '/unknown', '/unknown');
      navigationEndSubject.next(mockEvent);
      expect(component.activeItemId).toBeNull();
    });
});
}); 