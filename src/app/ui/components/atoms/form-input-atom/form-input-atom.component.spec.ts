import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormInputAtomComponent } from './form-input-atom.component';
import { NgZone } from '@angular/core';

describe('FormInputAtomComponent', () => {
  let component: FormInputAtomComponent;
  let fixture: ComponentFixture<FormInputAtomComponent>;
  let ngZone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInputAtomComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputAtomComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.type).toBe('text');
    expect(component.label).toBe('');
    expect(component.placeholder).toBe('');
    expect(component.maxlength).toBeNull();
    expect(component.required).toBeFalsy();
    expect(component.isDisabled).toBeFalsy();
  });

  it('should update value and emit valueChange event', () => {
    const testValue = 'test value';
    const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');
    
    component.value = testValue;
    
    expect(component.value).toBe(testValue);
    expect(valueChangeSpy).toHaveBeenCalledWith(testValue);
  });

  it('should implement ControlValueAccessor methods', () => {
    const testValue = 'test value';
    const onChangeSpy = jest.fn();
    const onTouchedSpy = jest.fn();

    component.registerOnChange(onChangeSpy);
    component.registerOnTouched(onTouchedSpy);
    component.writeValue(testValue);

    expect(component.value).toBe(testValue);

    component.value = 'new value';
    expect(onChangeSpy).toHaveBeenCalledWith('new value');

    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('input', { target: { value: 'input value' } });
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    expect(component.isDisabled).toBeTruthy();

    component.setDisabledState(false);
    expect(component.isDisabled).toBeFalsy();
  });

  it('should handle input change event', () => {
    const testValue = 'test input';
    const input = fixture.debugElement.query(By.css('input'));
    const onTouchedSpy = jest.spyOn(component as any, '_onTouched');

    input.triggerEventHandler('input', { target: { value: testValue } });
    
    expect(component.value).toBe(testValue);
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should handle textarea type', () => {
    // Verificamos el estado inicial
    expect(component.type).toBe('text');
    expect(fixture.debugElement.query(By.css('input'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('textarea'))).toBeFalsy();

    // Cambiamos a textarea
    component.type = 'textarea';
    fixture.detectChanges();

    // Esperamos a que se complete el cambio
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      
      // Verificamos que los elementos se muestran/ocultan correctamente
      expect(fixture.debugElement.query(By.css('input'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
    });
  });

  it('should focus textarea when focus method is called', () => {
    component.type = 'textarea';
    fixture.detectChanges();

    // Mock the textarea element
    const mockTextarea = { focus: jest.fn() };
    component.textareaElement = { nativeElement: mockTextarea } as any;
    
    component.focus();
    expect(mockTextarea.focus).toHaveBeenCalled();
  });

  it('should not emit valueChange when value is the same', () => {
    const testValue = 'test value';
    const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');
    
    component.value = testValue;
    component.value = testValue; // Set the same value again
    
    expect(valueChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('should focus input when focus method is called', () => {
    // Asegurarnos que estamos usando un input normal
    component.type = 'text';
    fixture.detectChanges();

    // Espiar el método focus del input
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const focusSpy = jest.spyOn(inputElement, 'focus');

    // Llamar al método focus
    component.focus();

    // Verificar que se llamó al método focus
    expect(focusSpy).toHaveBeenCalled();
  });

  describe('NgZone handling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should handle type changes using NgZone', () => {
      // Espiar los métodos de NgZone
      const runOutsideAngularSpy = jest.spyOn(ngZone, 'runOutsideAngular');
      const runSpy = jest.spyOn(ngZone, 'run');
      const detectChangesSpy = jest.spyOn(component['cdr'], 'detectChanges');

      // Simular un cambio en el tipo
      component.type = 'textarea';
      component.ngOnChanges({
        type: {
          currentValue: 'textarea',
          previousValue: 'text',
          firstChange: false,
          isFirstChange: () => false
        }
      });

      // Verificar que se ejecutó fuera de la zona de Angular
      expect(runOutsideAngularSpy).toHaveBeenCalled();

      // Simular el setTimeout
      jest.runAllTimers();

      // Verificar que se volvió a la zona de Angular
      expect(runSpy).toHaveBeenCalled();
      expect(detectChangesSpy).toHaveBeenCalled();
    });
  });
});
