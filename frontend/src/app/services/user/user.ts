import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IUser } from '../../interfaces/user';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _authService = inject(AuthService);
  private readonly _apiUrl = 'http://localhost:8000/api/auth';

  public updatePrivacy(is_private: boolean): Observable<IUser> {
    return this._http.patch<IUser>(`${this._apiUrl}/profile/`, { is_private }).pipe(
      tap((updatedUser) => {
        // Ideally, AuthService should have a method to update the signal
        // But since we can't change AuthService easily without risk, 
        // we'll rely on the signal being updated if AuthService handles profile fetches
        // Actually, AuthService has a getProfile() which sets the signal.
        this._authService.getProfile().subscribe();
      })
    );
  }

  public changePassword(password: string, confirmPassword: string): Observable<any> {
    return this._http.patch('http://localhost:8000/api/users/me/password/', { password, confirmPassword });
  }
}
