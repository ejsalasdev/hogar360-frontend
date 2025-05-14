import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../../core/services/department.service';
import { CityService } from '../../../../core/services/city.service';
import { LocationPageComponent } from './location-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LocationPageComponent', () => {
  let component: LocationPageComponent;
  let fixture: ComponentFixture<LocationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationPageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [DepartmentService, CityService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.createLocationForm.valid).toBeFalsy();
    expect(component.sector).toBe('');
    expect(component.selectedDepartmentId).toBeNull();
    expect(component.selectedCityId).toBeNull();
  });

  it('should validate sector minlength and maxlength', () => {
    const sectorInput = component.createLocationForm.controls['sector'];
    sectorInput.setValue('ab');
    expect(sectorInput.errors?.['minlength']).toBeTruthy();
    sectorInput.setValue('a'.repeat(51));
    expect(sectorInput.errors?.['maxlength']).toBeTruthy();
    sectorInput.setValue('Barrio Centro');
    expect(sectorInput.errors).toBeNull();
  });

  it('should reset the form after creating a location', () => {
    component.selectedDepartmentId = '1';
    component.selectedCityId = '2';
    component.sector = 'Sector Prueba';
    fixture.detectChanges();
    component.resetForm();
    expect(component.selectedDepartmentId).toBeNull();
    expect(component.selectedCityId).toBeNull();
    expect(component.sector).toBe('');
    expect(component.cities.length).toBe(0);
    expect(component.createLocationForm.valid).toBeFalsy();
  });
});
