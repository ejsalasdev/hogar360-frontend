import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CreateCategoryPageComponent } from './create-category-page/create-category-page.component';

@NgModule({
  declarations: [CreateCategoryPageComponent],
  imports: [CommonModule, FormsModule, AtomsModule, HttpClientModule],
  exports: [
    CreateCategoryPageComponent,
  ],
})
export class PagesModule {}
