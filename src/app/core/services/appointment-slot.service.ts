import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentSlotService {
  private visitApiUrl = `${environment.apiUrl}/api/v1/appointmentslot`;

  constructor(private http: HttpClient) {}

  createAppointmentSlot(payload: {
    startTime: string;
    endTime: string;
    houseId: number;
  }): Observable<any> {
    return this.http.post(`${this.visitApiUrl}/create`, payload);
  }
}
