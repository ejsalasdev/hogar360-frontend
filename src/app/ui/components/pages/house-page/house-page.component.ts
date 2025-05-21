import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { House } from 'src/app/core/models/house.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { HouseService } from 'src/app/core/services/house.service';
import { UbicationService } from 'src/app/core/services/ubication.service';
import { SelectOption } from '../../atoms/select-atom/select-atom.component';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';
import { PageInfo } from 'src/app/core/models/page-info.model';
import { HouseResponse } from 'src/app/core/models/house-response.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface CategoryOption extends SelectOption {
  id: number;
  name: string;
}

interface UbicationOption extends SelectOption {
  id: number;
  cityName: string;
  departmentName: string;
}

function maxOneMonthValidator(
  control: AbstractControl
): ValidationErrors | null {
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

@Component({
  selector: 'app-house-page',
  templateUrl: './house-page.component.html',
  styleUrls: ['./house-page.component.scss'],
})
export class HousePageComponent implements OnInit {
  categories: CategoryOption[] = [];
  ubications: UbicationOption[] = [];
  houseForm: FormGroup;
  toastMessage: string | null = null;
  toastType: ToastType = 'info';

  // Properties for the table
  houses: HouseResponse[] = [];
  houseTableColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'category', label: 'Categoría', sortable: true },
    { key: 'numberOfRooms', label: 'Habitaciones', sortable: true },
    { key: 'numberOfBathrooms', label: 'Baños', sortable: true },
    { key: 'price', label: 'Precio', sortable: true },
    { key: 'address', label: 'Dirección' },
    { key: 'ubication', label: 'Ubicación' },
    { key: 'city', label: 'Ciudad' },
    { key: 'department', label: 'Departamento' },
    { key: 'activePublicationDate', label: 'Fecha Pub. Activa' },
    { key: 'publicationStatus', label: 'Estado Pub.' },
    { key: 'publicationDate', label: 'Fecha Pub.' },
    { key: 'sellerId', label: 'ID Vendedor' },
  ];
  isLoading: boolean = false;
  currentPage: number = 0;
  pageSize: number = 5;
  sort: { key: string; direction: 'asc' | 'desc' } = {
    key: 'id',
    direction: 'asc',
  };

  // Nuevas propiedades para la búsqueda
  searchControl = new FormControl('');
  searchText: string = '';

  houseFormFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese el nombre de la propiedad',
      required: true,
      minlength: 5,
      maxlength: 50,
      patternError: 'El nombre solo puede contener letras y espacios',
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      inputType: 'text',
      placeholder: 'Ingrese la descripción de la propiedad',
      required: true,
      minlength: 10,
      maxlength: 300,
      patternError:
        'La descripción solo puede contener letras, números y espacios',
    },
    {
      name: 'categoryId',
      label: 'Categoría',
      type: 'select',
      placeholder: 'Seleccione una categoría',
      options: this.categories,
      required: true,
    },
    {
      name: 'numberOfRooms',
      label: 'Número de habitaciones',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese el número de habitaciones',
      required: true,
      minlength: 0,
      maxlength: 10,
      patternError:
        'El número de habitaciones debe ser un número entero',
    },
    {
      name: 'numberOfBathrooms',
      label: 'Número de baños',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese el número de baños',
      required: true,
      minlength: 0,
      maxlength: 10,
      patternError: 'El número de baños debe ser un número entero',
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ingrese el precio',
      required: true,
      minlength: 1,
      maxlength: 13,
      patternError: 'El precio debe ser un número entero mayor a 0',
    },
    {
      name: 'ubicationId',
      label: 'Ubicación',
      type: 'select',
      options: this.ubications,
      required: true,
      placeholder: 'Seleccione una ubicación',
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'input',
      inputType: 'text',
      placeholder: 'Ejemplo: Calle 123 # 45 67 Villa Antigua',
      required: true,
      minlength: 10,
      maxlength: 200,
      patternError:
        'La dirección solo puede contener letras, números, un caracter # y espacios',
    },
    {
      name: 'activePublicationDate',
      label: 'Fecha de publicación activa',
      type: 'input',
      inputType: 'date',
      required: true,
    },
  ];

  pageInfo: PageInfo<HouseResponse> | null = null;

  constructor(
    private houseService: HouseService,
    private categoryService: CategoryService,
    private ubicationService: UbicationService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.houseForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(300),
          Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s]+$'),
        ],
      ],
      categoryId: [null, Validators.required],
      numberOfRooms: [
        '',
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]d*$'),
        ],
      ],
      numberOfBathrooms: [
        '',
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]d*$'),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(13),
          Validators.pattern('^[1-9]\\d*$'),
        ],
      ],
      ubicationId: [null, Validators.required],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          Validators.pattern(
            '^(?!0)[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s]*#?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s]*$'
          ),
        ],
      ],
      activePublicationDate: ['', [Validators.required, maxOneMonthValidator]],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories(0, 50, true).subscribe({
      next: (res) => {
        this.categories = res.content.map((cat) => ({
          label: cat.name,
          value: cat.id,
          id: cat.id,
          name: cat.name,
        }));
        this.houseFormFields.find((f) => f.name === 'categoryId')!.options =
          this.categories;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.showToast('Error al cargar las categorías', 'error');
      },
    });

    this.ubicationService.getUbications(0, 50, true).subscribe({
      next: (res) => {
        this.ubications = res.content.map((ubi) => ({
          label: `${ubi.sector}, ${ubi.cityName}, ${ubi.departmentName}`,
          value: ubi.id,
          id: ubi.id,
          cityName: ubi.cityName,
          departmentName: ubi.departmentName,
          sector: ubi.sector,
        }));
        this.houseFormFields.find((f) => f.name === 'ubicationId')!.options =
          this.ubications;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.showToast('Error al cargar las ubicaciones', 'error');
      },
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(400), // Espera 400ms después de la última pulsación
      distinctUntilChanged() // Solo emite si el valor actual es diferente del anterior
    ).subscribe(value => {
      this.searchText = value || '';
      this.getHouses(0); // Llama a getHouses, reseteando a la primera página
    });

    this.getHouses(); // Load houses on init
  }

  getHouses(page: number = this.currentPage): void {
    this.isLoading = true;
    const params: any = {
      page: page,
      size: this.pageSize,
      sortBy: this.sort.key,
      orderAsc: this.sort.direction === 'asc',
    };

    if (this.searchText && this.searchText.trim() !== '') {
      params.ubicationSearchText = this.searchText.trim();
    }

    this.houseService.getHouses(params).subscribe({
      next: (data) => {
        this.pageInfo = data;
        this.houses = data.content;
        this.currentPage = data.currentPage;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Error al cargar las propiedades.', 'error');
        this.changeDetectorRef.markForCheck();
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
      this.getHouses(page);
    }
  }

  onSortChange(sort: { key: string; direction: 'asc' | 'desc' }) {
    this.sort = sort;
    this.getHouses(0); // Reset to first page
  }

  private showToast(message: string, type: ToastType): void {
    this.toastMessage = message;
    this.toastType = type;
    this.changeDetectorRef.markForCheck();
  }

  onToastClosed(): void {
    this.toastMessage = null;
    this.changeDetectorRef.markForCheck();
  }

  onFormSubmit() {
    const house: House = this.houseForm.value;
    if (this.houseForm.invalid) {
      return;
    }
    this.houseService.createHouse(house).subscribe({
      next: () => {
        this.showToast('Propiedad creada exitosamente', 'success');
        this.houseForm.reset();
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        this.showToast('Error al crear la propiedad', 'error');
      },
    });
  }
}
