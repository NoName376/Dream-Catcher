import { Component, inject, input, signal } from '@angular/core';
import { IPost } from '../../../interfaces/post';
import { PostService } from '../../../services/post/post';
import { PostModal } from '../post-modal/post-modal';
import { LikeButton } from '../../shared/ui/like-button/like-button';
import { SaveButton } from '../../shared/ui/save-button/save-button';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [PostModal, LikeButton, SaveButton],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  private readonly _postService = inject(PostService);

  public readonly post = input.required<IPost>();
  public readonly isModalOpen = signal(false);

  public livePost(): IPost {
    return this._postService.posts().find(p => p.id === this.post().id) ?? this.post();
  }

  public openModal(): void {
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }
}
