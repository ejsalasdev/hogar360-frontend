import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule si tu componente lo usa
import { CategoryService } from '../../../../core/services/category.service'; // Importa el servicio
import { AtomsModule } from '../../atoms/atoms.module'; // Importa el módulo de átomos si lo usa

import { CreateCategoryPageComponent } from './create-category-page.component';

describe('CreateCategoryPageComponent', () => {
  let component: CreateCategoryPageComponent;
  let fixture: ComponentFixture<CreateCategoryPageComponent>;
  let categoryService: CategoryService; // Para inyectar el servicio

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCategoryPageComponent],
      imports: [
        HttpClientTestingModule, // Importa el módulo de pruebas de HttpClient
        FormsModule,             // Importa FormsModule si tu componente usa ngModel
        AtomsModule              // Importa AtomsModule si tu plantilla usa atm-form-input
      ],
      providers: [
        CategoryService // Proporciona el servicio
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryPageComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService); // Inyecta el servicio
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Aquí puedes añadir más pruebas para tu componente
});