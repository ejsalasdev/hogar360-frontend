import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuMoleculeComponent } from './side-menu-molecule.component';

describe('SideMenuMoleculeComponent', () => {
  let component: SideMenuMoleculeComponent;
  let fixture: ComponentFixture<SideMenuMoleculeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuMoleculeComponent]
    });
    fixture = TestBed.createComponent(SideMenuMoleculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
