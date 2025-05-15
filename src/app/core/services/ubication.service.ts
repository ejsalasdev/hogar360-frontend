import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

export interface SaveUbicationRequest {
  sector: string;
  cityName: string;
  departmentName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbicationService {
  private apiUrl = `${environment.apiUrl}/api/v1/ubication`;

  constructor(private http: HttpClient) {}

  createUbication(request: SaveUbicationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, request);
  }
}
