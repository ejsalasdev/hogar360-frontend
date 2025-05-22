import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryResponse } from '../../../../core/models/category-response.model';
import { Category } from '../../../../core/models/category.model';
import { PageInfo } from '../../../../core/models/page-info.model';
import { CategoryService } from '../../../../core/services/category.service';
import { RoleService } from '../../../../core/services/role.service';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';

@Component({
  selector: 'pg-category',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnInit {
  toastMessage = '';
  toastType: ToastType = 'info';
  categories: CategoryResponse[] = [];
  pageInfo: PageInfo<CategoryResponse> | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  orderAsc: boolean = true;
  sort: { key: string; direction: 'asc' | 'desc' } = {
    key: 'name',
    direction: 'asc',
  };
  isLoading: boolean = false;
  showConfirmDialog: boolean = false;
  categoryToDelete: CategoryResponse | null = null;
  isAdmin: boolean = false;

  categoryForm: FormGroup;

  categoryFormFields = [
    {
      name: 'name',
      label: 'Nombre de la Categoría',
      type: 'input',
      required: true,
      minlength: 5,
      maxlength: 50,
      placeholder: 'Escribe el nombre de la categoría (máximo 50 caracteres)',
      patternError: 'El nombre solo puede contener letras y espacios',
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      minlength: 10,
      maxlength: 90,
      placeholder: 'Escribe la descripción de la categoría (máximo 90 caracteres)',
      patternError: 'La descripción solo puede contener letras y espacios',
    },
  ];

  categoryTableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción' },
  ];
  
  get tableActions() {
    // Solo mostrar acciones de eliminación para administradores
    return this.isAdmin ? [{ type: 'delete', icon: 'delete', tooltip: 'Eliminar' }] : [];
  }

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private roleService: RoleService
  ) {
    this.categoryForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑs ]+$'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(90),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑs ]+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario es administrador
    this.isAdmin = this.roleService.hasRole('ADMIN');
    
    // Cargar la lista de categorías
    this.getCategories();
  }

  getCategories(page: number = this.currentPage): void {
    this.isLoading = true;
    this.categoryService
      .getCategories(page, this.pageSize, this.sort.direction === 'asc')
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

  onFormSubmit(): void {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
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
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  private resetForm(): void {
    this.categoryForm.reset({ name: '', description: '' });
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
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
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
      },
    });
  }

  onTableAction(event: any): void {
    if (event.type === 'delete') {
      this.confirmDelete(event.row);
    }
  }

  onSortChange(sort: { key: string; direction: 'asc' | 'desc' }) {
    this.sort = sort;
    this.getCategories(0);
  }
}
