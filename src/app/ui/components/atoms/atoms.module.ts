import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastAtomComponent } from './toast-atom/toast-atom.component';
import { ConfirmDialogAtomComponent } from './confirm-dialog-atom/confirm-dialog-atom.component';
import { SelectAtomComponent } from './select-atom/select-atom.component';
import { ButtonAtomComponent } from './button-atom/button-atom.component';
import { InputAtomComponent } from './input-atom/input-atom.component';
import { TextareaAtomComponent } from './textarea-atom/textarea-atom.component';

@NgModule({
  declarations: [
    InputAtomComponent,
    TextareaAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent,
    SelectAtomComponent,
    ButtonAtomComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    InputAtomComponent,
    TextareaAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent,
    SelectAtomComponent,
    ButtonAtomComponent
  ]
})
export class AtomsModule { }