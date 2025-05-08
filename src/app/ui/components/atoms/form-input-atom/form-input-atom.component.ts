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

/**
 * Componente atómico para inputs de formulario.
 * Soporta tanto inputs normales como textareas.
 * Implementa ControlValueAccessor para integrarse con ReactiveForms.
 */
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
  /** Tipo de input. Puede ser text, number, email, password, tel, url o textarea */
  @Input() type: InputType = 'text';
  /** Etiqueta del input */
  @Input() label: string = '';
  /** Placeholder del input */
  @Input() placeholder: string = '';
  /** Longitud máxima del texto */
  @Input() maxlength: number | null = null;
  /** Indica si el campo es requerido */
  @Input() required: boolean = false;
  /** Evento emitido cuando cambia el valor */
  @Output() valueChange = new EventEmitter<any>();

  /** Referencia al elemento textarea */
  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;
  /** Referencia al elemento input */
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  private _value: any = '';
  private _onChange: any = () => {};
  private _onTouched: any = () => {};
  public isDisabled: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      // Ejecutamos el cambio fuera de la zona de Angular para evitar ciclos de detección adicionales
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // Volvemos a la zona de Angular para actualizar la vista
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

  /**
   * Enfoca el elemento de input actual (input o textarea)
   */
  focus(): void {
    if (this.type === 'textarea' && this.textareaElement) {
      this.textareaElement.nativeElement.focus();
    } else if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
}