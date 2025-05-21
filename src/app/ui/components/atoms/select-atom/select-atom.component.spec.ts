import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectAtomComponent, SelectOption } from './select-atom.component';

describe('SelectAtomComponent', () => {
  let component: SelectAtomComponent;
  let fixture: ComponentFixture<SelectAtomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAtomComponent],
      imports: [ReactiveFormsModule, FormsModule]
    });
    fixture = TestBed.createComponent(SelectAtomComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl();
    component.options = [
      { value: '1', label: 'Opción 1' },
      { value: '2', label: 'Opción 2' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options and placeholder', () => {
    // Arrange
    fixture.detectChanges();
    // Act
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    // Assert
    expect(select.options.length).toBe(3);
    expect(select.options[0].textContent).toBe('Seleccione una opción');
    expect(select.options[1].textContent).toBe('Opción 1');
    expect(select.options[2].textContent).toBe('Opción 2');
  });

  it('should emit valueChange and update value on select change', () => {
    // Arrange
    const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');
    fixture.detectChanges();
    // Act
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = '2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // Assert
    expect(component.value).toBe(2);
    expect(valueChangeSpy).toHaveBeenCalledWith(2);
  });

  it('should set and get value via ControlValueAccessor', () => {
    // Arrange
    // Act
    component.writeValue('1');
    fixture.detectChanges();
    // Assert
    expect(component.value).toBe('1');
    // Cambia el valor y verifica que se propaga
    let changedValue: any = null;
    component.registerOnChange((val) => (changedValue = val));
    component.value = '2';
    expect(changedValue).toBe('2');
  });

  it('should call onTouched when select changes', () => {
    // Arrange
    const onTouchedSpy = jest.fn();
    component.registerOnTouched(onTouchedSpy);
    fixture.detectChanges();
    // Act
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // Assert
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should disable select when formControl is disabled', () => {
    // Arrange
    component.formControl.disable();
    fixture.detectChanges();
    // Act
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    // Assert
    expect(select.disabled).toBe(true);
  });

  it('should show required error when field is required and empty', () => {
    // Arrange
    component.required = true;
    const control = new FormControl('', { validators: Validators.required });
    component.formControl = control;
    if (component.ngOnInit) { component.ngOnInit(); }
    fixture.detectChanges();
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
    fixture.detectChanges();
    // Act
    const error = fixture.debugElement.query(By.css('.select-atom__error'));
    // Assert
    expect(error).not.toBeNull();
    expect(error.nativeElement.textContent).toContain('Este campo es requerido.');
  });

  it('should apply disabled class when formControl is disabled', () => {
    // Arrange
    component.formControl.disable();
    component.cdr.markForCheck();
    fixture.detectChanges();
    // Act
    const select = fixture.debugElement.query(By.css('select'));
    // Assert
    expect(select.nativeElement.classList.contains('select__field--disabled')).toBe(true);
  });
});
