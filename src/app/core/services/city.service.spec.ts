import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CityService, City } from './city.service';
import { environment } from '../../../environments/environment';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.propertyApiUrl}/api/v1/cities`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CityService]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCities', () => {
    it('should fetch all cities (success, orderAsc=true)', () => {
      // Arrange
      const mockCities: City[] = [
        { id: 1, name: 'Ciudad 1' },
        { id: 2, name: 'Ciudad 2' }
      ];
      // Act
      service.getAllCities(true).subscribe(data => {
        // Assert
        expect(data).toEqual(mockCities);
      });
      const req = httpMock.expectOne(`${API_URL}?orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCities);
    });

    it('should fetch all cities (orderAsc=false)', () => {
      // Arrange
      const mockCities: City[] = [
        { id: 2, name: 'Ciudad 2' },
        { id: 1, name: 'Ciudad 1' }
      ];
      // Act
      service.getAllCities(false).subscribe(data => {
        // Assert
        expect(data).toEqual(mockCities);
      });
      const req = httpMock.expectOne(`${API_URL}?orderAsc=false`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCities);
    });

    it('should handle error on getAllCities', () => {
      // Act
      service.getAllCities().subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          // Assert
          expect(err.status).toBe(500);
        }
      });
      const req = httpMock.expectOne(`${API_URL}?orderAsc=true`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getCitiesByDepartment', () => {
    it('should fetch cities by department (success, orderAsc=true)', () => {
      // Arrange
      const mockCities: City[] = [
        { id: 1, name: 'Ciudad 1' },
        { id: 2, name: 'Ciudad 2' }
      ];
      const departmentId = 5;
      // Act
      service.getCitiesByDepartment(departmentId, true).subscribe(data => {
        // Assert
        expect(data).toEqual(mockCities);
      });
      const req = httpMock.expectOne(`${API_URL}/departments/${departmentId}?orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCities);
    });

    it('should fetch cities by department (orderAsc=false)', () => {
      // Arrange
      const mockCities: City[] = [
        { id: 2, name: 'Ciudad 2' },
        { id: 1, name: 'Ciudad 1' }
      ];
      const departmentId = 3;
      // Act
      service.getCitiesByDepartment(departmentId, false).subscribe(data => {
        // Assert
        expect(data).toEqual(mockCities);
      });
      const req = httpMock.expectOne(`${API_URL}/departments/${departmentId}?orderAsc=false`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCities);
    });

    it('should handle error on getCitiesByDepartment', () => {
      // Arrange
      const departmentId = 2;
      // Act
      service.getCitiesByDepartment(departmentId).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          // Assert
          expect(err.status).toBe(500);
        }
      });
      const req = httpMock.expectOne(`${API_URL}/departments/${departmentId}?orderAsc=true`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
}); 