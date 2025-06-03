import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = `${environment.apiUrl}/api/v1/user`;

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<any> {
    return this.http.post(`${this.userApiUrl}/create`, user);
  }
}
