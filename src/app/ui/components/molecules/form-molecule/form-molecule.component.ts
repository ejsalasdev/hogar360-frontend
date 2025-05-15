import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'mol-form',
  templateUrl: './form-molecule.component.html',
  styleUrls: ['./form-molecule.component.scss']
})
export class FormMoleculeComponent {
  /**
   * fields: Array de objetos con la configuración de cada campo.
   * type puede ser 'input', 'textarea' o 'select'.
   */
  @Input() fields: any[] = [];
  @Input() formGroup!: FormGroup;
  @Input() submitLabel: string = 'Enviar';
  @Output() formSubmit = new EventEmitter<void>();

  onSubmit() {
    console.log('Form-molecule submit');
    this.formSubmit.emit();
  }

  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  areFieldsEmpty(): boolean {
    if (!this.formGroup) return true;
    const values = this.formGroup.value;
    // Ajusta los nombres de los campos según los que existan en tu formulario
    return (!values.name || !values.name.trim()) && (!values.description || !values.description.trim());
  }
} 