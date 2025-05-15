import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputAtomComponent } from './input-atom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    component.formControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind and update formControl value', () => {
    // Arrange
    const input = fixture.nativeElement.querySelector('input');
    // Act
    input.value = 'test value';
    input.dispatchEvent(new Event('input'));
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
    expect(errorMsg).toContain('obligatorio');
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
    expect(errorMsg).toContain('letras y espacios');
  });

  it('should call focus method', () => {
    // Arrange
    const spy = jest.spyOn(component.inputElement!.nativeElement, 'focus');
    // Act
    component.focus();
    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should call setDisabledState', () => {
    // Arrange
    const spy = jest.spyOn(component.inputElement!.nativeElement, 'disabled', 'set');
    // Act
    component.setDisabledState(true);
    // Assert
    expect(spy).toHaveBeenCalledWith(true);
  });
}); 