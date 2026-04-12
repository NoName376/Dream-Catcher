import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8000/api/posts';

  public toggleLike(postId: number): Observable<any> {
    return this._http.post(`${this._apiUrl}/${postId}/like/`, {});
  }

  public toggleBookmark(postId: number): Observable<any> {
    return this._http.post(`${this._apiUrl}/${postId}/bookmark/`, {});
  }
}
