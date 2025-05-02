import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController; // Para simular las peticiones HTTP

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo de pruebas de HttpClient
      providers: [CategoryService]       // Asegúrate de que el servicio esté en providers
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController); // Inyecta el mock del controlador HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya peticiones pendientes al final de cada prueba
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Aquí puedes añadir más pruebas para los métodos de tu servicio
});