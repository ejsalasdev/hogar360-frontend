import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputAtomComponent } from './form-input-atom/form-input-atom.component';
import { ToastAtomComponent } from './toast-atom/toast-atom.component';
import { ConfirmDialogAtomComponent } from './confirm-dialog-atom/confirm-dialog-atom.component';

@NgModule({
  declarations: [
    FormInputAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormInputAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent
  ]
})
export class AtomsModule { }