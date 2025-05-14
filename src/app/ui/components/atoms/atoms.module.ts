import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputAtomComponent } from './form-input-atom/form-input-atom.component';
import { ToastAtomComponent } from './toast-atom/toast-atom.component';
import { ConfirmDialogAtomComponent } from './confirm-dialog-atom/confirm-dialog-atom.component';
import { SelectAtomComponent } from './select-atom/select-atom.component';

@NgModule({
  declarations: [
    FormInputAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent,
    SelectAtomComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormInputAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent,
    SelectAtomComponent
  ]
})
export class AtomsModule { }