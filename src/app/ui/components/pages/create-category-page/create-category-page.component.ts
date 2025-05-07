import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'pg-create-category',
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryPageComponent implements OnInit {
  categoryName: string = '';
  categoryDescription: string = '';
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  showToast = false;

  maxLengthName: number = 50;
  maxLengthDescription: number = 90;

  @ViewChild('createCategoryForm') createCategoryForm!: NgForm;

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  showError(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.changeDetectorRef.detectChanges();
    }, 3000);
  }

  showSuccess(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.changeDetectorRef.detectChanges();
    }, 3000);
  }

  onSubmit(): void {
    if (this.createCategoryForm.invalid) {
      return;
    }

    const newCategory: Category = {
      name: this.categoryName,
      description: this.categoryDescription,
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (response) => {
        this.showSuccess('La categoría se ha creado exitosamente.');
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        if (error?.status === 409) {
          this.showError('La categoría con este nombre ya existe.');
        } else if (error?.error?.message) {
          this.showError(error.error.message);
        } else {
          this.showError('Error al crear la categoría. Por favor, inténtalo de nuevo.');
        }
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
