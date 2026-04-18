import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../interfaces/post';
import { SocialService } from '../../../services/social/social';
import { PostService } from '../../../services/post/post';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  private readonly _postService = inject(PostService);
  private readonly _socialService = inject(SocialService);

  public readonly post = input.required<IPost>();

  public onLike(): void {
    const p = this.post();
    this._socialService.toggleLike(p.id).subscribe({
      next: (resp: { status: string }) => {
        const isLiked = resp.status === 'liked';
        this._postService.patchPostState(p.id, {
          is_liked: isLiked,
          likes_count: isLiked ? p.likes_count + 1 : p.likes_count - 1
        });
      }
    });
  }

  public onBookmark(): void {
    const p = this.post();
    this._socialService.toggleBookmark(p.id).subscribe({
      next: (resp: { status: string }) => {
        this._postService.patchPostState(p.id, {
          is_bookmarked: resp.status === 'saved'
        });
      }
    });
  }
}
