import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MainLayoutComponent,
        MockHeaderComponent,
        MockSideMenuComponent
      ]
    }).compileComponents();

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
}); 