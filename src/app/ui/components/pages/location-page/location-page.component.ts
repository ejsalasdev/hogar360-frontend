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
import { DepartmentService } from '../../../../core/services/department.service';

interface DepartmentOption extends SelectOption {
  id: number;
  name: string;
}

interface CityOption extends SelectOption {
  id: number;
  name: string;
  departmentId: number;
}

@Component({
  selector: 'pg-location',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPageComponent implements OnInit {
  departments: DepartmentOption[] = [];
  cities: CityOption[] = [];
  selectedDepartmentId: number | null = null;
  selectedCityId: number | null = null;
  sector: string = '';
  toastMessage: string | null = null;
  toastType: ToastType = 'info';
  isLoading: boolean = false;

  readonly maxLengthSector: number = 100;

  @ViewChild('createLocationForm') createLocationForm!: NgForm;
  @ViewChild('sectorInputRef') sectorInput!: FormInputAtomComponent;
  @ViewChild('departmentSelectRef') departmentSelect!: SelectAtomComponent;
  @ViewChild('citySelectRef') citySelect!: SelectAtomComponent;

  constructor(
    private departmentService: DepartmentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          value: dept.id,
          label: dept.name
        }));
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.showToast('Error al cargar los departamentos', 'error');
      }
    });
  }

  onDepartmentChange(departmentId: string | number | null): void {
    console.log('Department changed:', departmentId);
    this.selectedDepartmentId = departmentId ? Number(departmentId) : null;
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
    if (!this.selectedDepartmentId || !this.selectedCityId || !this.sector) {
      return;
    }

    // TODO: Implementar la creación de ubicación cuando esté el endpoint
    console.log('Form submitted:', {
      departmentId: this.selectedDepartmentId,
      cityId: this.selectedCityId,
      sector: this.sector
    });

    this.showToast('Ubicación creada exitosamente', 'success');
  }

  private showToast(message: string, type: ToastType): void {
    this.toastMessage = message;
    this.toastType = type;
    this.changeDetectorRef.markForCheck();
  }

  onToastClosed(): void {
    this.toastMessage = null;
    this.toastType = 'info';
    this.changeDetectorRef.markForCheck();
  }
}
