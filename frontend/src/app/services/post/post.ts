import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IPost } from '../../interfaces/post';
import { IHashtag } from '../../interfaces/hashtag';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8000/api';

  private readonly _posts = signal<IPost[]>([]);
  public readonly posts = this._posts.asReadonly();
  
  public readonly hasMore = signal<boolean>(false);
  public readonly currentPage = signal<number>(1);

  public getPosts(hashtags: string[] = [], bookmarks = false, page = 1, sort = 'newest', authorId?: number): Observable<PaginatedResponse<IPost>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('sort', sort);

    if (bookmarks) params = params.set('bookmarks', 'true');
    if (authorId) params = params.set('author', authorId.toString());
    hashtags.forEach(h => params = params.append('hashtags', h));

    return this._http.get<PaginatedResponse<IPost>>(`${this._apiUrl}/posts/`, { params }).pipe(
      tap(response => {
        if (page === 1) {
          this._posts.set(response.results);
        } else {
          this._posts.update(p => [...p, ...response.results]);
        }
        this.hasMore.set(!!response.next);
        this.currentPage.set(page);
      })
    );
  }

  public createPost(content: string, hashtagNames: string[]): Observable<IPost> {
    return this._http.post<IPost>(`${this._apiUrl}/posts/`, { content, hashtagNames }).pipe(
      tap(newPost => {
        // Prepend new post to the top immediately
        this._posts.update(p => [newPost, ...p]);
      })
    );
  }

  public getTrendingHashtags(): Observable<IHashtag[]> {
    return this._http.get<IHashtag[]>(`${this._apiUrl}/hashtags/`);
  }
}
