import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../interfaces/post';
import { SocialService } from '../../../services/social/social';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  private readonly _socialService = inject(SocialService);

  public readonly post = input.required<IPost>();
  public readonly liked = output<number>();
  public readonly bookmarked = output<number>();

  public onLike(): void {
    this._socialService.toggleLike(this.post().id).subscribe(() => {
      this.liked.emit(this.post().id);
    });
  }

  public onBookmark(): void {
    this._socialService.toggleBookmark(this.post().id).subscribe(() => {
      this.bookmarked.emit(this.post().id);
    });
  }
}
