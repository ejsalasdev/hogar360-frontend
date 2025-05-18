import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CityService } from '../../../../core/services/city.service';
import { DepartmentService } from '../../../../core/services/department.service';
import {
  SaveUbicationRequest,
  UbicationService,
} from '../../../../core/services/ubication.service';
import { SelectOption } from '../../atoms/select-atom/select-atom.component';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';
import { UbicationResponse } from '../../../../core/models/ubication-response.model';
import { PageInfo } from '../../../../core/models/page-info.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  locationFormFields: any[] = [];
  locationModel: any = { department: null, city: null, sector: '' };
  locationForm!: FormGroup;
  toastMessage: string | null = null;
  toastType: ToastType = 'info';
  isLoading: boolean = false;
  locations: UbicationResponse[] = [];
  pageInfo: PageInfo<UbicationResponse> | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  orderAsc: boolean = true;
  sort: { key: string, direction: 'asc' | 'desc' } = { key: 'departmentName', direction: 'asc' };
  searchControl = new FormControl('');
  searchText: string = '';

  readonly maxLengthSector: number = 50;

  locationTableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'departmentName', label: 'Departamento', sortable: true },
    { key: 'cityName', label: 'Ciudad', sortable: true },
    { key: 'sector', label: 'Sector' }
  ];

  constructor(
    private departmentService: DepartmentService,
    private cityService: CityService,
    private ubicationService: UbicationService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.locationFormFields = [
      {
        name: 'department',
        type: 'select',
        label: 'Departamento',
        options: this.departments,
        required: true,
        placeholder: 'Seleccione un departamento',
      },
      {
        name: 'city',
        type: 'select',
        label: 'Ciudad',
        options: this.cities,
        required: true,
        placeholder: 'Seleccione una ciudad',
      },
      {
        name: 'sector',
        type: 'input',
        label: 'Sector',
        placeholder: 'Escribe el sector (máximo 50 caracteres)',
        required: true,
        minlength: 5,
        maxlength: this.maxLengthSector,
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+',
      },
    ];
    this.locationForm = this.fb.group({
      department: [null, Validators.required],
      city: [{ value: null, disabled: true }, Validators.required],
      sector: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(this.maxLengthSector),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+'),
        ],
      ],
    });
    this.locationForm
      .get('department')
      ?.valueChanges.subscribe((departmentId) => {
        this.onDepartmentChange(departmentId);
      });
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchText = value || '';
        this.getUbications(0);
      });
    this.getUbications();
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
        const departmentField = this.locationFormFields.find(
          (f) => f.name === 'department'
        );
        if (departmentField) departmentField.options = this.departments;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.showToast('Error al cargar los departamentos', 'error');
      },
    });
  }

  onDepartmentChange(departmentId: string | number | null): void {
    this.locationModel.department = departmentId ? String(departmentId) : null;
    this.locationModel.city = null;
    this.cities = [];
    const cityField = this.locationFormFields.find((f) => f.name === 'city');
    if (cityField) {
      cityField.options = [];
    }
    if (!this.locationModel.department) {
      this.locationForm.get('city')?.disable();
    } else {
      this.locationForm.get('city')?.enable();
    }
    if (
      this.locationModel.department &&
      !isNaN(Number(this.locationModel.department))
    ) {
      this.loadCities();
    }
  }

  loadCities(): void {
    if (
      !this.locationModel.department ||
      isNaN(Number(this.locationModel.department))
    )
      return;
    this.cityService
      .getCitiesByDepartment(Number(this.locationModel.department))
      .subscribe({
        next: (cities) => {
          this.cities = cities.map((city) => ({
            id: city.id,
            name: city.name,
            departmentId: Number(this.locationModel.department!),
            value: city.id.toString(),
            label: city.name,
          }));
          const cityField = this.locationFormFields.find(
            (f) => f.name === 'city'
          );
          if (cityField) {
            cityField.options = this.cities;
          }
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Error loading cities:', error);
          this.showToast('Error al cargar las ciudades', 'error');
        },
      });
  }

  onCityChange(cityId: string | number | null): void {
    this.locationModel.city = cityId ? String(cityId) : null;
  }

  onFormSubmit() {
    const model = this.locationForm.value;
    if (this.locationForm.invalid) {
      return;
    }
    const selectedCity = this.cities.find(
      (city) => String(city.id) === String(model.city)
    );
    const selectedDepartment = this.departments.find(
      (dept) => dept.id === Number(model.department)
    );
    if (!selectedCity) {
      this.showToast('Ciudad no encontrada', 'error');
      return;
    }
    const request: SaveUbicationRequest = {
      sector: model.sector,
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
    this.locationModel = { department: null, city: null, sector: '' };
    this.cities = [];
    this.locationForm.reset({ department: null, city: null, sector: '' });
    this.locationForm.get('city')?.disable();
    const departmentField = this.locationFormFields.find(
      (f) => f.name === 'department'
    );
    if (departmentField) departmentField.options = this.departments;
    const cityField = this.locationFormFields.find((f) => f.name === 'city');
    if (cityField) {
      cityField.options = [];
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

  getUbications(page: number = this.currentPage): void {
    this.isLoading = true;
    this.ubicationService
      .getUbications(page, this.pageSize, this.sort.direction === 'asc', this.sort.key, this.searchText)
      .subscribe({
        next: (data) => {
          this.pageInfo = data;
          this.locations = data.content;
          this.currentPage = data.currentPage;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.showToast('Error al cargar las ubicaciones', 'error');
        },
      });
  }

  onPageChange(page: number): void {
    if (
      page !== this.currentPage &&
      this.pageInfo &&
      page >= 0 &&
      page < this.pageInfo.totalPages
    ) {
      this.getUbications(page);
    }
  }

  toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.getUbications(0);
  }

  onSortChange(sort: { key: string, direction: 'asc' | 'desc' }) {
    this.sort = sort;
    this.getUbications(0);
  }
}
