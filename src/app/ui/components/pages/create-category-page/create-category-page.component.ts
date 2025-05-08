import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  NgZone
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';
import { FormInputAtomComponent } from '../../atoms/form-input-atom/form-input-atom.component';

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
  @ViewChild('descriptionInputRef') descriptionInput!: FormInputAtomComponent;

  private toastTimeout?: number;

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {}

  private clearToastTimeout() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = undefined;
    }
  }

  showError(message: string) {
    this.clearToastTimeout();
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    this.changeDetectorRef.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      this.toastTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.showToast = false;
          this.changeDetectorRef.detectChanges();
        });
      }, 3000);
    });
  }

  showSuccess(message: string) {
    this.clearToastTimeout();
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    this.changeDetectorRef.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      this.toastTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.showToast = false;
          this.changeDetectorRef.detectChanges();
        });
      }, 3000);
    });
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
}
