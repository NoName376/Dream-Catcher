import { Component, inject, input } from '@angular/core';
import { IPost } from '../../../../interfaces/post';
import { SocialService } from '../../../../services/social/social';
import { PostService } from '../../../../services/post/post';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [],
  templateUrl: './like-button.html',
  styleUrl: './like-button.css'
})
export class LikeButton {
  private readonly _socialService = inject(SocialService);
  private readonly _postService = inject(PostService);

  public readonly post = input.required<IPost>();

  public toggle(): void {
    const p = this.post();
    this._postService.patchPostState(p.id, {
      is_liked: !p.is_liked,
      likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
    });
    this._socialService.toggleLike(p.id).subscribe({
      next: (resp: { status: string }) => {
        const isLiked = resp.status === 'liked';
        this._postService.patchPostState(p.id, {
          is_liked: isLiked,
          likes_count: isLiked ? p.likes_count + 1 : p.likes_count - 1,
        });
      },
      error: () => {
        this._postService.patchPostState(p.id, {
          is_liked: p.is_liked,
          likes_count: p.likes_count,
        });
      },
    });
  }
}
