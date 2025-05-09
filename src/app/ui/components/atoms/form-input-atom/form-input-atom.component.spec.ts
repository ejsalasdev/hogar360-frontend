import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormInputAtomComponent } from './form-input-atom.component';

describe('FormInputAtomComponent', () => {
  let component: FormInputAtomComponent;
  let fixture: ComponentFixture<FormInputAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInputAtomComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputAtomComponent);
    component = fixture.componentInstance;
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
    expect(component.type).toBe('text');
    expect(fixture.debugElement.query(By.css('input'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('textarea'))).toBeFalsy();

    component.type = 'textarea';
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('input'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
    });
  });

  it('should focus textarea when focus method is called', () => {
    component.type = 'textarea';
    fixture.detectChanges();

    const mockTextarea = { focus: jest.fn() };
    component.textareaElement = { nativeElement: mockTextarea } as any;

    component.focus();
    expect(mockTextarea.focus).toHaveBeenCalled();
  });

  it('should not emit valueChange when value is the same', () => {
    const testValue = 'test value';
    const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

    component.value = testValue;
    component.value = testValue; 

    expect(valueChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('should focus input when focus method is called', () => {
    component.type = 'text';
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const focusSpy = jest.spyOn(inputElement, 'focus');

    component.focus();

    expect(focusSpy).toHaveBeenCalled();
  });
});
