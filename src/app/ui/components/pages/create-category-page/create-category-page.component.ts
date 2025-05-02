import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  onSubmit(): void {
    this.errorMessage = null;
    const newCategory: Category = {
      name: this.categoryName,
      description: this.categoryDescription,
    };
    this.categoryService.createCategory(newCategory).subscribe({
      next: (response) => {
        console.log('Categoría creada exitosamente:', response);
        // Aquí podrías mostrar un mensaje de éxito o redirigir al usuario
      },
      error: (error) => {
        console.error('Error al crear la categoría:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage =
            'Error al crear la categoría. Por favor, inténtalo de nuevo.';
        }
      },
    });
  }
}
