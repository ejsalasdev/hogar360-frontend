import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FormMoleculeComponent } from './form-molecule.component';
import { FormInputAtomComponent } from '../../atoms/form-input-atom/form-input-atom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FormMoleculeComponent', () => {
  let component: FormMoleculeComponent;
  let fixture: ComponentFixture<FormMoleculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormMoleculeComponent, FormInputAtomComponent],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMoleculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 