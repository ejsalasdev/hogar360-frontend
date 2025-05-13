import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryPageComponent } from './category-page/category-page.component';

@NgModule({
  declarations: [CategoryPageComponent],
  imports: [CommonModule, FormsModule, AtomsModule, HttpClientModule],
  exports: [
    CategoryPageComponent,
  ],
})
export class PagesModule {}
