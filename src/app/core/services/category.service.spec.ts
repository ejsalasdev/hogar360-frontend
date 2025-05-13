import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete a category by id', () => {
    const id = 123;
    const mockResponse = { message: 'Category deleted successfully' };

    service.deleteCategory(id).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should get categories with default parameters', () => {
    service.getCategories(0, 10, true).subscribe();
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url.includes('/api/v1/category/read') &&
      r.params.get('page') === '0' &&
      r.params.get('size') === '10' &&
      r.params.get('orderAsc') === 'true'
    );
    expect(req).toBeTruthy();
    req.flush({});
  });

  it('should get categories with custom parameters', () => {
    service.getCategories(2, 20, false).subscribe();
    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url.includes('/api/v1/category/read') &&
      r.params.get('page') === '2' &&
      r.params.get('size') === '20' &&
      r.params.get('orderAsc') === 'false'
    );
    expect(req).toBeTruthy();
    req.flush({});
  });

});