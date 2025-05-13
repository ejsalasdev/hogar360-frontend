import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryService } from '../../../../core/services/category.service';
import { AtomsModule } from '../../atoms/atoms.module';
import { CategoryPageComponent } from './category-page.component';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;
  let categoryService: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryPageComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        AtomsModule
      ],
      providers: [CategoryService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/api/v1/category/read'))
      .flush({ content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 5, hasNext: false, hasPrevious: false });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    expect(component.categoryName).toBe('');
    expect(component.categoryDescription).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.createCategoryForm;
    expect(form.valid).toBeFalsy();

    const nameInput = form.controls['name'];
    const descriptionInput = form.controls['description'];

    expect(nameInput.valid).toBeFalsy();
    expect(descriptionInput.valid).toBeFalsy();

    expect(nameInput.errors?.['required']).toBeTruthy();
    expect(descriptionInput.errors?.['required']).toBeTruthy();
  });

  it('should validate name length constraints', () => {
    const form = component.createCategoryForm;
    const nameInput = form.controls['name'];

    nameInput.setValue('abc');
    expect(nameInput.errors?.['minlength']).toBeTruthy();

    nameInput.setValue('a'.repeat(51));
    expect(nameInput.errors?.['maxlength']).toBeTruthy();

    nameInput.setValue('Valid Name');
    expect(nameInput.errors?.['minlength']).toBeFalsy();
    expect(nameInput.errors?.['maxlength']).toBeFalsy();
  });

  it('should validate character pattern', () => {
    const form = component.createCategoryForm;
    const nameInput = form.controls['name'];
    const descriptionInput = form.controls['description'];

    nameInput.setValue('Invalid123');
    descriptionInput.setValue('Invalid@#$');

    expect(nameInput.errors?.['pattern']).toBeTruthy();
    expect(descriptionInput.errors?.['pattern']).toBeTruthy();

    nameInput.setValue('Valid Name áéíóú');
    descriptionInput.setValue('Valid Description ñÑ');

    expect(nameInput.errors?.['pattern']).toBeFalsy();
    expect(descriptionInput.errors?.['pattern']).toBeFalsy();
  });

  it('should create category successfully', fakeAsync(() => {
    const testCategory = {
      name: 'Test Category',
      description: 'Test Description'
    };

    const form = component.createCategoryForm;
    form.controls['name'].setValue(testCategory.name);
    form.controls['description'].setValue(testCategory.description);
    form.controls['name'].setErrors(null);
    form.controls['description'].setErrors(null);

    component.categoryName = testCategory.name;
    component.categoryDescription = testCategory.description;
    fixture.detectChanges();

    component.onSubmit();
    tick();
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8081/api/v1/category/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testCategory);

    req.flush({ message: 'Category created successfully' });

    httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/api/v1/category/read'))
      .flush({ content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 5, hasNext: false, hasPrevious: false });

    tick();
    fixture.detectChanges();

    expect(component.toastMessage).toBe('La categoría se ha creado exitosamente.');
    expect(component.toastType).toBe('success');

    tick(3000);
    fixture.detectChanges();

    expect(component.categoryName).toBe('');
    expect(component.categoryDescription).toBe('');
    expect(component.toastMessage).toBe('');

    discardPeriodicTasks();
  }));

  it('should handle duplicate category error', fakeAsync(() => {
    const testCategory = {
      name: 'Existing Category',
      description: 'Test Description'
    };

    const form = component.createCategoryForm;
    form.controls['name'].setValue(testCategory.name);
    form.controls['description'].setValue(testCategory.description);
    form.controls['name'].setErrors(null);
    form.controls['description'].setErrors(null);

    component.categoryName = testCategory.name;
    component.categoryDescription = testCategory.description;
    fixture.detectChanges();

    component.onSubmit();
    tick();
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8081/api/v1/category/create');
    req.flush(
      { message: 'Category already exists' },
      { status: 409, statusText: 'Conflict' }
    );
    tick();
    fixture.detectChanges();

    expect(component.toastMessage).toBe('La categoría con este nombre ya existe.');
    expect(component.toastType).toBe('error');

    tick(3000);
    fixture.detectChanges();
    expect(component.toastMessage).toBe('');

    discardPeriodicTasks();
  }));

  it('should handle server error', fakeAsync(() => {
    const testCategory = {
      name: 'Test Category',
      description: 'Test Description'
    };

    const form = component.createCategoryForm;
    form.controls['name'].setValue(testCategory.name);
    form.controls['description'].setValue(testCategory.description);
    form.controls['name'].setErrors(null);
    form.controls['description'].setErrors(null);

    component.categoryName = testCategory.name;
    component.categoryDescription = testCategory.description;
    fixture.detectChanges();

    component.onSubmit();
    tick();
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8081/api/v1/category/create');
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );
    tick();
    fixture.detectChanges();

    expect(component.toastMessage).toBe('Error al crear la categoría. Por favor, inténtalo de nuevo.');
    expect(component.toastType).toBe('error');

    tick(3000);
    fixture.detectChanges();
    expect(component.toastMessage).toBe('');

    discardPeriodicTasks();
  }));

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('.category__button'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();

    const form = component.createCategoryForm;
    form.controls['name'].setValue('Valid Name');
    form.controls['description'].setValue('Valid Description');
    form.controls['name'].setErrors(null);
    form.controls['description'].setErrors(null);

    component.categoryName = 'Valid Name';
    component.categoryDescription = 'Valid Description';
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should not submit form when invalid', () => {
    const createCategorySpy = jest.spyOn(categoryService, 'createCategory');

    const form = component.createCategoryForm;
    form.controls['name'].setValue('');
    form.controls['description'].setValue('');
    expect(form.invalid).toBeTruthy();

    component.onSubmit();

    expect(createCategorySpy).not.toHaveBeenCalled();
  });

  describe('Pagination', () => {
    it('should get pagination buttons for small number of pages', () => {
      component.pageInfo = {
        content: [],
        totalElements: 10,
        totalPages: 3,
        currentPage: 0,
        pageSize: 5,
        hasNext: true,
        hasPrevious: false
      };
      component.currentPage = 0;

      const buttons = component.getPaginationButtons();
      expect(buttons).toEqual([0, 1, 2]);
    });

    it('should get pagination buttons for current page near start', () => {
      component.pageInfo = {
        content: [],
        totalElements: 50,
        totalPages: 10,
        currentPage: 1,
        pageSize: 5,
        hasNext: true,
        hasPrevious: true
      };
      component.currentPage = 1;

      const buttons = component.getPaginationButtons();
      expect(buttons).toEqual([0, 1, 2, 3, 4, '...', 9]);
    });

    it('should get pagination buttons for current page near end', () => {
      component.pageInfo = {
        content: [],
        totalElements: 50,
        totalPages: 10,
        currentPage: 8,
        pageSize: 5,
        hasNext: true,
        hasPrevious: true
      };
      component.currentPage = 8;

      const buttons = component.getPaginationButtons();
      expect(buttons).toEqual([0, '...', 5, 6, 7, 8, 9]);
    });

    it('should get pagination buttons for current page in middle', () => {
      component.pageInfo = {
        content: [],
        totalElements: 50,
        totalPages: 10,
        currentPage: 5,
        pageSize: 5,
        hasNext: true,
        hasPrevious: true
      };
      component.currentPage = 5;

      const buttons = component.getPaginationButtons();
      expect(buttons).toEqual([0, '...', 4, 5, 6, '...', 9]);
    });

    it('should handle page button click', fakeAsync(() => {
      component.pageInfo = {
        content: [],
        totalElements: 10,
        totalPages: 3,
        currentPage: 0,
        pageSize: 5,
        hasNext: true,
        hasPrevious: false
      };
      component.currentPage = 0;
      const getCategoriesSpy = jest.spyOn(component, 'getCategories');
      component.handlePageButtonClick(2);
      httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/api/v1/category/read') && req.params.get('page') === '2')
        .flush({ content: [], totalElements: 0, totalPages: 0, currentPage: 2, pageSize: 5, hasNext: false, hasPrevious: false });
      expect(getCategoriesSpy).toHaveBeenCalledWith(2);
    }));

    it('should not handle page button click for non-number', () => {
      const getCategoriesSpy = jest.spyOn(component, 'getCategories');
      component.handlePageButtonClick('...');
      expect(getCategoriesSpy).not.toHaveBeenCalled();
    });

    it('should get page number for number button', () => {
      expect(component.getPageNumber(2)).toBe(3);
    });

    it('should return null for non-number button', () => {
      expect(component.getPageNumber('...')).toBeNull();
    });

    it('should change page when valid', fakeAsync(() => {
      component.pageInfo = {
        content: [],
        totalElements: 10,
        totalPages: 3,
        currentPage: 0,
        pageSize: 5,
        hasNext: true,
        hasPrevious: false
      };
      component.currentPage = 0;
      const getCategoriesSpy = jest.spyOn(component, 'getCategories').mockImplementation(() => {
        // Simula la petición HTTP y su respuesta
        component.isLoading = false;
      });
      component.onPageChange(1);
      expect(getCategoriesSpy).toHaveBeenCalledWith(1);
    }));

    it('should not change page when invalid', fakeAsync(() => {
      component.pageInfo = {
        content: [],
        totalElements: 10,
        totalPages: 3,
        currentPage: 0,
        pageSize: 5,
        hasNext: true,
        hasPrevious: false
      };
      component.currentPage = 0;

      const getCategoriesSpy = jest.spyOn(component, 'getCategories');
      component.onPageChange(3); // Invalid page
      expect(getCategoriesSpy).not.toHaveBeenCalled();
    }));
  });

  describe('Sorting', () => {
    it('should toggle order and refresh categories', fakeAsync(() => {
      const getCategoriesSpy = jest.spyOn(component, 'getCategories').mockImplementation(() => {
        // Simula la petición HTTP y su respuesta
        component.isLoading = false;
      });
      component.toggleOrder();
      expect(component.orderAsc).toBeFalsy();
      expect(getCategoriesSpy).toHaveBeenCalledWith(0);
    }));
  });

  describe('Error Handling', () => {
    it('should handle error when loading categories', fakeAsync(() => {
      component.getCategories();
      tick();
      fixture.detectChanges();

      const req = httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/api/v1/category/read'));
      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' }
      );
      tick();
      fixture.detectChanges();

      expect(component.toastMessage).toBe('Error al cargar las categorías.');
      expect(component.toastType).toBe('error');
      expect(component.isLoading).toBeFalsy();

      tick(3000);
      fixture.detectChanges();
      expect(component.toastMessage).toBe('');

      discardPeriodicTasks();
    }));
  });

  it('should show confirm dialog when confirmDelete is called', () => {
    const testCategory = { id: 1, name: 'Test Category', description: 'Test Description' };
    component.confirmDelete(testCategory);
    expect(component.showConfirmDialog).toBeTruthy();
    expect(component.categoryToDelete).toEqual(testCategory);
  });

  it('should handle category deletion successfully', fakeAsync(() => {
    const testCategory = { id: 1, name: 'Test Category', description: 'Test Description' };
    component.categoryToDelete = testCategory;
    
    component.onConfirmDelete();
    tick();
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:8081/api/v1/category/${testCategory.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Category deleted successfully' });

    httpMock.expectOne(req => req.method === 'GET' && req.url.includes('/api/v1/category/read'))
      .flush({ content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: 5, hasNext: false, hasPrevious: false });

    tick();
    fixture.detectChanges();

    expect(component.showConfirmDialog).toBeFalsy();
    expect(component.categoryToDelete).toBeNull();
    expect(component.toastMessage).toBe('Category deleted successfully');
    expect(component.toastType).toBe('success');

    tick(3000);
    fixture.detectChanges();
    expect(component.toastMessage).toBe('');

    discardPeriodicTasks();
  }));

  it('should handle category deletion error', fakeAsync(() => {
    const testCategory = { id: 1, name: 'Test Category', description: 'Test Description' };
    component.categoryToDelete = testCategory;
    
    component.onConfirmDelete();
    tick();
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:8081/api/v1/category/${testCategory.id}`);
    req.flush(
      { message: 'Error deleting category' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    tick();
    fixture.detectChanges();

    expect(component.showConfirmDialog).toBeFalsy();
    expect(component.categoryToDelete).toBeNull();
    expect(component.toastMessage).toBe('Error deleting category');
    expect(component.toastType).toBe('error');

    tick(3000);
    fixture.detectChanges();
    expect(component.toastMessage).toBe('');

    discardPeriodicTasks();
  }));

  it('should close dialog when canceling deletion', () => {
    const testCategory = { id: 1, name: 'Test Category', description: 'Test Description' };
    component.categoryToDelete = testCategory;
    component.showConfirmDialog = true;
    
    component.onCancelDelete();
    fixture.detectChanges();

    expect(component.showConfirmDialog).toBeFalsy();
    expect(component.categoryToDelete).toBeNull();
  });
}); 