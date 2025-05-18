import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoryResponse } from '../models/category-response.model';
import { PageInfo } from '../models/page-info.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private propertyApiUrl = `${environment.propertyApiUrl}/api/v1/category`;

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.propertyApiUrl}/create`, category);
  }

  getCategories(page: number, size: number, orderAsc: boolean = true): Observable<PageInfo<CategoryResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('orderAsc', orderAsc);
    return this.http.get<PageInfo<CategoryResponse>>(`${this.propertyApiUrl}/read`, { params });
  }

  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.propertyApiUrl}/${id}`);
  }
}