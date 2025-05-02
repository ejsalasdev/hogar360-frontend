import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputAtomComponent } from './form-input-atom.component';

describe('FormInputAtomComponent', () => {
  let component: FormInputAtomComponent;
  let fixture: ComponentFixture<FormInputAtomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormInputAtomComponent]
    });
    fixture = TestBed.createComponent(FormInputAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
