import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastType } from '../../atoms/toast-atom/toast-atom.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { SelectOption } from '../../atoms/select-atom/select-atom.component';
import { HouseService } from 'src/app/core/services/house.service';
import { House } from 'src/app/core/models/house.model';
import { PageInfo } from 'src/app/core/models/page-info.model';
import { UbicationService } from 'src/app/core/services/ubication.service';
import { UbicationResponse } from 'src/app/core/models/ubication-response.model';

// Definimos la interfaz para las opciones de categoría
interface CategoryOption extends SelectOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  // Configuración del header (puedes personalizar según tu necesidad)
  headerConfig = {
    logoText: 'Hogar 360',
    welcomeMessage: '',
    userName: '',
    userAvatarUrl: '',
    showUserMenu: false,
  };

  // Formulario reactivo para los filtros
  homeForm!: FormGroup;

  // Lista de categorías para el select
  categories: CategoryOption[] = [];

  // Estado de carga para mostrar loaders si lo necesitas
  isLoading: boolean = false;

  // Mensaje y tipo de toast para feedback al usuario
  toastMessage: string | null = null;
  toastType: ToastType = 'info';

  // Mensaje de error específico para la carga de categorías
  categoryError: string | null = null;

  // Lista de casas y total de casas
  houses: House[] = [];
  totalHouses: number = 0;
  isLoadingHouses: boolean = false;

  // Lista de ubicaciones para el filtro
  ubications: UbicationResponse[] = [];
  isLoadingUbications: boolean = false;

  // Propiedades para los controles del formulario y opciones de ubicación
  categoryFormControl = new FormControl(null);
  ubicationFormControl = new FormControl(null);
  ubicationOptions: { label: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private houseService: HouseService,
    private ubicationService: UbicationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // Inicializamos el formulario y cargamos las categorías, ubicaciones y casas al iniciar el componente
  ngOnInit(): void {
    this.homeForm = this.fb.group({
      categoryId: this.categoryFormControl,
      // searchText: campo opcional, pero si se llena debe contener solo letras y espacios (sin caracteres especiales ni números)
      searchText: ['', Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')],
      ubicationId: this.ubicationFormControl,
    });
    this.loadCategories();
    this.loadUbications();
    this.loadHouses();
    this.homeForm.valueChanges.subscribe(() => {
      this.loadHouses();
    });
  }

  // Método para cargar las categorías desde el servicio
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories(0, 50, true).subscribe({
      next: (res: any) => {
        // Mapeamos la respuesta a la estructura que necesita el select
        this.categories = res.content.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
          id: cat.id,
          name: cat.name,
        }));
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.categoryError = 'No se pudieron cargar las categorías';
        this.isLoading = false;
        this.showToast('Error al cargar las categorías', 'error');
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  // Método para cargar las ubicaciones desde el servicio
  loadUbications(): void {
    this.isLoadingUbications = true;
    this.ubicationService.getUbications(0, 50, true).subscribe({
      next: (res: any) => {
        this.ubications = res.content;
        this.ubicationOptions = this.ubications.map((u: UbicationResponse) => ({
          label: u.cityName + ' - ' + u.departmentName,
          value: u.id,
        }));
        this.isLoadingUbications = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.ubications = [];
        this.ubicationOptions = [];
        this.isLoadingUbications = false;
        this.showToast('Error al cargar ubicaciones', 'error');
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  // Método para cargar las casas desde el servicio
  loadHouses(): void {
    this.isLoadingHouses = true;
    const { categoryId, ubicationId, searchText } = this.homeForm.value;
    this.houseService
      .getHouses({
        page: 0,
        size: 20,
        sortBy: 'price',
        categoryId: categoryId || undefined,
        // Si el usuario escribe texto, buscar por nombre de ciudad/departamento
        ubicationId: ubicationId || undefined,
        orderAsc: true,
      })
      .subscribe({
        next: (res: PageInfo<House>) => {
          this.houses = res.content;
          this.totalHouses = res.totalElements;
          this.isLoadingHouses = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.houses = [];
          this.isLoadingHouses = false;
          this.showToast('Error al cargar las casas', 'error');
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  // Método que se ejecuta al enviar el formulario
  onFormSubmit(): void {
    // Obtenemos los valores del formulario (ambos pueden ser nulos o vacíos)
    const { categoryId, searchText } = this.homeForm.value;
    // Aquí puedes implementar la lógica de filtrado de propiedades
    this.loadHouses();
    // Por ahora solo mostramos un mensaje de éxito
    this.showToast('Filtro aplicado', 'success');
  }

  // Método para mostrar un toast con mensaje y tipo
  private showToast(message: string, type: ToastType): void {
    this.toastMessage = message;
    this.toastType = type;
    this.changeDetectorRef.markForCheck();
  }

  // Método para cerrar el toast
  onToastClosed(): void {
    this.toastMessage = null;
    this.changeDetectorRef.markForCheck();
  }
}
