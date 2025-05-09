import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderMoleculeComponent } from './header-molecule.component';
import { By } from '@angular/platform-browser';

describe('HeaderMoleculeComponent', () => {
  let component: HeaderMoleculeComponent;
  let fixture: ComponentFixture<HeaderMoleculeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderMoleculeComponent]
    });
    fixture = TestBed.createComponent(HeaderMoleculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default config', () => {
    expect(component.config.logoText).toBe('Hogar 360');
    expect(component.config.welcomeMessage).toBe('Bienvenido');
    expect(component.config.userName).toBe('Admin');
    expect(component.config.showUserMenu).toBe(true);
  });

  it('should update config when input changes', () => {
    const newConfig = {
      logoText: 'New Logo',
      welcomeMessage: 'Welcome',
      userName: 'User',
      userAvatarUrl: '/path/to/avatar.jpg',
      showUserMenu: false
    };

    component.config = newConfig;
    fixture.detectChanges();

    expect(component.config).toEqual(newConfig);
  });

  it('should merge partial config with defaults', () => {
    const partialConfig = {
      logoText: 'New Logo',
      userName: 'User'
    };

    component.config = partialConfig;
    fixture.detectChanges();

    expect(component.config.logoText).toBe('New Logo');
    expect(component.config.userName).toBe('User');
    expect(component.config.welcomeMessage).toBe('Bienvenido');
    expect(component.config.showUserMenu).toBe(true);
  });

  it('should emit logoClick event when logo is clicked', () => {
    const logoClickSpy = jest.spyOn(component.logoClick, 'emit');
    component.onLogoClick();
    expect(logoClickSpy).toHaveBeenCalled();
  });

  it('should toggle user menu and emit userMenuClick event', () => {
    const userMenuClickSpy = jest.spyOn(component.userMenuClick, 'emit');
    
    expect(component.isUserMenuOpen).toBe(false);
    
    component.onUserMenuClick();
    expect(component.isUserMenuOpen).toBe(true);
    expect(userMenuClickSpy).toHaveBeenCalled();
    
    component.onUserMenuClick();
    expect(component.isUserMenuOpen).toBe(false);
    expect(userMenuClickSpy).toHaveBeenCalledTimes(2);
  });

  it('should close user menu when clicking outside', () => {
    component.isUserMenuOpen = true;
    component.onUserMenuOutsideClick();
    expect(component.isUserMenuOpen).toBe(false);
  });

  it('should get correct values from getters', () => {
    const testConfig = {
      logoText: 'Test Logo',
      welcomeMessage: 'Test Welcome',
      userName: 'Test User',
      userAvatarUrl: '/test/avatar.jpg',
      showUserMenu: false
    };

    component.config = testConfig;

    expect(component.logoText).toBe('Test Logo');
    expect(component.welcomeMessage).toBe('Test Welcome');
    expect(component.userName).toBe('Test User');
    expect(component.userAvatarUrl).toBe('/test/avatar.jpg');
    expect(component.showUserMenu).toBe(false);
  });
});
