import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AtomsModule } from '../atoms/atoms.module';
import { FormMoleculeComponent } from './form-molecule/form-molecule.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormMoleculeComponent],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule,
    FormsModule,
  ],
  exports: [FormMoleculeComponent],
})
export class MoleculesModule {}
