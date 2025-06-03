import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UbicationService, SaveUbicationRequest } from './ubication.service';
import { environment } from '../../../environments/environment';

describe('UbicationService', () => {
  let service: UbicationService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiUrl}/api/v1/ubication`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UbicationService]
    });
    service = TestBed.inject(UbicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUbication', () => {
    it('should create ubication (success)', () => {
      // Arrange
      const request: SaveUbicationRequest = {
        sector: 'Centro',
        cityName: 'Ciudad 1',
        departmentName: 'Depto 1'
      };
      const mockResponse = { success: true };
      // Act
      service.createUbication(request).subscribe(data => {
        // Assert
        expect(data).toEqual(mockResponse);
      });
      const req = httpMock.expectOne(`${API_URL}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle error on createUbication', () => {
      // Arrange
      const request: SaveUbicationRequest = {
        sector: 'Centro',
        cityName: 'Ciudad 1',
        departmentName: 'Depto 1'
      };
      // Act
      service.createUbication(request).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          // Assert
          expect(err.status).toBe(409);
        }
      });
      const req = httpMock.expectOne(`${API_URL}/create`);
      req.flush('Error', { status: 409, statusText: 'Conflict' });
    });
  });
}); 