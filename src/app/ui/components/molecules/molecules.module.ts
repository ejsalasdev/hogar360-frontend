import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule para los enlaces del menú
import { AtomsModule } from '../atoms/atoms.module'; // Importa AtomsModule si las moléculas usan átomos
import { HeaderMoleculeComponent } from './header-molecule/header-molecule.component';
import { SideMenuMoleculeComponent } from './side-menu-molecule/side-menu-molecule.component';

@NgModule({
  declarations: [HeaderMoleculeComponent, SideMenuMoleculeComponent],
  imports: [
    CommonModule,
    RouterModule, // Necesario para [routerLink]
    AtomsModule, // Si tus moléculas usan átomos, impórtalo aquí
  ],
  exports: [HeaderMoleculeComponent, SideMenuMoleculeComponent],
})
export class MoleculesModule {}
