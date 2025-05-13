import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormInputAtomComponent } from '../../atoms/form-input-atom/form-input-atom.component';
import { SelectAtomComponent, SelectOption } from '../../atoms/select-atom/select-atom.component';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';

interface Department extends SelectOption {
  id: number;
  name: string;
}

interface City extends SelectOption {
  id: number;
  name: string;
  departmentId: number;
}

interface Location {
  departmentId: number;
  cityId: number;
  sector: string;
}

@Component({
  selector: 'pg-location',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPageComponent implements OnInit {
  departments: Department[] = [];
  cities: City[] = [];
  selectedDepartmentId: number | null = null;
  selectedCityId: number | null = null;
  sector: string = '';
  toastMessage = '';
  toastType: ToastType = 'info';
  isLoading: boolean = false;

  readonly maxLengthSector: number = 50;

  @ViewChild('createLocationForm') createLocationForm!: NgForm;
  @ViewChild('sectorInputRef') sectorInput!: FormInputAtomComponent;
  @ViewChild('departmentSelectRef') departmentSelect!: SelectAtomComponent;
  @ViewChild('citySelectRef') citySelect!: SelectAtomComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // TODO: Implementar carga de departamentos cuando esté el endpoint
    this.departments = [
      { id: 1, name: 'Departamento 1', value: 1, label: 'Departamento 1' },
      { id: 2, name: 'Departamento 2', value: 2, label: 'Departamento 2' }
    ];
  }

  onDepartmentChange(departmentId: string | number): void {
    this.selectedDepartmentId = Number(departmentId);
    this.selectedCityId = null;
    this.cities = [];
    
    if (this.selectedDepartmentId) {
      // TODO: Implementar carga de ciudades cuando esté el endpoint
      this.cities = [
        { id: 1, name: 'Ciudad 1', departmentId: this.selectedDepartmentId, value: 1, label: 'Ciudad 1' },
        { id: 2, name: 'Ciudad 2', departmentId: this.selectedDepartmentId, value: 2, label: 'Ciudad 2' }
      ];
    }
    
    this.changeDetectorRef.markForCheck();
  }

  onSubmit(): void {
    if (this.createLocationForm.valid) {
      const location: Location = {
        departmentId: this.selectedDepartmentId!,
        cityId: this.selectedCityId!,
        sector: this.sector
      };

      // TODO: Implementar creación de ubicación cuando esté el endpoint
      console.log('Location to create:', location);
      this.showSuccess('La ubicación se ha creado exitosamente.');
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.selectedDepartmentId = null;
    this.selectedCityId = null;
    this.sector = '';
    this.cities = [];
    this.createLocationForm.resetForm();
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
}
