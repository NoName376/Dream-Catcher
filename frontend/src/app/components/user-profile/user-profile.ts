import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { PostService } from '../../services/post/post';
import { PostList } from './post-list/post-list';
import { IPost } from '../../interfaces/post';
import { PdfService } from '../../services/pdf.service';

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
  private readonly _pdfService = inject(PdfService);

  public readonly user = this._authService.currentUser;
  public readonly posts = this._postService.userPosts;
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
      this._postService.loadUserPosts(currentUser.username).subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });
    }
  }

  public onExportProfile(): void {
    const user = this.user();
    if (user && this.posts().length) {
      this._pdfService.exportProfile(this.posts(), user.username);
    }
  }
}
