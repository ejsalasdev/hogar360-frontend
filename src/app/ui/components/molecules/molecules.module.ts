import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AtomsModule } from '../atoms/atoms.module';
import { HeaderMoleculeComponent } from './header-molecule/header-molecule.component';
import { SideMenuMoleculeComponent } from './side-menu-molecule/side-menu-molecule.component';

@NgModule({
  declarations: [HeaderMoleculeComponent, SideMenuMoleculeComponent],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule,
  ],
  exports: [HeaderMoleculeComponent, SideMenuMoleculeComponent],
})
export class MoleculesModule {}
