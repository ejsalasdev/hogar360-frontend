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
import { CategoryResponse } from '../../../../core/models/category-response.model';
import { PageInfo } from '../../../../core/models/page-info.model';

@Component({
  selector: 'pg-category',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnInit {
  categoryName: string = '';
  categoryDescription: string = '';
  toastMessage = '';
  toastType: ToastType = 'info';

  readonly maxLengthName: number = 50;
  readonly maxLengthDescription: number = 90;

  categories: CategoryResponse[] = [];
  pageInfo: PageInfo<CategoryResponse> | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  orderAsc: boolean = true;
  isLoading: boolean = false;

  @ViewChild('createCategoryForm') createCategoryForm!: NgForm;
  @ViewChild('descriptionInputRef') descriptionInput!: FormInputAtomComponent;

  showConfirmDialog: boolean = false;
  categoryToDelete: CategoryResponse | null = null;

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(page: number = this.currentPage): void {
    this.isLoading = true;
    this.categoryService
      .getCategories(page, this.pageSize, this.orderAsc)
      .subscribe({
        next: (data) => {
          this.pageInfo = data;
          this.categories = data.content;
          this.currentPage = data.currentPage;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.showError('Error al cargar las categorías.');
        },
      });
  }

  onPageChange(page: number): void {
    if (
      page !== this.currentPage &&
      this.pageInfo &&
      page >= 0 &&
      page < this.pageInfo.totalPages
    ) {
      this.getCategories(page);
    }
  }

  onSubmit(): void {
    if (this.createCategoryForm.valid) {
      const category: Category = {
        name: this.categoryName,
        description: this.categoryDescription,
      };

      this.categoryService.createCategory(category).subscribe({
        next: () => {
          this.showSuccess('La categoría se ha creado exitosamente.');
          this.resetForm();
          this.getCategories(0);
        },
        error: (error) => {
          if (error.status === 409) {
            this.showError('La categoría con este nombre ya existe.');
          } else {
            this.showError(
              'Error al crear la categoría. Por favor, inténtalo de nuevo.'
            );
          }
        },
      });
    }
  }

  private resetForm(): void {
    this.categoryName = '';
    this.categoryDescription = '';
    this.createCategoryForm.resetForm({
      name: '',
      description: '',
    });
    this.changeDetectorRef.markForCheck();
  }

  private showSuccess(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.changeDetectorRef.markForCheck();
  }

  private showError(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.changeDetectorRef.markForCheck();
  }

  onToastClosed(): void {
    this.toastMessage = '';
    this.changeDetectorRef.markForCheck();
  }

  shouldShowPatternError(control: any): boolean {
    return (
      control.invalid &&
      (control.dirty || control.touched) &&
      control.errors?.['pattern'] &&
      !control.errors?.['required'] &&
      !control.errors?.['minlength'] &&
      !control.errors?.['maxlength']
    );
  }

  getPaginationButtons(): (number | string)[] {
    if (!this.pageInfo) return [];
    const total = this.pageInfo.totalPages;
    const current = this.currentPage;
    const maxButtons = 5;
    const buttons: (number | string)[] = [];

    if (total <= maxButtons) {
      for (let i = 0; i < total; i++) {
        buttons.push(i);
      }
    } else {
      if (current <= 2) {
        for (let i = 0; i < maxButtons; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(total - 1);
      } else if (current >= total - 3) {
        buttons.push(0);
        buttons.push('...');
        for (let i = total - maxButtons; i < total; i++) buttons.push(i);
      } else {
        buttons.push(0);
        buttons.push('...');
        for (let i = current - 1; i <= current + 1; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(total - 1);
      }
    }
    return buttons;
  }

  handlePageButtonClick(btn: number | string): void {
    if (typeof btn === 'number') {
      this.onPageChange(btn);
    }
  }

  getPageNumber(btn: number | string): number | null {
    return typeof btn === 'number' ? btn + 1 : null;
  }

  toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.getCategories(0);
  }

  confirmDelete(category: CategoryResponse): void {
    this.categoryToDelete = category;
    this.showConfirmDialog = true;
    this.changeDetectorRef.markForCheck();
  }

  onConfirmDelete(): void {
    if (this.categoryToDelete) {
      this.deleteCategory(this.categoryToDelete.id);
      this.showConfirmDialog = false;
      this.categoryToDelete = null;
      this.changeDetectorRef.markForCheck();
    }
  }

  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.categoryToDelete = null;
    this.changeDetectorRef.markForCheck();
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        this.showSuccess(response.message);
        this.getCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.showError(error.error.message || 'Error al eliminar la categoría');
      }
    });
  }
}
