import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HouseResponse } from '../../../../core/models/house-response.model';
import { PageInfo } from '../../../../core/models/page-info.model';
import { CategoryService } from '../../../../core/services/category.service';
import { HouseService } from '../../../../core/services/house.service';
import { UbicationService } from '../../../../core/services/ubication.service';
import { HousePageComponent } from './house-page.component';

function maxOneMonthValidator(control: any): any {
  const value = control.value;
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return { invalidDate: true };

  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 1);

  if (selectedDate < today) {
    return { beforeToday: true };
  }
  if (selectedDate > maxDate) {
    return { maxOneMonth: true };
  }
  return null;
}

describe('HousePageComponent', () => {
  let component: HousePageComponent;
  let houseService: any;
  let categoryService: any;
  let ubicationService: any;
  let formBuilder: FormBuilder;

  const mockHouseService = {
    getHouses: jest.fn(),
    createHouse: jest.fn()
  };

  const mockCategoryService = {
    getCategories: jest.fn()
  };

  const mockUbicationService = {
    getUbications: jest.fn()
  };

  const mockHouses: HouseResponse[] = [
    {
      id: 1,
      name: 'Casa Prueba',
      description: 'Descripción de prueba',
      category: 'Apartamento',
      numberOfRooms: 3,
      numberOfBathrooms: 2,
      price: 300000000,
      address: 'Calle 123 # 45 67',
      ubication: 'Villa Antigua',
      city: 'Medellín',
      department: 'Antioquia',
      activePublicationDate: '2025-06-01',
      publicationStatus: 'ACTIVE',
      publicationDate: '2025-05-21',
      sellerId: 1
    }
  ];

  const mockPageInfo: PageInfo<HouseResponse> = {
    content: mockHouses,
    totalElements: 10,
    totalPages: 2,
    currentPage: 0,
    pageSize: 5,
    hasNext: true,
    hasPrevious: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: HouseService, useValue: mockHouseService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: UbicationService, useValue: mockUbicationService }
      ]
    });

    houseService = TestBed.inject(HouseService);
    categoryService = TestBed.inject(CategoryService);
    ubicationService = TestBed.inject(UbicationService);
    formBuilder = TestBed.inject(FormBuilder);

    const mockCategories = [{ id: 1, name: 'Apartamento' }];
    const mockUbications = [{ id: 1, cityName: 'Medellín', departmentName: 'Antioquia' }];
    
    mockHouseService.getHouses.mockReturnValue(of(mockPageInfo));
    mockCategoryService.getCategories.mockReturnValue(of(mockCategories));
    mockUbicationService.getUbications.mockReturnValue(of(mockUbications));
    
    component = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    component.houseForm = formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: [null, Validators.required],
      numberOfRooms: [null, Validators.required],
      numberOfBathrooms: [null, Validators.required],
      price: [null, Validators.required],
      ubicationId: [null, Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      activePublicationDate: ['', [Validators.required, maxOneMonthValidator]]
    });
    
    component.houses = mockHouses;
    component.pageInfo = mockPageInfo;
    component.categories = mockCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      value: cat.id,
      label: cat.name
    }));
    component.ubications = mockUbications.map((ubi: any) => ({
      id: ubi.id,
      cityName: ubi.cityName,
      departmentName: ubi.departmentName,
      value: ubi.id,
      label: `${ubi.cityName}, ${ubi.departmentName}`
    }));
    
    component.ngOnInit();
    
    mockHouseService.getHouses.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(0);
    expect(component.pageSize).toBe(5);
    expect(component.sort).toEqual({ key: 'id', direction: 'asc' });
    expect(component.searchText).toBe('');
  });

  it('should load houses on init', () => {
    component.ngOnInit();
    expect(houseService.getHouses).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      sortBy: 'id',
      orderAsc: true
    });
  });

  it('should load categories and ubications on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(ubicationService.getUbications).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
    expect(component.ubications.length).toBe(1);
  });

  it('should handle page changes', () => {
    mockHouseService.getHouses.mockClear();
    jest.spyOn(component, 'getHouses');
    component.onPageChange(1);
    expect(component.getHouses).toHaveBeenCalledWith(1);
  });

  it('should handle sort changes', () => {
    mockHouseService.getHouses.mockClear();
    component.onSortChange({ key: 'price', direction: 'desc' });
    expect(houseService.getHouses).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      sortBy: 'price',
      orderAsc: false
    });
  });

  it('should show toast message', () => {
    component['showToast']('Test message', 'success');
    expect(component.toastMessage).toBe('Test message');
    expect(component.toastType).toBe('success');
  });

  it('should clear toast message when closed', () => {
    component.toastMessage = 'Test message';
    component.onToastClosed();
    expect(component.toastMessage).toBeNull();
  });

  describe('Form Validation', () => {
    it('should validate name field', () => {
      const nameControl = component.houseForm.get('name');
      nameControl?.setValue('');
      expect(nameControl?.errors?.['required']).toBeTruthy();
      
      nameControl?.setValue('ab');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      
      nameControl?.setValue('Casa Nueva');
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate activePublicationDate field', () => {
      const dateControl = component.houseForm.get('activePublicationDate');
      
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      dateControl?.setValue(pastDate.toISOString().split('T')[0]);
      expect(dateControl?.errors?.['beforeToday']).toBeTruthy();
      
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      dateControl?.setValue(futureDate.toISOString().split('T')[0]);
      expect(dateControl?.errors?.['maxOneMonth']).toBeTruthy();
      
      const today = new Date();
      const validDate = today.toISOString().split('T')[0];
      dateControl?.setValue(validDate);
      expect(dateControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should submit valid form data', () => {
      mockHouseService.createHouse.mockReturnValue(of({ id: 1 }));
      
      component.houseForm.patchValue({
        name: 'Casa Nueva',
        description: 'Descripción de la casa nueva',
        categoryId: 1,
        numberOfRooms: 3,
        numberOfBathrooms: 2,
        price: 250000000,
        ubicationId: 1,
        address: 'Calle 123 # 45 67 Villa Nueva',
        activePublicationDate: '2025-06-01'
      });

      component.onFormSubmit();

      expect(houseService.createHouse).toHaveBeenCalled();
      expect(component.toastType).toBe('success');
    });

    it('should show error toast on submission failure', () => {
      mockHouseService.createHouse.mockReturnValue(
        throwError(() => new Error('Error creating house'))
      );
      
      component.houseForm.patchValue({
        name: 'Casa Nueva',
        description: 'Descripción de la casa nueva',
        categoryId: 1,
        numberOfRooms: 3,
        numberOfBathrooms: 2,
        price: 250000000,
        ubicationId: 1,
        address: 'Calle 123 # 45 67 Villa Nueva',
        activePublicationDate: '2025-06-01'
      });

      component.onFormSubmit();

      expect(component.toastType).toBe('error');
    });
  });
});