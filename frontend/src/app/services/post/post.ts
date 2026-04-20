import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { IPost } from '../../interfaces/post';
import { IHashtag } from '../../interfaces/hashtag';
import { AuthService } from '../auth/auth';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface IBackendPost {
  id: number;
  author: number;
  author_username: string;
  author_is_private: boolean;
  title: string;
  content: string;
  hashtag_names?: string[];
  hashtags?: { id: number; name: string }[];
  created_at: string;
  is_liked: boolean;
  is_bookmarked: boolean;
  likes_count: number;
}

interface IBackendHashtag {
  id: number;
  name: string;
  usage_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly _http = inject(HttpClient);
  private readonly _authService = inject(AuthService);
  private readonly _apiUrl = 'http://localhost:8000/api';

  private readonly _posts = signal<IPost[]>([]);
  public readonly posts = this._posts.asReadonly();

  private readonly _userPosts = signal<IPost[]>([]);
  public readonly userPosts = this._userPosts.asReadonly();
  
  public readonly hasMore = signal<boolean>(false);
  public readonly currentPage = signal<number>(1);

  private _fetchPosts(hashtags: string[] = [], bookmarks = false, page = 1, sort = 'newest', authorId?: number, authorUsername?: string): Observable<PaginatedResponse<IPost>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('sort', sort);

    if (bookmarks) params = params.set('bookmarks', 'true');
    if (authorId) params = params.set('author', authorId.toString());
    if (authorUsername) params = params.set('author_username', authorUsername);
    hashtags.forEach(h => params = params.append('hashtags', h));

    return this._http.get<PaginatedResponse<IPost>>(`${this._apiUrl}/posts/`, { params });
  }

  public getPosts(hashtags: string[] = [], bookmarks = false, page = 1, sort = 'newest', authorId?: number): Observable<PaginatedResponse<IPost>> {
    return this._fetchPosts(hashtags, bookmarks, page, sort, authorId).pipe(
      map(response => ({
        ...response,
        results: response.results.map(p => this._mapPost(p as any))
      })),
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

  public loadUserPosts(username: string, page = 1): Observable<PaginatedResponse<IPost>> {
    return this._fetchPosts([], false, page, 'newest', undefined, username).pipe(
      map(response => ({
        ...response,
        results: response.results.map(p => this._mapPost(p as any))
      })),
      tap(response => {
        if (page === 1) {
          this._userPosts.set(response.results);
        } else {
          this._userPosts.update(p => [...p, ...response.results]);
        }
      })
    );
  }

  public getUserPosts(username: string, page = 1): Observable<PaginatedResponse<IPost>> {
    return this.loadUserPosts(username, page);
  }

  public createPost(title: string, content: string, hashtag_names: string[]): Observable<IPost> {
    return this._http.post<IPost>(`${this._apiUrl}/posts/`, { title, content, hashtag_names }).pipe(
      map(p => this._mapPost(p as any)),
      tap(newPost => {
        this._posts.update(p => [newPost, ...p]);
      })
    );
  }

  public patchPostState(postId: number, updates: Partial<IPost>): void {
    const updateFn = (posts: IPost[]) => posts.map(p => p.id === postId ? { ...p, ...updates } : p);
    this._posts.update(updateFn);
    this._userPosts.update(updateFn);
  }

  private _mapPost(p: IBackendPost): IPost {
    const hashtags = p.hashtag_names || (p.hashtags ? p.hashtags.map(h => h.name) : []);

    return {
      id: p.id,
      author: p.author,
      author_username: p.author_username || 'Anonymous',
      author_is_private: !!p.author_is_private, 
      title: p.title || '',
      content: p.content || '',
      hashtag_names: hashtags,
      created_at: p.created_at,
      is_liked: !!p.is_liked,
      is_bookmarked: !!p.is_bookmarked,
      likes_count: p.likes_count || 0
    };
  }

  public getTrendingHashtags(): Observable<IHashtag[]> {
    return this._http.get<IBackendHashtag[]>(`${this._apiUrl}/hashtags/`).pipe(
      map(tags => tags.map(t => ({
        id: t.id,
        name: t.name,
        usageCount: t.usage_count
      })))
    );
  }
}
