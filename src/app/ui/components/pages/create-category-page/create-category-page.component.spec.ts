import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryService } from '../../../../core/services/category.service';
import { AtomsModule } from '../../atoms/atoms.module';
import { CreateCategoryPageComponent } from './create-category-page.component';

describe('CreateCategoryPageComponent', () => {
  let component: CreateCategoryPageComponent;
  let fixture: ComponentFixture<CreateCategoryPageComponent>;
  let categoryService: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCategoryPageComponent],
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
    fixture = TestBed.createComponent(CreateCategoryPageComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
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
    const submitButton = fixture.debugElement.query(By.css('.create-category__button'));
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
});