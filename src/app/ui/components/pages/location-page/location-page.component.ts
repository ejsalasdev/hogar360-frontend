import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  SelectAtomComponent,
  SelectOption,
} from '../../atoms/select-atom/select-atom.component';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';
import { DepartmentService } from '../../../../core/services/department.service';
import { CityService } from '../../../../core/services/city.service';
import {
  UbicationService,
  SaveUbicationRequest,
} from '../../../../core/services/ubication.service';

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
  selectedDepartmentId: string | null = null;
  selectedCityId: string | null = null;
  sector: string = '';
  toastMessage: string | null = null;
  toastType: ToastType = 'info';
  isLoading: boolean = false;

  readonly maxLengthSector: number = 50;

  @ViewChild('createLocationForm') createLocationForm!: NgForm;
  @ViewChild('departmentSelectRef') departmentSelect!: SelectAtomComponent;
  @ViewChild('citySelectRef') citySelect!: SelectAtomComponent;

  constructor(
    private departmentService: DepartmentService,
    private cityService: CityService,
    private ubicationService: UbicationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          value: dept.id.toString(),
          label: dept.name,
        }));
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.showToast('Error al cargar los departamentos', 'error');
      },
    });
  }

  onDepartmentChange(departmentId: string | number | null): void {
    this.selectedDepartmentId = departmentId ? String(departmentId) : null;
    this.selectedCityId = null;
    this.cities = [];
    if (
      this.selectedDepartmentId &&
      !isNaN(Number(this.selectedDepartmentId))
    ) {
      this.loadCities();
    }
  }

  loadCities(): void {
    if (!this.selectedDepartmentId || isNaN(Number(this.selectedDepartmentId)))
      return;
    this.cityService
      .getCitiesByDepartment(Number(this.selectedDepartmentId))
      .subscribe({
        next: (cities) => {
          this.cities = cities.map((city) => ({
            id: city.id,
            name: city.name,
            departmentId: Number(this.selectedDepartmentId!),
            value: city.id.toString(),
            label: city.name,
          }));
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Error loading cities:', error);
          this.showToast('Error al cargar las ciudades', 'error');
        },
      });
  }

  onCityChange(cityId: string | number | null): void {
    this.selectedCityId = cityId ? String(cityId) : null;
  }

  onSubmit(): void {
    if (!this.selectedDepartmentId || !this.selectedCityId || !this.sector) {
      return;
    }

    const selectedCity = this.cities.find(
      (city) => String(city.id) === String(this.selectedCityId)
    );
    const selectedDepartment = this.departments.find(
      (dept) => dept.id === Number(this.selectedDepartmentId)
    );
    if (!selectedCity) {
      this.showToast('Ciudad no encontrada', 'error');
      return;
    }
    const request: SaveUbicationRequest = {
      sector: this.sector,
      cityName: selectedCity.name,
      departmentName: selectedDepartment ? selectedDepartment.name : undefined,
    };
    this.isLoading = true;
    this.ubicationService.createUbication(request).subscribe({
      next: (response) => {
        this.showToast('Ubicación creada exitosamente', 'success');
        this.resetForm();
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (err) => {
        if (err.status === 409) {
          this.showToast(
            'La ubicación ya existe en la ciudad seleccionada.',
            'error'
          );
        } else {
          this.showToast('Error al crear la ubicación', 'error');
        }
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.selectedDepartmentId = null;
    this.selectedCityId = null;
    this.sector = '';
    this.cities = [];
    if (this.createLocationForm) {
      this.createLocationForm.resetForm();
    }
    this.changeDetectorRef.markForCheck();
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

  shouldShowPatternError(input: any): boolean {
    return (
      input.invalid &&
      (input.dirty || input.touched) &&
      input.errors?.['pattern']
    );
  }
}
