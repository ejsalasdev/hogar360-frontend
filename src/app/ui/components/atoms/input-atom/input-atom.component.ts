import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef
} from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  @Input() formControl!: FormControl;

  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  private _value: string = '';
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.value = target.value;
    this._onTouched();
  }

  focus(): void {
    this.inputElement?.nativeElement?.focus();
  }

  getErrorMessage(): string {
    if (!this.formControl) return '';
    if (this.formControl.hasError('required')) return 'Este campo es obligatorio';
    if (this.formControl.hasError('minlength')) return 'Muy corto';
    if (this.formControl.hasError('maxlength')) return 'Muy largo';
    if (this.formControl.hasError('pattern')) return 'Formato inválido';
    return '';
  }
} 