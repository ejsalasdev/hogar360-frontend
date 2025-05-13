import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryPageComponent } from './category-page/category-page.component';
import { LocationPageComponent } from './location-page/location-page.component';

@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AtomsModule,
    HttpClientModule
  ],
  exports: [
    CategoryPageComponent,
    LocationPageComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PagesModule { }
