import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService, Department } from './department.service';
import { environment } from '../../../environments/environment';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiUrl}/api/v1/departments`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentService]
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all departments (success, orderAsc=true)', () => {
    const mockDepartments: Department[] = [
      { id: 1, name: 'Depto 1' },
      { id: 2, name: 'Depto 2' }
    ];
    service.getAllDepartments(true).subscribe(data => {
      expect(data).toEqual(mockDepartments);
    });
    const req = httpMock.expectOne(`${API_URL}?orderAsc=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should fetch all departments (orderAsc=false)', () => {
    const mockDepartments: Department[] = [
      { id: 2, name: 'Depto 2' },
      { id: 1, name: 'Depto 1' }
    ];
    service.getAllDepartments(false).subscribe(data => {
      expect(data).toEqual(mockDepartments);
    });
    const req = httpMock.expectOne(`${API_URL}?orderAsc=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should handle error on getAllDepartments', () => {
    service.getAllDepartments().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });
    const req = httpMock.expectOne(`${API_URL}?orderAsc=true`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
}); 