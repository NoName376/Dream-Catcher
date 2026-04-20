import { Component, inject, input } from '@angular/core';
import { IPost } from '../../../../interfaces/post';
import { SocialService } from '../../../../services/social/social';
import { PostService } from '../../../../services/post/post';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [],
  templateUrl: './save-button.html',
  styleUrl: './save-button.css'
})
export class SaveButton {
  private readonly _socialService = inject(SocialService);
  private readonly _postService = inject(PostService);

  public readonly post = input.required<IPost>();

  public toggle(): void {
    const p = this.post();
    this._postService.patchPostState(p.id, { is_bookmarked: !p.is_bookmarked });
    this._socialService.toggleBookmark(p.id).subscribe({
      next: (resp: { status: string }) => {
        this._postService.patchPostState(p.id, {
          is_bookmarked: resp.status === 'saved',
        });
      },
      error: () => {
        this._postService.patchPostState(p.id, { is_bookmarked: p.is_bookmarked });
      },
    });
  }
}
