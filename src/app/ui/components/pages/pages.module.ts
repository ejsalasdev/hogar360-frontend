import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { AtomsModule } from '../atoms/atoms.module'; // Importa AtomsModule para usar atm-form-input
import { CreateCategoryPageComponent } from './create-category-page/create-category-page.component';

@NgModule({
  declarations: [CreateCategoryPageComponent],
  imports: [CommonModule, FormsModule, AtomsModule, HttpClientModule],
  exports: [
    CreateCategoryPageComponent, // Si planeas usar esta página en otros módulos (raro)
  ],
})
export class PagesModule {}
