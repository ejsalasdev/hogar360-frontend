import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AtomsModule } from '../../atoms/atoms.module';
import { ButtonAtomComponent } from '../../atoms/button-atom/button-atom.component';
import { InputAtomComponent } from '../../atoms/input-atom/input-atom.component';
import { TextareaAtomComponent } from '../../atoms/textarea-atom/textarea-atom.component';
import { FormMoleculeComponent } from './form-molecule.component';

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

  it('should emit formSubmit when onSubmit is called', () => {
    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should return a FormControl from asFormControl', () => {
    const fb = new FormBuilder();
    const control = fb.control('test');
    expect(component.asFormControl(control)).toBeInstanceOf(Object);
    expect(component.asFormControl(control).value).toBe('test');
  });
});
