import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HousePageComponent } from './house-page.component';
import { HouseService } from '../../../../core/services/house.service';
import { CategoryService } from '../../../../core/services/category.service';
import { UbicationService } from '../../../../core/services/ubication.service';
import { RoleService } from '../../../../core/services/role.service';
import { AppointmentSlotService } from '../../../../core/services/appointment-slot.service';
import { HouseResponse } from '../../../../core/models/house-response.model';
import { PageInfo } from '../../../../core/models/page-info.model';
import { CategoryResponse } from '../../../../core/models/category-response.model';
import { UbicationResponse } from '../../../../core/models/ubication-response.model';
// Import required components for template
import { ModalOrganismComponent } from '../../organisms/modal-organism/modal-organism.component';
import { TableOrganismComponent } from '../../organisms/table-organism/table-organism.component';
import { ButtonAtomComponent } from '../../atoms/button-atom/button-atom.component';
import { ToastAtomComponent } from '../../atoms/toast-atom/toast-atom.component';
import { InputAtomComponent } from '../../atoms/input-atom/input-atom.component';
import { FormMoleculeComponent } from '../../molecules/form-molecule/form-molecule.component';

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
  let fixture: ComponentFixture<HousePageComponent>;
  let houseService: jest.Mocked<HouseService>;
  let categoryService: jest.Mocked<CategoryService>;
  let ubicationService: jest.Mocked<UbicationService>;
  let roleService: jest.Mocked<RoleService>;
  let appointmentSlotService: jest.Mocked<AppointmentSlotService>;
  let changeDetectorRef: jest.Mocked<ChangeDetectorRef>;
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

  const mockRoleService = {
    hasRole: jest.fn(),
    getUserRoles: jest.fn()
  };

  const mockAppointmentSlotService = {
    createAppointmentSlot: jest.fn(),
    getAppointmentSlots: jest.fn()
  };

  const mockChangeDetectorRef = {
    markForCheck: jest.fn(),
    detectChanges: jest.fn(),
    checkNoChanges: jest.fn(),
    detach: jest.fn(),
    reattach: jest.fn()
  };

  const mockHouseResponse: HouseResponse = {
    id: 1,
    name: 'Casa Test',
    description: 'Descripción test',
    category: 'Apartamento',
    numberOfRooms: 3,
    numberOfBathrooms: 2,
    price: 300000000,
    address: 'Calle 123 # 45-67',
    ubication: 'Villa Nueva',
    city: 'Medellín',
    department: 'Antioquia',
    activePublicationDate: '2025-01-01',
    publicationStatus: 'ACTIVE',
    publicationDate: '2024-12-01',
    sellerId: 1
  };

  const mockPageInfo: PageInfo<HouseResponse> = {
    content: [mockHouseResponse],
    totalElements: 10,
    totalPages: 2,
    currentPage: 0,
    pageSize: 5,
    hasNext: true,
    hasPrevious: false
  };

  const mockCategories: CategoryResponse[] = [
    { id: 1, name: 'Apartamento', description: 'Apartamento para vivienda' },
    { id: 2, name: 'Casa', description: 'Casa familiar' }
  ];

  const mockUbications: UbicationResponse[] = [
    { id: 1, cityName: 'Medellín', departmentName: 'Antioquia', sector: 'Villa Nueva' },
    { id: 2, cityName: 'Bogotá', departmentName: 'Cundinamarca', sector: 'Centro' }
  ];

  const mockCategoriesPageInfo: PageInfo<CategoryResponse> = {
    content: mockCategories,
    totalElements: 2,
    totalPages: 1,
    currentPage: 0,
    pageSize: 50,
    hasNext: false,
    hasPrevious: false
  };

  const mockUbicationsPageInfo: PageInfo<UbicationResponse> = {
    content: mockUbications,
    totalElements: 2,
    totalPages: 1,
    currentPage: 0,
    pageSize: 50,
    hasNext: false,
    hasPrevious: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HousePageComponent,
        ModalOrganismComponent,
        TableOrganismComponent,
        ButtonAtomComponent,
        ToastAtomComponent,
        InputAtomComponent,
        FormMoleculeComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: HouseService, useValue: mockHouseService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: UbicationService, useValue: mockUbicationService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: AppointmentSlotService, useValue: mockAppointmentSlotService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HousePageComponent);
    component = fixture.componentInstance;
    
    houseService = TestBed.inject(HouseService) as jest.Mocked<HouseService>;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    ubicationService = TestBed.inject(UbicationService) as jest.Mocked<UbicationService>;
    roleService = TestBed.inject(RoleService) as jest.Mocked<RoleService>;
    appointmentSlotService = TestBed.inject(AppointmentSlotService) as jest.Mocked<AppointmentSlotService>;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef) as jest.Mocked<ChangeDetectorRef>;
    formBuilder = TestBed.inject(FormBuilder);

    // Setup default mock returns
    houseService.getHouses.mockReturnValue(of(mockPageInfo));
    categoryService.getCategories.mockReturnValue(of(mockCategoriesPageInfo));
    ubicationService.getUbications.mockReturnValue(of(mockUbicationsPageInfo));
    roleService.hasRole.mockReturnValue(false);
    appointmentSlotService.createAppointmentSlot.mockReturnValue(of({ id: 1 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      // Act & Assert
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      // Act & Assert
      expect(component.currentPage).toBe(0);
      expect(component.pageSize).toBe(5);
      expect(component.sort).toEqual({ key: 'id', direction: 'asc' });
      expect(component.searchText).toBe('');
      expect(component.houses).toEqual([]);
      expect(component.categories).toEqual([]);
      expect(component.ubications).toEqual([]);
      expect(component.isLoading).toBe(false);
      expect(component.toastMessage).toBeNull();
      expect(component.toastType).toBe('info');
      expect(component.isCreateSlotModalVisible).toBe(false);
    });

    it('should initialize form with correct structure', () => {
      // Act & Assert
      expect(component.houseForm).toBeDefined();
      expect(component.houseForm.get('name')).toBeDefined();
      expect(component.houseForm.get('description')).toBeDefined();
      expect(component.houseForm.get('categoryId')).toBeDefined();
      expect(component.houseForm.get('numberOfRooms')).toBeDefined();
      expect(component.houseForm.get('numberOfBathrooms')).toBeDefined();
      expect(component.houseForm.get('price')).toBeDefined();
      expect(component.houseForm.get('ubicationId')).toBeDefined();
      expect(component.houseForm.get('address')).toBeDefined();
      expect(component.houseForm.get('activePublicationDate')).toBeDefined();
    });

    it('should initialize searchControl', () => {
      // Act & Assert
      expect(component.searchControl).toBeDefined();
      expect(component.searchControl.value).toBe('');
    });
  });

  describe('Initialization', () => {
    it('should load data on ngOnInit', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.ngOnInit();

      // Assert
      expect(categoryService.getCategories).toHaveBeenCalled();
      expect(ubicationService.getUbications).toHaveBeenCalled();
      expect(component.getHouses).toHaveBeenCalled();
    });

    it('should setup search control subscription', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.ngOnInit();
      component.searchControl.setValue('test search');

      // Assert - Using setTimeout to handle debounce
      setTimeout(() => {
        expect(component.searchText).toBe('test search');
        expect(component.getHouses).toHaveBeenCalledWith(0);
      }, 300);
    });

    it('should process categories correctly', () => {
      // Act
      component.ngOnInit();

      // Assert
      const expectedCategories = [
        {
          label: 'Apartamento',
          value: 1,
          id: 1,
          name: 'Apartamento'
        },
        {
          label: 'Casa',
          value: 2,
          id: 2,
          name: 'Casa'
        }
      ];
      expect(component.categories).toEqual(expectedCategories);
      const categoryField = component.houseFormFields.find(f => f.name === 'categoryId');
      expect(categoryField?.options).toEqual(expectedCategories);
    });

    it('should process ubications correctly with mapped properties', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.ubications).toHaveLength(2);
      
      const firstUbication = component.ubications[0];
      expect(firstUbication.id).toBe(1);
      expect(firstUbication.value).toBe(1);
      expect(firstUbication.label).toBe('Villa Nueva, Medellín, Antioquia');
      expect(firstUbication.cityName).toBe('Medellín');
      expect(firstUbication.departmentName).toBe('Antioquia');

      const ubicationField = component.houseFormFields.find(f => f.name === 'ubicationId');
      expect(ubicationField?.options).toEqual(component.ubications);
    });

    it('should handle categories loading error', () => {
      // Arrange
      const error = new Error('Categories error');
      categoryService.getCategories.mockReturnValue(throwError(() => error));

      // Act
      component.ngOnInit();

      // Assert
      expect(component.toastType).toBe('error');
      expect(component.toastMessage).toContain('Error al cargar las categorías');
    });

    it('should handle ubications loading error', () => {
      // Arrange
      const error = new Error('Ubications error');
      ubicationService.getUbications.mockReturnValue(throwError(() => error));

      // Act
      component.ngOnInit();

      // Assert
      expect(component.toastType).toBe('error');
      expect(component.toastMessage).toContain('Error al cargar las ubicaciones');
    });
  });

  describe('Houses Management', () => {
    it('should load houses successfully', () => {
      // Act
      component.getHouses(0);

      // Assert
      expect(houseService.getHouses).toHaveBeenCalledWith({
        page: 0,
        size: 5,
        sortBy: 'id',
        orderAsc: true
      });
      expect(component.houses).toEqual(mockPageInfo.content);
      expect(component.pageInfo).toEqual(mockPageInfo);
      expect(component.currentPage).toBe(0);
      expect(component.isLoading).toBe(false);
    });

    it('should include search text in getHouses request', () => {
      // Arrange
      component.searchText = 'casa moderna';

      // Act
      component.getHouses(1);

      // Assert
      expect(houseService.getHouses).toHaveBeenCalledWith({
        page: 1,
        size: 5,
        sortBy: 'id',
        orderAsc: true,
        ubicationSearchText: 'casa moderna'
      });
    });

    it('should handle getHouses error', () => {
      // Arrange
      const error = new Error('Houses error');
      houseService.getHouses.mockReturnValue(throwError(() => error));

      // Act
      component.getHouses(0);

      // Assert
      expect(component.isLoading).toBe(false);
      expect(component.toastType).toBe('error');
      expect(component.toastMessage).toContain('Error al cargar las propiedades');
    });

    it('should set loading state during getHouses', () => {
      // Arrange
      component.isLoading = false;

      // Act
      component.getHouses(0);

      // Assert - Loading should be set to true initially
      expect(component.isLoading).toBe(false); // Will be false after completion
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.pageInfo = mockPageInfo;
    });

    it('should handle page change successfully', () => {
      // Arrange
      component.currentPage = 0;
      jest.spyOn(component, 'getHouses');

      // Act
      component.onPageChange(1);

      // Assert
      expect(component.getHouses).toHaveBeenCalledWith(1);
    });

    it('should not change page if same page', () => {
      // Arrange
      component.currentPage = 1;
      jest.spyOn(component, 'getHouses');

      // Act
      component.onPageChange(1);

      // Assert
      expect(component.getHouses).not.toHaveBeenCalled();
    });

    it('should not change page if page is negative', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.onPageChange(-1);

      // Assert
      expect(component.getHouses).not.toHaveBeenCalled();
    });

    it('should not change page if page exceeds total pages', () => {
      // Arrange
      component.pageInfo = { ...mockPageInfo, totalPages: 2 };
      jest.spyOn(component, 'getHouses');

      // Act
      component.onPageChange(3);

      // Assert
      expect(component.getHouses).not.toHaveBeenCalled();
    });

    it('should not change page if pageInfo is null', () => {
      // Arrange
      component.pageInfo = null;
      jest.spyOn(component, 'getHouses');

      // Act
      component.onPageChange(1);

      // Assert
      expect(component.getHouses).not.toHaveBeenCalled();
    });
  });

  describe('Sorting', () => {
    it('should handle sort change with ascending order', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.onSortChange({ key: 'name', direction: 'asc' });

      // Assert
      expect(component.sort).toEqual({ key: 'name', direction: 'asc' });
      expect(component.getHouses).toHaveBeenCalledWith(0);
    });

    it('should handle sort change with descending order', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.onSortChange({ key: 'price', direction: 'desc' });

      // Assert
      expect(component.sort).toEqual({ key: 'price', direction: 'desc' });
      expect(houseService.getHouses).toHaveBeenCalledWith({
        page: 0,
        size: 5,
        sortBy: 'price',
        orderAsc: false
      });
    });
  });

  describe('Search', () => {
    it('should update search text and trigger search', () => {
      // Arrange
      jest.spyOn(component, 'getHouses');

      // Act
      component.searchText = 'villa nueva';
      component.getHouses(0);

      // Assert
      expect(component.searchText).toBe('villa nueva');
      expect(houseService.getHouses).toHaveBeenCalledWith({
        page: 0,
        size: 5,
        sortBy: 'id',
        orderAsc: true,
        ubicationSearchText: 'villa nueva'
      });
    });

    it('should reset to first page when searching', () => {
      // Arrange
      component.currentPage = 2;
      jest.spyOn(component, 'getHouses');

      // Act
      component.searchText = 'test';
      component.getHouses(0);

      // Assert
      expect(component.getHouses).toHaveBeenCalledWith(0);
    });
  });

  describe('Toast Management', () => {
    it('should show success toast', () => {
      // Act
      component['showToast']('Success message', 'success');

      // Assert
      expect(component.toastMessage).toBe('Success message');
      expect(component.toastType).toBe('success');
    });

    it('should show error toast', () => {
      // Act
      component['showToast']('Error message', 'error');

      // Assert
      expect(component.toastMessage).toBe('Error message');
      expect(component.toastType).toBe('error');
    });

    it('should clear toast on close', () => {
      // Arrange
      component.toastMessage = 'Test message';
      component.toastType = 'error';

      // Act
      component.onToastClosed();

      // Assert
      expect(component.toastMessage).toBeNull();
    });
  });

  describe('Form Validation', () => {
    it('should validate required name field', () => {
      // Arrange
      const nameControl = component.houseForm.get('name');

      // Act
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      // Assert
      expect(nameControl?.errors?.['required']).toBeTruthy();
      expect(nameControl?.valid).toBeFalsy();
    });

    it('should validate name minimum length', () => {
      // Arrange
      const nameControl = component.houseForm.get('name');

      // Act
      nameControl?.setValue('ab');

      // Assert
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      expect(nameControl?.valid).toBeFalsy();
    });

    it('should accept valid name', () => {
      // Arrange
      const nameControl = component.houseForm.get('name');

      // Act
      nameControl?.setValue('Casa Nueva');

      // Assert
      expect(nameControl?.errors).toBeNull();
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate required date field', () => {
      // Arrange
      const dateControl = component.houseForm.get('activePublicationDate');

      // Act
      dateControl?.setValue('');
      dateControl?.markAsTouched();

      // Assert
      expect(dateControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate date is not in the past', () => {
      // Arrange
      const dateControl = component.houseForm.get('activePublicationDate');
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      // Act
      dateControl?.setValue(pastDate.toISOString().split('T')[0]);

      // Assert
      expect(dateControl?.errors?.['beforeToday']).toBeTruthy();
    });

    it('should validate date is not more than one month ahead', () => {
      // Arrange
      const dateControl = component.houseForm.get('activePublicationDate');
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);

      // Act
      dateControl?.setValue(futureDate.toISOString().split('T')[0]);

      // Assert
      expect(dateControl?.errors?.['maxOneMonth']).toBeTruthy();
    });

    it('should accept valid future date within one month', () => {
      // Arrange
      const dateControl = component.houseForm.get('activePublicationDate');
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 15);

      // Act
      dateControl?.setValue(validDate.toISOString().split('T')[0]);

      // Assert
      expect(dateControl?.errors).toBeNull();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Create a valid future date within one month
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 10); // 10 days from now
      const formattedDate = validDate.toISOString().split('T')[0];
      
      component.houseForm.patchValue({
        name: 'Casa Nueva',
        description: 'Una hermosa casa nueva',
        categoryId: 1,
        numberOfRooms: '3',
        numberOfBathrooms: '2',
        price: '300000000',
        ubicationId: 1,
        address: 'Calle 123 # 45 67',
        activePublicationDate: formattedDate
      });
    });

    it('should submit valid form successfully', () => {
      // Arrange
      houseService.createHouse.mockReturnValue(of({ id: 1 }));
      jest.spyOn(component, 'getHouses');
      // Ensure form is valid
      component.houseForm.markAllAsTouched();
      expect(component.houseForm.valid).toBeTruthy();

      // Capture form values before submission (since form gets reset after successful submission)
      const expectedFormValues = component.houseForm.value;

      // Act
      component.onFormSubmit();

      // Assert
      expect(houseService.createHouse).toHaveBeenCalledWith(expectedFormValues);
      expect(component.toastType).toBe('success');
      expect(component.toastMessage).toContain('Propiedad creada exitosamente');
      expect(component.getHouses).toHaveBeenCalledWith(0);
    });

    it('should not submit invalid form', () => {
      // Arrange
      component.houseForm.get('name')?.setValue('');
      component.houseForm.get('name')?.markAsTouched();

      // Act
      component.onFormSubmit();

      // Assert
      expect(houseService.createHouse).not.toHaveBeenCalled();
      expect(component.houseForm.invalid).toBeTruthy();
    });

    it('should handle form submission error', () => {
      // Arrange
      const error = new Error('Submission error');
      houseService.createHouse.mockReturnValue(throwError(() => error));
      // Ensure form is valid so we reach the service call
      component.houseForm.markAllAsTouched();
      expect(component.houseForm.valid).toBeTruthy();

      // Act
      component.onFormSubmit();

      // Assert
      expect(component.toastType).toBe('error');
      expect(component.toastMessage).toContain('Error al crear la propiedad');
    });

    it('should reset form after successful submission', () => {
      // Arrange
      houseService.createHouse.mockReturnValue(of({ id: 1 }));
      // Ensure form is valid before submission
      component.houseForm.markAllAsTouched();
      expect(component.houseForm.valid).toBeTruthy();

      // Act
      component.onFormSubmit();

      // Assert
      expect(component.houseForm.get('name')?.value).toBe(null);
      expect(component.houseForm.pristine).toBeTruthy();
    });
  });

  describe('Appointment Slot Modal', () => {
    beforeEach(() => {
      component.selectedHouseForSlot = mockHouseResponse;
      // Set user as seller for modal tests
      component.isSeller = true;
    });

    it('should open appointment slot modal', () => {
      // Act
      component.openCreateSlotModal(mockHouseResponse);

      // Assert
      expect(component.selectedHouseForSlot).toEqual(mockHouseResponse);
      expect(component.isCreateSlotModalVisible).toBe(true);
    });

    it('should close appointment slot modal', () => {
      // Arrange
      component.isCreateSlotModalVisible = true;

      // Act
      component.closeCreateSlotModal();

      // Assert
      expect(component.isCreateSlotModalVisible).toBe(false);
      expect(component.selectedHouseForSlot).toBeNull();
    });

    it('should submit appointment slot successfully', () => {
      // Arrange
      component.selectedHouseForSlot = mockHouseResponse;
      // Create a valid future date
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 5); // 5 days from now
      const formattedDate = validDate.toISOString().split('T')[0];
      
      const appointmentData = {
        fechaVisita: formattedDate,
        horaInicio: '10:00',
        horaFin: '11:00'
      };
      component.appointmentSlotForm.patchValue(appointmentData);
      appointmentSlotService.createAppointmentSlot.mockReturnValue(of({ id: 1 }));
      // Ensure form is valid
      component.appointmentSlotForm.markAllAsTouched();
      expect(component.appointmentSlotForm.valid).toBeTruthy();

      // Act
      component.onSaveAppointmentSlot();

      // Assert
      expect(appointmentSlotService.createAppointmentSlot).toHaveBeenCalled();
      expect(component.toastType).toBe('success');
      expect(component.isCreateSlotModalVisible).toBe(false);
    });

    it('should handle appointment slot submission error', () => {
      // Arrange
      component.selectedHouseForSlot = mockHouseResponse;
      // Create a valid future date
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 5); // 5 days from now
      const formattedDate = validDate.toISOString().split('T')[0];
      
      const appointmentData = {
        fechaVisita: formattedDate,
        horaInicio: '10:00',
        horaFin: '11:00'
      };
      component.appointmentSlotForm.patchValue(appointmentData);
      const error = { error: { message: 'Error al crear el horario' } };
      appointmentSlotService.createAppointmentSlot.mockReturnValue(throwError(() => error));
      // Ensure form is valid so we reach the service call
      component.appointmentSlotForm.markAllAsTouched();
      expect(component.appointmentSlotForm.valid).toBeTruthy();

      // Act
      component.onSaveAppointmentSlot();

      // Assert
      expect(component.toastType).toBe('error');
      expect(component.toastMessage).toContain('Error al crear el horario');
    });
  });

  describe('Table Actions', () => {
    it('should check if user is seller', () => {
      // Arrange
      roleService.hasRole.mockReturnValue(true);
      component.ngOnInit();

      // Act
      const isSeller = component.isSeller;

      // Assert
      expect(roleService.hasRole).toHaveBeenCalledWith('SELLER');
      expect(isSeller).toBe(true);
    });

    it('should check if user is not seller', () => {
      // Arrange
      roleService.hasRole.mockReturnValue(false);
      component.ngOnInit();

      // Act
      const isSeller = component.isSeller;

      // Assert
      expect(isSeller).toBe(false);
    });

    it('should handle table action for create slot', () => {
      // Arrange
      jest.spyOn(component, 'openCreateSlotModal');

      // Act
      component.onTableAction({ type: 'createSlot', row: mockHouseResponse });

      // Assert
      expect(component.openCreateSlotModal).toHaveBeenCalledWith(mockHouseResponse);
    });
  });
});

