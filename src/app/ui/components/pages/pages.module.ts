import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryPageComponent } from './category-page/category-page.component';
import { LocationPageComponent } from './location-page/location-page.component';
import { MoleculesModule } from '../molecules/molecules.module';

@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    HttpClientModule,
    MoleculesModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryPageComponent,
    LocationPageComponent,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PagesModule { }
