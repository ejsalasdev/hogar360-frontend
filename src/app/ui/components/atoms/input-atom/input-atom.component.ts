import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
} from '@angular/core';
import {
  FormControl,
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'atm-input',
  templateUrl: './input-atom.component.html',
  styleUrls: ['./input-atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAtomComponent),
      multi: true,
    },
  ],
})
export class InputAtomComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null;
  @Input() required: boolean = false;
  @Input() formControl?: AbstractControl;
  @Input() externalError: string | null = null;
  @Input() patternError: string | null = null;

  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  public _value: string = '';
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get currentValue(): string {
    return this.formControl ? this.formControl.value || '' : this._value;
  }

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    if (this._value !== val) {
      this._value = val;
      this._onChange(val);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string): void {
    this._value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.disabled = isDisabled;
    }
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (this.formControl) {
      this.formControl.setValue(value);
      this.formControl.markAsTouched();
    } else {
      this.value = value;
    }
  }

  onBlur(): void {
    if (this.formControl) {
      this.formControl.markAsTouched();
    }
    this._onTouched();
  }

  focus(): void {
    this.inputElement?.nativeElement?.focus();
  }

  getErrorMessage(): string {
    const control = this.formControl;
    if (!control || !control.errors) return '';
    
    if (control.hasError('required'))
      return 'Este campo es obligatorio';
    if (control.hasError('adult')) {
      return 'Debes ser mayor de 18 años';
    }
    if (control.hasError('email'))
      return 'El correo electrónico no es válido';
    if (control.hasError('minlength')) {
      return `${this.label || 'Este campo'} debe tener al menos ${
        control.getError('minlength').requiredLength
      } caracteres`;
    }
    if (control.hasError('maxlength'))
      return `${this.label || 'Este campo'} debe tener máximo ${
        control.getError('maxlength').requiredLength
      } caracteres`;
    if (control.hasError('beforeToday')) {
      return 'La fecha debe ser igual o posterior a hoy';
    }
    if (control.hasError('maxOneMonth')) {
      return 'La fecha no puede ser mayor a 1 mes desde hoy';
    }
    if (control.hasError('dateRange')) {
      const error = control.getError('dateRange');
      return `La fecha debe estar entre ${error.minDate} y ${error.maxDate}`;
    }
    if (control.hasError('timeFormat')) {
      return 'El formato de hora debe ser HH:mm';
    }
    if (control.hasError('pattern'))
      return this.patternError || 'Formato inválido';
    return '';
  }
}
