import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormMoleculeComponent } from './form-molecule.component';
import { InputAtomComponent } from '../../atoms/input-atom/input-atom.component';
import { ButtonAtomComponent } from '../../atoms/button-atom/button-atom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AtomsModule } from '../../atoms/atoms.module';
import { TextareaAtomComponent } from '../../atoms/textarea-atom/textarea-atom.component';

describe('FormMoleculeComponent', () => {
  let component: FormMoleculeComponent;
  let fixture: ComponentFixture<FormMoleculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FormMoleculeComponent,
        InputAtomComponent,
        TextareaAtomComponent,
        ButtonAtomComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule, AtomsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMoleculeComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
