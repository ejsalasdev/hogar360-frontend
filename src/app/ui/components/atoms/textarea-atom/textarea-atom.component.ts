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

@Component({
  selector: 'atm-textarea',
  templateUrl: './textarea-atom.component.html',
  styleUrls: ['./textarea-atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaAtomComponent),
      multi: true,
    },
  ],
})
export class TextareaAtomComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null;
  @Input() required: boolean = false;
  @Input() formControl!: FormControl;
  @Input() isDisabled: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;

  private _value: string = '';
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

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
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this._onTouched();
  }

  focus(): void {
    this.textareaElement?.nativeElement?.focus();
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