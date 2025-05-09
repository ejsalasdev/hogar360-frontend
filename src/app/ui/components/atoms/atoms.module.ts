import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputAtomComponent } from './form-input-atom/form-input-atom.component';
import { ToastAtomComponent } from './toast-atom/toast-atom.component';

@NgModule({
  declarations: [
    FormInputAtomComponent,
    ToastAtomComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormInputAtomComponent,
    ToastAtomComponent
  ]
})
export class AtomsModule { }