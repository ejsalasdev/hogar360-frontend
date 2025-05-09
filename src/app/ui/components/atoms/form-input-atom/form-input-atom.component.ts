import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'textarea';

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
  @Input() type: InputType = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null;
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  private _value: string = '';
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  public isDisabled: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._onChange(newValue);
      this.valueChange.emit(newValue);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string): void {
    if (this._value !== value) {
      this._value = value;
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this._onTouched();
  }

  focus(): void {
    const element = this.type === 'textarea' ? this.textareaElement : this.inputElement;
    element?.nativeElement?.focus();
  }
}