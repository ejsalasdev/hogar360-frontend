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
  OnChanges,
  SimpleChanges,
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
export class FormInputAtomComponent implements ControlValueAccessor, OnChanges {
  @Input() type: InputType = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() maxlength: number | null = null;
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  private _value: any = '';
  private _onChange: any = () => { };
  private _onTouched: any = () => { };
  public isDisabled: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.cdr.detectChanges();
          });
        });
      });
    }
  }

  get value(): any {
    return this._value;
  }

  set value(newValue: any) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._onChange(newValue);
      this.valueChange.emit(newValue);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: any): void {
    if (this._value !== value) {
      this._value = value;
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
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
    if (this.type === 'textarea' && this.textareaElement) {
      this.textareaElement.nativeElement.focus();
    } else if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
}