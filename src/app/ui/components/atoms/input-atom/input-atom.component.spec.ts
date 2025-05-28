import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputAtomComponent } from './input-atom.component';

describe('InputAtomComponent', () => {
  let component: InputAtomComponent;
  let fixture: ComponentFixture<InputAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputAtomComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with formControl', () => {
    let formControl: FormControl;

    beforeEach(() => {
      formControl = new FormControl('');
      component.formControl = formControl;
      fixture.detectChanges();
    });

    it('should bind and update formControl value', () => {
      // Arrange
      const testValue = 'test value';
      const input = fixture.nativeElement.querySelector('input');
      
      // Act
      input.value = testValue;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Assert
      expect(formControl.value).toBe(testValue);
    });

    it('should show required error message', () => {
      // Arrange
      const requiredControl = new FormControl('', { validators: [c => c.value ? null : { required: true }] });
      
      // Act
      component.formControl = requiredControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      // Assert
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('obligatorio');
    });

    it('should show minlength error message', () => {
      // Arrange
      const minLengthControl = new FormControl('a');
      (minLengthControl as any).errors = { minlength: { requiredLength: 3 } };
      
      // Act
      component.formControl = minLengthControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      // Assert
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('al menos');
    });

    it('should show maxlength error message', () => {
      // Arrange
      const maxLengthControl = new FormControl('aaaaa');
      (maxLengthControl as any).errors = { maxlength: { requiredLength: 3 } };
      
      // Act
      component.formControl = maxLengthControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      // Assert
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('máximo');
    });

    it('should show pattern error message', () => {
      const patternControl = new FormControl('123');
      (patternControl as any).errors = { pattern: true };
      component.formControl = patternControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('Formato inválido');
    });

    it('should show dateRange error message', () => {
      const dateRangeControl = new FormControl('2025-01-01');
      (dateRangeControl as any).errors = { 
        dateRange: { 
          minDate: '2025-05-01', 
          maxDate: '2025-06-01', 
          actual: '2025-01-01' 
        } 
      };
      component.formControl = dateRangeControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('debe estar entre');
    });

    it('should show timeFormat error message', () => {
      const timeFormatControl = new FormControl('25:70');
      (timeFormatControl as any).errors = { timeFormat: true };
      component.formControl = timeFormatControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('formato de hora debe ser HH:mm');
    });

    it('should show beforeToday error message', () => {
      const beforeTodayControl = new FormControl('2020-01-01');
      (beforeTodayControl as any).errors = { beforeToday: true };
      component.formControl = beforeTodayControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('debe ser igual o posterior a hoy');
    });

    it('should show maxOneMonth error message', () => {
      const maxOneMonthControl = new FormControl('2026-01-01');
      (maxOneMonthControl as any).errors = { maxOneMonth: true };
      component.formControl = maxOneMonthControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('no puede ser mayor a 1 mes desde hoy');
    });

    it('should show adult error message', () => {
      const adultControl = new FormControl('2020-01-01');
      (adultControl as any).errors = { adult: true };
      component.formControl = adultControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('Debes ser mayor de 18 años');
    });

    it('should show email error message', () => {
      const emailControl = new FormControl('invalid-email');
      (emailControl as any).errors = { email: true };
      component.formControl = emailControl;
      component.formControl.markAsTouched();
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toContain('correo electrónico no es válido');
    });

    it('should return empty string when no errors', () => {
      const noErrorControl = new FormControl('valid value');
      component.formControl = noErrorControl;
      fixture.detectChanges();
      
      const errorMsg = component.getErrorMessage();
      expect(errorMsg).toBe('');
    });
  });

  describe('without formControl (ControlValueAccessor mode)', () => {
    it('should update internal value when using ControlValueAccessor', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'test value';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.value).toBe('test value');
    });

    it('should call writeValue', () => {
      component.writeValue('initial value');
      fixture.detectChanges();
      
      expect(component.currentValue).toBe('initial value');
    });

    it('should register onChange callback', () => {
      const onChangeFn = jest.fn();
      component.registerOnChange(onChangeFn);
      
      component.value = 'new value';
      
      expect(onChangeFn).toHaveBeenCalledWith('new value');
    });

    it('should register onTouched callback', () => {
      const onTouchedFn = jest.fn();
      component.registerOnTouched(onTouchedFn);
      
      component.onBlur();
      
      expect(onTouchedFn).toHaveBeenCalled();
    });
  });

  describe('component methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call focus method when inputElement exists', () => {
      const mockFocus = jest.fn();
      Object.defineProperty(component, 'inputElement', {
        value: { nativeElement: { focus: mockFocus } },
        writable: true
      });
      
      component.focus();
      
      expect(mockFocus).toHaveBeenCalled();
    });

    it('should handle focus method when inputElement is undefined', () => {
      Object.defineProperty(component, 'inputElement', {
        value: undefined,
        writable: true
      });
      
      expect(() => component.focus()).not.toThrow();
    });

    it('should call setDisabledState when inputElement exists', () => {
      const mockElement = { disabled: false };
      Object.defineProperty(component, 'inputElement', {
        value: { nativeElement: mockElement },
        writable: true
      });
      
      component.setDisabledState(true);
      
      expect(mockElement.disabled).toBe(true);
    });

    it('should handle setDisabledState when inputElement is undefined', () => {
      Object.defineProperty(component, 'inputElement', {
        value: undefined,
        writable: true
      });
      
      expect(() => component.setDisabledState(true)).not.toThrow();
    });

    it('should handle onBlur with formControl', () => {
      const formControl = new FormControl('');
      const markAsTouchedSpy = jest.spyOn(formControl, 'markAsTouched');
      component.formControl = formControl;
      
      component.onBlur();
      
      expect(markAsTouchedSpy).toHaveBeenCalled();
    });

    it('should handle onBlur without formControl', () => {
      const onTouchedFn = jest.fn();
      component.registerOnTouched(onTouchedFn);
      
      component.onBlur();
      
      expect(onTouchedFn).toHaveBeenCalled();
    });
  });

  describe('currentValue getter', () => {
    it('should return formControl value when formControl exists', () => {
      const formControl = new FormControl('form value');
      component.formControl = formControl;
      
      expect(component.currentValue).toBe('form value');
    });

    it('should return internal value when formControl does not exist', () => {
      component.formControl = undefined;
      component.writeValue('internal value');
      
      expect(component.currentValue).toBe('internal value');
    });

    it('should return empty string when formControl value is null', () => {
      const formControl = new FormControl(null);
      component.formControl = formControl;
      
      expect(component.currentValue).toBe('');
    });
  });
}); 