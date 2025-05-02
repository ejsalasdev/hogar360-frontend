import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMoleculeComponent } from './header-molecule.component';

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
});
