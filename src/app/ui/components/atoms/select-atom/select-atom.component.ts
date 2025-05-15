import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, AbstractControl } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'atm-select',
  templateUrl: './select-atom.component.html',
  styleUrls: ['./select-atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAtomComponent),
      multi: true,
    },
  ],
})
export class SelectAtomComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() formControl!: FormControl;
  @Output() valueChange = new EventEmitter<string>();

  private _value: string | number | null = null;
  private _onChange: (value: string | number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get value(): string | number | null {
    return this._value;
  }

  set value(newValue: string | number | null) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._onChange(newValue);
      this.valueChange.emit(newValue as string);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string | number | null): void {
    if (this._value !== value) {
      this._value = value;
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value === '' ? null : target.value;
    this.value = value;
    this._onTouched();
  }

  onChange(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
