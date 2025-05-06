import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'pg-create-category',
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryPageComponent implements OnInit {
  categoryName: string = '';
  categoryDescription: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  maxLengthName: number = 50; // Define la longitud máxima para el nombre
  maxLengthDescription: number = 90; // Define la longitud máxima para la descripción

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    const newCategory: Category = {
      name: this.categoryName,
      description: this.categoryDescription,
    };
    this.categoryService.createCategory(newCategory).subscribe({
      next: (response) => {
        console.log('Categoría creada exitosamente:', response);
        this.successMessage = 'La categoría se ha creado exitosamente.'; // Asignar mensaje de éxito
        this.changeDetectorRef.detectChanges(); // Forzar la detección de cambios
      },
      error: (error) => {
        console.error('Error al crear la categoría:', error);
        if (error?.status === 409) {
          this.errorMessage = 'La categoría con este nombre ya existe.';
        } else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage =
            'Error al crear la categoría. Por favor, inténtalo de nuevo.';
        }
        this.changeDetectorRef.detectChanges(); // Forzar la detección de cambios
      },
    });
  }
}
