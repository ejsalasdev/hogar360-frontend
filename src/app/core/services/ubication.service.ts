import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';
import { PageInfo } from '../models/page-info.model';
import { UbicationResponse } from '../models/ubication-response.model';

export interface SaveUbicationRequest {
  sector: string;
  cityName: string;
  departmentName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbicationService {
  private propertyApiUrl = `${environment.propertyApiUrl}/api/v1/ubication`;

  constructor(private http: HttpClient) {}

  createUbication(request: SaveUbicationRequest): Observable<any> {
    return this.http.post(`${this.propertyApiUrl}/create`, request);
  }

  getUbications(
    page: number,
    size: number,
    orderAsc: boolean,
    sortBy: string = 'cityName',
    searchText: string = ''
  ): Observable<PageInfo<UbicationResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('orderAsc', orderAsc)
      .set('sortBy', sortBy);
    if (searchText) params = params.set('searchText', searchText);
    return this.http.get<PageInfo<UbicationResponse>>(`${this.propertyApiUrl}/read`, { params });
  }
}
