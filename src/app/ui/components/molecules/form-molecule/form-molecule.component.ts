import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'mol-form',
  templateUrl: './form-molecule.component.html',
  styleUrls: ['./form-molecule.component.scss'],
})
export class FormMoleculeComponent {
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
    return (
      !values.sector ||
      !values.sector.trim() ||
      !values.department ||
      !values.city
    );
  }
}
