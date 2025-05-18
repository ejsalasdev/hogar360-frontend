import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Department {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private propertyApiUrl = `${environment.propertyApiUrl}/api/v1/departments`;

  constructor(private http: HttpClient) {}

  getAllDepartments(orderAsc: boolean = true): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.propertyApiUrl}?orderAsc=${orderAsc}`);
  }
} 