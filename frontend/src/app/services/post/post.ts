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
    const currentUser = this._authService.currentUser();
    
    return this._fetchPosts(hashtags, bookmarks, page, sort, authorId).pipe(
      tap(response => {
        // Frontend filtering as requested
        const filteredResults = response.results.filter(post => {
          if (!post.author_is_private) return true;
          return post.author === currentUser?.id;
        });

        if (page === 1) {
          this._posts.set(filteredResults);
        } else {
          this._posts.update(p => [...p, ...filteredResults]);
        }
        this.hasMore.set(!!response.next);
        this.currentPage.set(page);
        
        return {
          ...response,
          results: mappedResults
        } as PaginatedResponse<IPost>;
      })
    );
  }

  public loadUserPosts(username: string, page = 1): Observable<PaginatedResponse<IPost>> {
    return this._fetchPosts([], false, page, 'newest', undefined, username).pipe(
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

  public createPost(content: string, hashtag_names: string[]): Observable<IPost> {
    return this._http.post<IPost>(`${this._apiUrl}/posts/`, { content, hashtag_names }).pipe(
      tap(newPost => {
        // Prepend new post to the top immediately
        this._posts.update(p => [newPost, ...p]);
      })
    );
  }

  public patchPostState(postId: number, updates: Partial<IPost>): void {
    this._posts.update(posts => 
      posts.map(p => p.id === postId ? { ...p, ...updates } : p)
    );
  }

  private _mapPost(p: IBackendPost): IPost {
    // Attempt to extract hashtags from both potential formats
    const hashtags = p.hashtag_names || (p.hashtags ? p.hashtags.map(h => h.name) : []);

    return {
      id: p.id,
      author: p.author,
      authorUsername: p.author_username || 'Anonymous',
      content: p.content || '',
      hashtagNames: hashtags,
      createdAt: p.created_at,
      isLiked: !!p.is_liked,
      isBookmarked: !!p.is_bookmarked,
      likesCount: p.likes_count || 0
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
