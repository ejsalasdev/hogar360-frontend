import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaAtomComponent } from './textarea-atom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('TextareaAtomComponent', () => {
  let component: TextareaAtomComponent;
  let fixture: ComponentFixture<TextareaAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextareaAtomComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaAtomComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind and update formControl value', () => {
    // Arrange
    const textarea = fixture.nativeElement.querySelector('textarea');
    // Act
    textarea.value = 'test value';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    // Assert
    expect(component.formControl.value).toBe('test value');
  });

  it('should show required error message', () => {
    // Arrange
    component.formControl = new FormControl('', { validators: [c => c.value ? null : { required: true }] });
    component.formControl.markAsTouched();
    fixture.detectChanges();
    // Act
    const errorMsg = component.getErrorMessage();
    // Assert
    expect(errorMsg).toContain('requerido');
  });

  it('should show minlength error message', () => {
    // Arrange
    component.formControl = new FormControl('a');
    (component.formControl as any).errors = { minlength: { requiredLength: 3 } };
    component.formControl.markAsTouched();
    fixture.detectChanges();
    // Act
    const errorMsg = component.getErrorMessage();
    // Assert
    expect(errorMsg).toContain('al menos');
  });

  it('should show maxlength error message', () => {
    // Arrange
    component.formControl = new FormControl('aaaaa');
    (component.formControl as any).errors = { maxlength: { requiredLength: 3 } };
    component.formControl.markAsTouched();
    fixture.detectChanges();
    // Act
    const errorMsg = component.getErrorMessage();
    // Assert
    expect(errorMsg).toContain('máximo');
  });

  it('should show pattern error message', () => {
    // Arrange
    component.formControl = new FormControl('123');
    (component.formControl as any).errors = { pattern: true };
    component.formControl.markAsTouched();
    fixture.detectChanges();
    // Act
    const errorMsg = component.getErrorMessage();
    // Assert
    expect(errorMsg).toContain('Formato inválido');
  });

  it('should call focus method', () => {
    // Arrange
    if (!component.textareaElement) {
      component.textareaElement = { nativeElement: { focus: jest.fn() } } as any;
    }
    const spy = jest.spyOn(component.textareaElement!.nativeElement, 'focus');
    // Act
    component.focus();
    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should call setDisabledState', () => {
    // Act
    component.setDisabledState(true);
    // Assert
    expect(component.isDisabled).toBe(true);
  });

  it('should get and set value correctly', () => {
    // Arrange
    const spy = jest.spyOn(component.valueChange, 'emit');
    const markForCheckSpy = jest.spyOn((component as any).cdr, 'markForCheck');
    component.registerOnChange(jest.fn());
    // Act
    component.value = 'nuevo valor';
    // Assert
    expect(component.value).toBe('nuevo valor');
    expect(spy).toHaveBeenCalledWith('nuevo valor');
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('should not emit valueChange or markForCheck if value does not change', () => {
    // Arrange
    component.value = 'igual';
    const spy = jest.spyOn(component.valueChange, 'emit');
    const markForCheckSpy = jest.spyOn((component as any).cdr, 'markForCheck');
    // Act
    component.value = 'igual';
    // Assert
    expect(spy).not.toHaveBeenCalled();
    expect(markForCheckSpy).not.toHaveBeenCalled();
  });

  it('should call writeValue and update value', () => {
    // Arrange
    const markForCheckSpy = jest.spyOn((component as any).cdr, 'markForCheck');
    component.value = 'anterior';
    // Act
    component.writeValue('nuevo');
    // Assert
    expect(component.value).toBe('nuevo');
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('should not call markForCheck if writeValue receives same value', () => {
    // Arrange
    component.value = 'igual';
    const markForCheckSpy = jest.spyOn((component as any).cdr, 'markForCheck');
    // Act
    component.writeValue('igual');
    // Assert
    expect(markForCheckSpy).not.toHaveBeenCalled();
  });

  it('should register onChange and onTouched', () => {
    // Arrange
    const onChange = jest.fn();
    const onTouched = jest.fn();
    // Act
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    // Assert
    (component as any)._onChange('test');
    (component as any)._onTouched();
    expect(onChange).toHaveBeenCalledWith('test');
    expect(onTouched).toHaveBeenCalled();
  });

  it('should call onInputChange and update value and call _onTouched', () => {
    // Arrange
    const event = { target: { value: 'nuevo texto' } } as any;
    const valueSpy = jest.spyOn(component, 'value', 'set');
    const onTouchedSpy = jest.spyOn(component as any, '_onTouched');
    // Act
    component.onInputChange(event);
    // Assert
    expect(valueSpy).toHaveBeenCalledWith('nuevo texto');
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should return empty string in getErrorMessage if no formControl', () => {
    // Arrange
    (component as any).formControl = undefined;
    // Act
    const msg = component.getErrorMessage();
    // Assert
    expect(msg).toBe('');
  });

  it('should return empty string in getErrorMessage if no known error', () => {
    // Arrange
    component.formControl = new FormControl('');
    (component.formControl as any).errors = { custom: true };
    component.formControl.markAsTouched();
    // Act
    const msg = component.getErrorMessage();
    // Assert
    expect(msg).toBe('');
  });
}); 