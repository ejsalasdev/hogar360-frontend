import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuMoleculeComponent, MenuItem } from './side-menu-molecule.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideMenuMoleculeComponent', () => {
  let component: SideMenuMoleculeComponent;
  let fixture: ComponentFixture<SideMenuMoleculeComponent>;

  const mockMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard.png', route: '/dashboard' },
    { id: 'categories', label: 'Categories', icon: 'category.png', route: '/categories', disabled: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuMoleculeComponent],
      imports: [RouterTestingModule]
    });
    fixture = TestBed.createComponent(SideMenuMoleculeComponent);
    component = fixture.componentInstance;
    component.menuItems = mockMenuItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty menu items', () => {
    const emptyComponent = new SideMenuMoleculeComponent();
    expect(emptyComponent.menuItems).toEqual([]);
    expect(emptyComponent.activeItemId).toBeNull();
  });

  it('should track items by id', () => {
    const item = mockMenuItems[0];
    expect(component.trackByFn(0, item)).toBe('dashboard');
  });

  it('should emit item click event when item is not disabled', () => {
    const itemClickSpy = jest.spyOn(component.itemClick, 'emit');
    const item = mockMenuItems[0];

    component.onItemClick(item);

    expect(itemClickSpy).toHaveBeenCalledWith(item);
  });

  it('should not emit item click event when item is disabled', () => {
    const itemClickSpy = jest.spyOn(component.itemClick, 'emit');
    const item = mockMenuItems[1];

    component.onItemClick(item);

    expect(itemClickSpy).not.toHaveBeenCalled();
  });

  it('should correctly identify active item', () => {
    component.activeItemId = 'dashboard';
    
    expect(component.isItemActive(mockMenuItems[0])).toBe(true);
    expect(component.isItemActive(mockMenuItems[1])).toBe(false);
  });

  it('should handle null activeItemId', () => {
    component.activeItemId = null;
    
    expect(component.isItemActive(mockMenuItems[0])).toBe(false);
    expect(component.isItemActive(mockMenuItems[1])).toBe(false);
  });
});
