import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IAuthResponse, IUser } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8000/api/auth';

  private readonly _currentUser = signal<IUser | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();

  private readonly _isAuthenticated = signal<boolean>(this._hasToken());
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();

  public register(data: any): Observable<IAuthResponse> {
    return this._http.post<IAuthResponse>(`${this._apiUrl}/register/`, data).pipe(
      tap((res) => this._handleAuthSuccess(res))
    );
  }

  public login(data: any): Observable<IAuthResponse> {
    return this._http.post<IAuthResponse>(`${this._apiUrl}/login/`, data).pipe(
      tap((res) => this._handleAuthSuccess(res))
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
  }

  public updateProfile(data: Partial<IUser>): Observable<IUser> {
    return this._http.patch<IUser>(`${this._apiUrl}/profile/`, data).pipe(
      tap((user) => this._currentUser.set(user))
    );
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private _hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private _handleAuthSuccess(response: IAuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    this._isAuthenticated.set(true);
  }
}
