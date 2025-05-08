import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputAtomComponent } from './form-input-atom/form-input-atom.component';
import { ToastAtomComponent } from './toast-atom/toast-atom.component';

@NgModule({
  declarations: [
    FormInputAtomComponent,
    ToastAtomComponent,
  ],
  imports: [
    CommonModule, // Importa CommonModule para directivas básicas como *ngIf, *ngFor
    FormsModule, // Necesario para el FormInputAtomComponent
  ],
  exports: [ // Exporta los componentes que quieres usar en otros módulos
    FormInputAtomComponent,
    ToastAtomComponent,
  ]
})
export class AtomsModule { }