import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8000/api/auth';

  public updatePassword(data: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/password/`, data);
  }

  public updateProfile(data: any): Observable<any> {
    return this._http.patch(`${this._apiUrl}/profile/`, data);
  }
}