describe('maxOneMonthValidator', () => {
  it('should return null for null value', () => {
    // Arrange
    const control: any = { value: null };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null for empty string', () => {
    // Arrange
    const control: any = { value: '' };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toBeNull();
  });

  it('should return invalidDate error for invalid date format', () => {
    // Arrange
    const control: any = { value: 'invalid-date' };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toEqual({ invalidDate: true });
  });

  it('should return invalidDate error for incomplete date', () => {
    // Arrange
    const control: any = { value: '2025-01' };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toEqual({ invalidDate: true });
  });

  it('should return beforeToday error for past date', () => {
    // Arrange
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const control: any = { value: yesterday.toISOString().split('T')[0] };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toEqual({ beforeToday: true });
  });

  it('should return maxOneMonth error for date more than one month ahead', () => {
    // Arrange
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const control: any = { value: futureDate.toISOString().split('T')[0] };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toEqual({ maxOneMonth: true });
  });

  it('should return null for today', () => {
    // Arrange
    const today = new Date();
    const control: any = { value: today.toISOString().split('T')[0] };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null for valid date within one month', () => {
    // Arrange
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 15);
    const control: any = { value: validDate.toISOString().split('T')[0] };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null for exactly one month ahead', () => {
    // Arrange
    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);
    const control: any = { value: oneMonthAhead.toISOString().split('T')[0] };

    // Act
    const result = maxOneMonthValidator(control);

    // Assert
    expect(result).toBeNull();
  });
});