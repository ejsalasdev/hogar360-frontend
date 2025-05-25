import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrganismComponent } from './modal-organism.component';

describe('ModalOrganismComponent', () => {
  let component: ModalOrganismComponent;
  let fixture: ComponentFixture<ModalOrganismComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalOrganismComponent]
    });
    fixture = TestBed.createComponent(ModalOrganismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
