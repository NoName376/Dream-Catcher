import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { PostService } from '../../services/post/post';
import { PostList } from './post-list/post-list';
import { IPost } from '../../interfaces/post';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, PostList],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {
  private readonly _authService = inject(AuthService);
  private readonly _postService = inject(PostService);

  public readonly user = this._authService.currentUser;
  public readonly posts = signal<IPost[]>([]);
  public readonly isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.user()) {
        this.loadUserPosts();
      }
    });
  }

  public loadUserPosts(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.isLoading.set(true);
      this._postService.getPosts([], false, 1, 'newest', currentUser.id).subscribe({
        next: (response) => {
          this.posts.set(response.results);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
}
