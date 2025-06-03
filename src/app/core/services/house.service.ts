import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../models/house.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private propertyUrl = `${environment.apiUrl}/api/v1/house`;

  constructor(private http: HttpClient) {}

  createHouse(house: House): Observable<any> {
    return this.http.post(`${this.propertyUrl}/create`, house);
  }

  getHouses(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    categoryId?: number;
    ubicationId?: number;
    ubicationSearchText?: string;
    orderAsc?: boolean;
  } = {}): Observable<any> {
    const queryParams = [];
    if (params.page !== undefined) queryParams.push(`page=${params.page}`);
    if (params.size !== undefined) queryParams.push(`size=${params.size}`);
    if (params.sortBy) queryParams.push(`sortBy=${params.sortBy}`);
    if (params.ubicationSearchText) queryParams.push(`ubicationSearchText=${encodeURIComponent(params.ubicationSearchText)}`);
    if (params.orderAsc !== undefined) queryParams.push(`orderAsc=${params.orderAsc}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    return this.http.get(`${this.propertyUrl}/read${queryString}`);
  }
}
