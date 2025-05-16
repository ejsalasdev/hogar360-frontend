import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../../../core/services/department.service';
import { CityService } from '../../../../core/services/city.service';
import { UbicationService } from '../../../../core/services/ubication.service';
import { LocationPageComponent } from './location-page.component';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LocationPageComponent', () => {
  let component: LocationPageComponent;
  let fixture: ComponentFixture<LocationPageComponent>;
  let departmentService: jest.Mocked<DepartmentService>;
  let cityService: jest.Mocked<CityService>;
  let ubicationService: jest.Mocked<UbicationService>;

  beforeEach(() => {
    departmentService = {
      getAllDepartments: jest.fn()
    } as any;
    cityService = {
      getCitiesByDepartment: jest.fn()
    } as any;
    ubicationService = {
      createUbication: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      declarations: [LocationPageComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: DepartmentService, useValue: departmentService },
        { provide: CityService, useValue: cityService },
        { provide: UbicationService, useValue: ubicationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LocationPageComponent);
    component = fixture.componentInstance;
    departmentService.getAllDepartments.mockReturnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    fixture.detectChanges();
    expect(component.locationForm.valid).toBeFalsy();
    expect(component.locationForm.get('sector')?.value).toBe('');
    expect(component.locationForm.get('department')?.value).toBeNull();
    expect(component.locationForm.get('city')?.value).toBeNull();
  });

  it('should validate sector minlength and maxlength', () => {
    fixture.detectChanges();
    const sectorInput = component.locationForm.get('sector');
    sectorInput?.setValue('ab');
    expect(sectorInput?.errors?.['minlength']).toBeTruthy();
    sectorInput?.setValue('a'.repeat(51));
    expect(sectorInput?.errors?.['maxlength']).toBeTruthy();
    sectorInput?.setValue('Barrio Centro');
    expect(sectorInput?.errors).toBeNull();
  });

  it('should disable city select until department is selected', () => {
    fixture.detectChanges();
    expect(component.locationForm.get('city')?.disabled).toBeTruthy();
    component.locationForm.get('department')?.setValue('1');
    fixture.detectChanges();
    expect(component.locationForm.get('city')?.enabled).toBeTruthy();
  });

  it('should load departments on init', () => {
    const mockDepartments = [
      { id: 1, name: 'Depto 1' },
      { id: 2, name: 'Depto 2' }
    ];
    departmentService.getAllDepartments.mockReturnValue(of(mockDepartments));
    fixture.detectChanges();
    expect(component.departments.length).toBe(2);
    expect(component.locationFormFields[0].options.length).toBe(2);
  });

  it('should load cities when department is selected', fakeAsync(() => {
    const mockCities = [
      { id: 1, name: 'Ciudad 1' },
      { id: 2, name: 'Ciudad 2' }
    ];
    component.departments = [{ id: 1, name: 'Depto 1', value: '1', label: 'Depto 1' }];
    cityService.getCitiesByDepartment.mockReturnValue(of(mockCities));
    fixture.detectChanges();
    component.locationForm.get('department')?.setValue('1');
    tick();
    component.loadCities();
    expect(component.cities.length).toBe(2);
    expect(component.locationFormFields[1].options.length).toBe(2);
  }));

  it('should reset the form after creating a location', () => {
    fixture.detectChanges();
    component.locationForm.get('department')?.setValue('1');
    component.locationForm.get('city')?.setValue('2');
    component.locationForm.get('sector')?.setValue('Sector Prueba');
    fixture.detectChanges();
    component.resetForm();
    expect(component.locationForm.get('department')?.value).toBeNull();
    expect(component.locationForm.get('city')?.value).toBeNull();
    expect(component.locationForm.get('sector')?.value).toBe('');
    expect(component.cities.length).toBe(0);
    expect(component.locationForm.valid).toBeFalsy();
  });

  it('should show toast and reset form on successful submit', fakeAsync(() => {
    const mockDepartments = [
      { id: 1, name: 'Depto 1', value: '1', label: 'Depto 1' }
    ];
    const mockCities = [
      { id: 2, name: 'Ciudad 2', value: '2', label: 'Ciudad 2', departmentId: 1 }
    ];
    component.departments = mockDepartments;
    component.cities = mockCities;
    cityService.getCitiesByDepartment.mockReturnValue(of(mockCities));
    ubicationService.createUbication.mockReturnValue(of({}));
    fixture.detectChanges();
    component.locationForm.get('department')?.setValue('1');
    component.locationForm.get('city')?.enable();
    component.locationForm.get('city')?.setValue('2');
    component.locationForm.get('sector')?.setValue('Sector Prueba');
    fixture.detectChanges();
    component.onFormSubmit(component.locationForm.value);
    tick();
    expect(component.toastMessage).toContain('Ubicación creada exitosamente');
    expect(component.locationForm.get('department')?.value).toBeNull();
    expect(component.locationForm.get('city')?.value).toBeNull();
    expect(component.locationForm.get('sector')?.value).toBe('');
  }));

  it('should show error toast if city not found on submit', () => {
    component.departments = [{ id: 1, name: 'Depto 1', value: '1', label: 'Depto 1' }];
    component.cities = [];
    cityService.getCitiesByDepartment.mockReturnValue(of([]));
    fixture.detectChanges();
    component.locationForm.get('department')?.setValue('1');
    component.locationForm.get('city')?.enable();
    component.locationForm.get('city')?.setValue('2');
    component.locationForm.get('sector')?.setValue('Sector Prueba');
    fixture.detectChanges();
    component.onFormSubmit(component.locationForm.value);
    expect(component.toastMessage).toContain('Ciudad no encontrada');
  });

  it('should show error toast if ubicationService returns error', fakeAsync(() => {
    const mockDepartments = [
      { id: 1, name: 'Depto 1', value: '1', label: 'Depto 1' }
    ];
    const mockCities = [
      { id: 2, name: 'Ciudad 2', value: '2', label: 'Ciudad 2', departmentId: 1 }
    ];
    component.departments = mockDepartments;
    component.cities = mockCities;
    cityService.getCitiesByDepartment.mockReturnValue(of(mockCities));
    ubicationService.createUbication.mockReturnValue(throwError({ status: 409 }));
    fixture.detectChanges();
    component.locationForm.get('department')?.setValue('1');
    component.locationForm.get('city')?.enable();
    component.locationForm.get('city')?.setValue('2');
    component.locationForm.get('sector')?.setValue('Sector Prueba');
    fixture.detectChanges();
    component.onFormSubmit(component.locationForm.value);
    tick();
    expect(component.toastMessage).toContain('ya existe');
  }));
});
