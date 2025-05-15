import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
    ButtonAtomComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    InputAtomComponent,
    TextareaAtomComponent,
    ToastAtomComponent,
    ConfirmDialogAtomComponent,
    SelectAtomComponent,
    ButtonAtomComponent,
    ReactiveFormsModule,
  ],
})
export class AtomsModule {}
