import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../models/house.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private propertyUrl = `${environment.propertyApiUrl}/api/v1/house`;

  constructor(private http: HttpClient) {}

  createHouse(house: House): Observable<any> {
    return this.http.post(`${this.propertyUrl}/create`, house);
  }
}
