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

  describe('areFieldsEmpty', () => {
    it('should return true if formGroup is undefined', () => {
      component.formGroup = undefined as any;
      expect(component.areFieldsEmpty()).toBe(true);
    });
    it('should return true if sector is empty or only spaces', () => {
      component.formGroup = new FormBuilder().group({
        sector: '',
        department: '1',
        city: '2',
      });
      expect(component.areFieldsEmpty()).toBe(true);
      component.formGroup.patchValue({ sector: '   ' });
      expect(component.areFieldsEmpty()).toBe(true);
    });
    it('should return true if department or city is empty', () => {
      component.formGroup = new FormBuilder().group({
        sector: 'Sector',
        department: '',
        city: '2',
      });
      expect(component.areFieldsEmpty()).toBe(true);
      component.formGroup.patchValue({ department: '1', city: '' });
      expect(component.areFieldsEmpty()).toBe(true);
    });
    it('should return false if all fields are filled correctly', () => {
      component.formGroup = new FormBuilder().group({
        sector: 'Sector',
        department: '1',
        city: '2',
      });
      expect(component.areFieldsEmpty()).toBe(false);
    });
  });
});
