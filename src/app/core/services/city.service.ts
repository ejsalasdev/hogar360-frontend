import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface City {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private propertyApiUrl = `${environment.propertyApiUrl}/api/v1/cities`;

  constructor(private http: HttpClient) {}

  getAllCities(orderAsc: boolean = true): Observable<City[]> {
    return this.http.get<City[]>(`${this.propertyApiUrl}?orderAsc=${orderAsc}`);
  }

  getCitiesByDepartment(departmentId: number, orderAsc: boolean = true): Observable<City[]> {
    return this.http.get<City[]>(`${this.propertyApiUrl}/departments/${departmentId}?orderAsc=${orderAsc}`);
  }
} 