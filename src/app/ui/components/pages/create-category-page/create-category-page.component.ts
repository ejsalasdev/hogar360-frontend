import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';
import { FormInputAtomComponent } from '../../atoms/form-input-atom/form-input-atom.component';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';

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
  toastType: ToastType = 'info';
  showToast = false;

  readonly maxLengthName: number = 50;
  readonly maxLengthDescription: number = 90;

  @ViewChild('createCategoryForm') createCategoryForm!: NgForm;
  @ViewChild('descriptionInputRef') descriptionInput!: FormInputAtomComponent;

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  showError(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    this.changeDetectorRef.detectChanges();
  }

  showSuccess(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    this.changeDetectorRef.detectChanges();
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
      next: () => {
        this.showSuccess('La categoría se ha creado exitosamente.');
        this.resetForm();
      },
      error: (error) => {
        if (error?.status === 409) {
          this.showError('La categoría con este nombre ya existe.');
        } else {
          this.showError('Error al crear la categoría. Por favor, inténtalo de nuevo.');
        }
      },
    });
  }

  private resetForm(): void {
    this.categoryName = '';
    this.categoryDescription = '';
    this.createCategoryForm.resetForm({
      name: '',
      description: ''
    });
  }

  shouldShowPatternError(control: any): boolean {
    if (!control.invalid || !control.dirty && !control.touched) {
      return false;
    }
    
    const hasMinLengthError = control.errors?.['minlength'];
    const hasPatternError = control.errors?.['pattern'];
    
    return hasPatternError && !hasMinLengthError;
  }
}
