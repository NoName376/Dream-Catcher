import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IPost } from '../../interfaces/post';
import { IHashtag } from '../../interfaces/hashtag';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8000/api';

  private readonly _posts = signal<IPost[]>([]);
  public readonly posts = this._posts.asReadonly();

  public getPosts(hashtags: string[] = [], bookmarks = false): Observable<IPost[]> {
    let params = new HttpParams();
    if (bookmarks) params = params.set('bookmarks', 'true');
    hashtags.forEach(h => params = params.append('hashtags', h));

    return this._http.get<IPost[]>(`${this._apiUrl}/posts/`, { params }).pipe(
      tap(posts => this._posts.set(posts))
    );
  }

  public createPost(content: string, hashtagNames: string[]): Observable<IPost> {
    return this._http.post<IPost>(`${this._apiUrl}/posts/`, { content, hashtagNames }).pipe(
      tap(newPost => {
        this._posts.update(p => [newPost, ...p]);
      })
    );
  }

  public getTrendingHashtags(): Observable<IHashtag[]> {
    return this._http.get<IHashtag[]>(`${this._apiUrl}/hashtags/`);
  }
}
