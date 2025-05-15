import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderOrganismComponent } from './header-organism/header-organism.component';
import { SideMenuOrganismComponent } from './side-menu-organism/side-menu-organism.component';
import { TableOrganismComponent } from './table-organism/table-organism.component';

@NgModule({
  declarations: [
    HeaderOrganismComponent,
    SideMenuOrganismComponent,
    TableOrganismComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderOrganismComponent,
    SideMenuOrganismComponent,
    TableOrganismComponent
  ]
})
export class OrganismsModule {} 