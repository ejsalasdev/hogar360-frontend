import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AtomsModule } from '../atoms/atoms.module';
import { HeaderMoleculeComponent } from './header-molecule/header-molecule.component';
import { SideMenuMoleculeComponent } from './side-menu-molecule/side-menu-molecule.component';
import { FormMoleculeComponent } from './form-molecule/form-molecule.component';
import { TableMoleculeComponent } from './table-molecule/table-molecule.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderMoleculeComponent, SideMenuMoleculeComponent, FormMoleculeComponent, TableMoleculeComponent],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule,
    FormsModule,
  ],
  exports: [HeaderMoleculeComponent, SideMenuMoleculeComponent, FormMoleculeComponent, TableMoleculeComponent],
})
export class MoleculesModule {}
