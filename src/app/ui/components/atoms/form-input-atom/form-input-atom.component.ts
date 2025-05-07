import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atm-form-input',
  templateUrl: './form-input-atom.component.html',
  styleUrls: ['./form-input-atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputAtomComponent),
      multi: true,
    },
  ],
})
export class FormInputAtomComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null; // Añadimos el Input para maxlength
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<any>();

  private _value: any = '';
  private _onChange: any = () => {};
  private _onTouched: any = () => {};
  public isDisabled: boolean = false;

  get value(): any {
    return this._value;
  }

  set value(newValue: any) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._onChange(newValue);
      this.valueChange.emit(newValue);
    }
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this._onTouched();
  }
}