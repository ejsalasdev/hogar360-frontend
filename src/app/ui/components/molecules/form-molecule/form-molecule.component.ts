import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mol-form',
  templateUrl: './form-molecule.component.html',
  styleUrls: ['./form-molecule.component.scss']
})
export class FormMoleculeComponent {
  @Input() fields: any[] = [];
  @Input() model: any = {};
  @Input() submitLabel: string = 'Enviar';
  @Output() submit = new EventEmitter<any>();

  onSubmit() {
    this.submit.emit(this.model);
  }
} 