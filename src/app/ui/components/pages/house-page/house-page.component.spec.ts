import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HouseResponse } from '../../../../core/models/house-response.model';
import { PageInfo } from '../../../../core/models/page-info.model';
import { CategoryService } from '../../../../core/services/category.service';
import { HouseService } from '../../../../core/services/house.service';
import { UbicationService } from '../../../../core/services/ubication.service';
import { HousePageComponent } from './house-page.component';

interface TestUbicationOption {
  id: number;
  cityName: string;
  departmentName: string;
  value: number;
  label: string;
  sector: string;
}

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
    const mockUbications = [{ id: 1, cityName: 'Medellín', departmentName: 'Antioquia', sector: 'Villa Antigua' }];
    
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
      label: `${ubi.sector}, ${ubi.cityName}, ${ubi.departmentName}`,
      sector: ubi.sector
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
  
  it('should update search text and get houses when searchControl value changes', () => {
    mockHouseService.getHouses.mockClear();
    
    component.searchText = 'test search';
    component.getHouses(0);
    
    expect(component.searchText).toBe('test search');
    expect(mockHouseService.getHouses).toHaveBeenCalled();
  });

  it('should update search text and get houses when searchControl valueChanges emits', () => {
    jest.mock('rxjs/operators', () => ({
      ...jest.requireActual('rxjs/operators'),
      debounceTime: jest.fn().mockImplementation(() => (source$: any) => source$),
      distinctUntilChanged: jest.fn().mockImplementation(() => (source$: any) => source$)
    }));
    
    component.searchControl = formBuilder.control('');
    
    jest.spyOn(component, 'getHouses');
    
    const pipeMock = jest.fn().mockReturnValue({
      subscribe: (callback: any) => {
        callback('test text from valueChanges');
        return { unsubscribe: jest.fn() };
      }
    });
    
    component.searchControl.valueChanges.pipe = pipeMock;
    
    component.ngOnInit();
    
    expect(pipeMock).toHaveBeenCalled();
    
    expect(component.searchText).toBe('test text from valueChanges');
    expect(component.getHouses).toHaveBeenCalledWith(0);
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

  it('should handle search text when getting houses', () => {
    component.searchText = 'test search';
    component.getHouses(0);
    expect(houseService.getHouses).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      sortBy: 'id',
      orderAsc: true,
      ubicationSearchText: 'test search'
    });
  });

  it('should load categories and ubications on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(ubicationService.getUbications).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
    expect(component.ubications.length).toBe(1);
  });

  it('should update houseFormFields options with categories and ubications', () => {
    const newComponent = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    newComponent.ngOnInit();
    
    const categoryField = newComponent.houseFormFields.find(f => f.name === 'categoryId');
    const ubicationField = newComponent.houseFormFields.find(f => f.name === 'ubicationId');
    
    expect(categoryField?.options).toBeDefined();
    expect(ubicationField?.options).toBeDefined();
    expect(categoryField?.options).toEqual(newComponent.categories);
    expect(ubicationField?.options).toEqual(newComponent.ubications);
  });

  it('should correctly map ubications with sector property', () => {
    expect((component.ubications[0] as TestUbicationOption).sector).toBe('Villa Antigua');
    
    const ubication = component.ubications[0] as TestUbicationOption;
    const expectedLabel = `${ubication.sector}, ${ubication.cityName}, ${ubication.departmentName}`;
    expect(ubication.label).toBe(expectedLabel);
    expect(ubication.label).toBe('Villa Antigua, Medellín, Antioquia');
    
    const sectorValue = 'Villa Antigua';
    expect(ubication.label.startsWith(sectorValue)).toBeTruthy();
    
    mockUbicationService.getUbications.mockClear();
    mockUbicationService.getUbications.mockReturnValue(of({
      content: [
        { id: 5, cityName: 'Test City', departmentName: 'Test Department', sector: 'Test Sector' }
      ]
    }));
    
    const testComponent = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    testComponent.ngOnInit();
    
    expect(testComponent.ubications[0].label).toBe('Test Sector, Test City, Test Department');
  });

  it('should handle mapping of ubications with different sector values', () => {
    const mockUbications = [
      { id: 1, cityName: 'Medellín', departmentName: 'Antioquia', sector: 'Villa Antigua' },
    ];
    
    const newComponent = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    mockUbicationService.getUbications.mockReturnValue(of({ content: mockUbications }));
    
    newComponent.ngOnInit();
    
    expect(newComponent.ubications[0].label).toBe('Villa Antigua, Medellín, Antioquia');
    
    expect(newComponent.ubications[1].label).toBe(', Bogotá, Cundinamarca');
    
    expect(newComponent.ubications[2].label).toBe('null, Cali, Valle del Cauca');
  });

  it('should show error toast when categories cannot be loaded', () => {
    mockCategoryService.getCategories.mockReturnValue(
      throwError(() => new Error('Error loading categories'))
    );
    
    const newComponent = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    newComponent.ngOnInit();
    
    expect(newComponent.toastType).toBe('error');
    expect(newComponent.toastMessage).toContain('Error al cargar las categorías');
  });

  it('should show error toast when ubications cannot be loaded', () => {
    mockUbicationService.getUbications.mockReturnValue(
      throwError(() => new Error('Error loading ubications'))
    );
    
    const newComponent = new HousePageComponent(
      houseService,
      categoryService,
      ubicationService,
      { markForCheck: jest.fn() } as any,
      formBuilder
    );
    
    newComponent.ngOnInit();
    
    expect(newComponent.toastType).toBe('error');
    expect(newComponent.toastMessage).toContain('Error al cargar las ubicaciones');
  });
  
  it('should show error toast when houses cannot be loaded', () => {
    mockHouseService.getHouses.mockReturnValue(
      throwError(() => new Error('Error loading houses'))
    );
    
    component.getHouses();
    
    expect(component.isLoading).toBe(false);
    expect(component.toastType).toBe('error');
    expect(component.toastMessage).toContain('Error al cargar las propiedades');
  });

  it('should handle page changes', () => {
    mockHouseService.getHouses.mockClear();
    jest.spyOn(component, 'getHouses');
    component.onPageChange(1);
    expect(component.getHouses).toHaveBeenCalledWith(1);
  });

  it('should not call getHouses if page is invalid or out of range', () => {
    mockHouseService.getHouses.mockClear();
    jest.spyOn(component, 'getHouses');
    
    component.currentPage = 0;
    component.onPageChange(0);
    expect(component.getHouses).not.toHaveBeenCalled();
    
    component.onPageChange(-1);
    expect(component.getHouses).not.toHaveBeenCalled();
    
    component.pageInfo = { ...mockPageInfo, totalPages: 2 };
    component.onPageChange(3);
    expect(component.getHouses).not.toHaveBeenCalled();
    
    component.pageInfo = null;
    component.onPageChange(1);
    expect(component.getHouses).not.toHaveBeenCalled();
  });

  it('should handle null pageInfo in onPageChange method', () => {
    mockHouseService.getHouses.mockClear();
    jest.spyOn(component, 'getHouses');
    
    component.pageInfo = null;
    
    component.onPageChange(1);
    
    expect(component.getHouses).not.toHaveBeenCalled();
    
    component.pageInfo = mockPageInfo;
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
      
      dateControl?.setValue(null);
      expect(dateControl?.errors?.['required']).toBeTruthy();
      expect(dateControl?.errors?.['invalidDate']).toBeFalsy();
      
      dateControl?.setValue('invalid-date');
      expect(dateControl?.errors?.['invalidDate']).toBeTruthy();
      
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

    it('should not submit when form is invalid', () => {
      mockHouseService.createHouse.mockClear();
      component.houseForm.patchValue({
        description: 'Descripción',
        categoryId: 1,
        numberOfRooms: 3,
        numberOfBathrooms: 2,
        price: 250000000,
        ubicationId: 1,
        address: 'Calle 123 # 45 67 Villa Nueva',
        activePublicationDate: '2025-06-01'
      });

      component.onFormSubmit();

      expect(houseService.createHouse).not.toHaveBeenCalled();
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

describe('maxOneMonthValidator', () => {
  it('should handle edge cases in date validation', () => {
    const control: any = { value: null };
    
    expect(maxOneMonthValidator(control)).toBeNull();
    
    control.value = '';
    expect(maxOneMonthValidator(control)).toBeNull();
    
    control.value = '2025';
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    control.value = '2025-05';
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    control.value = '2025-05-';
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    control.value = 'not-a-date';
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    control.value = today.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toBeNull();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    control.value = yesterday.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toEqual({ beforeToday: true });
    
    const oneMonthAhead = new Date(today);
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);
    control.value = oneMonthAhead.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toBeNull();
    
    const oneMonthOneDayAhead = new Date(today);
    oneMonthOneDayAhead.setMonth(oneMonthOneDayAhead.getMonth() + 1);
    oneMonthOneDayAhead.setDate(oneMonthOneDayAhead.getDate() + 1);
    control.value = oneMonthOneDayAhead.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toEqual({ maxOneMonth: true });
  });

  it('should validate dates with specific edge cases', () => {
    const control: any = { value: null };
    
    control.value = "";
    expect(maxOneMonthValidator(control)).toBeNull();
    
    control.value = "2025-";
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    control.value = "aaaa-bb-cc";
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    control.value = "2025-99-99";
    const result = maxOneMonthValidator(control);
    expect(result).not.toBeNull();
  });
  
  it('should test all branches of the maxOneMonthValidator', () => {
    const control: any = { value: null };
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    const today = new Date();
    const exactlyOneMonthAhead = new Date(today);
    exactlyOneMonthAhead.setMonth(exactlyOneMonthAhead.getMonth() + 1);
    exactlyOneMonthAhead.setHours(0, 0, 0, 0);
    control.value = exactlyOneMonthAhead.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toBeNull();
    
    const todayWithTime = new Date();
    todayWithTime.setHours(12, 30, 0, 0);
    control.value = todayWithTime.toISOString().split('T')[0];
    expect(maxOneMonthValidator(control)).toBeNull();
  });

  it('should properly validate each component of a date string', () => {
    const control: any = { value: null };
    
    expect(maxOneMonthValidator(control)).not.toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
    
    expect(maxOneMonthValidator(control)).toEqual({ invalidDate: true });
  });
});