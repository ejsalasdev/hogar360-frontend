import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputAtomComponent } from './form-input-atom/form-input-atom.component';

@NgModule({
  declarations: [
    FormInputAtomComponent,
  ],
  imports: [
    CommonModule, // Importa CommonModule para directivas básicas como *ngIf, *ngFor
  ],
  exports: [ // Exporta los componentes que quieres usar en otros módulos
    FormInputAtomComponent,
  ]
})
export class AtomsModule { }