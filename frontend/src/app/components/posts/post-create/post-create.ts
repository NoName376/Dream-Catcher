import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post/post';
import { NotificationService } from '../../../services/notification';
import { HashtagSelector } from '../hashtag-selector/hashtag-selector';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HashtagSelector],
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreate {
  private readonly _postService = inject(PostService);
  private readonly _notifService = inject(NotificationService);
  @ViewChild(HashtagSelector) hashtagSelector?: HashtagSelector;

  public readonly title = signal<string>('');
  public readonly content = signal<string>('');
  public readonly selectedTags = signal<string[]>([]);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly showHashtagWarning = signal<boolean>(false);

  public onTagsChanged(tags: string[]): void {
    this.selectedTags.set(tags);
    if (tags.length > 0) {
      this.showHashtagWarning.set(false);
    }
  }

  public onSubmit(): void {
    if (this.selectedTags().length === 0) {
      this.showHashtagWarning.set(true);
      return;
    }

    if (this.title().trim() && this.content().trim()) {
      this.isSubmitting.set(true);
      this._postService.createPost(this.title(), this.content(), this.selectedTags()).subscribe({
        next: () => {
          this.title.set('');
          this.content.set('');
          this.hashtagSelector?.reset();
          this.selectedTags.set([]);
          this.isSubmitting.set(false);
          this._notifService.show('Dream shared successfully! ✨');
        },
        error: () => {
          this.isSubmitting.set(false);
          this._notifService.show('Failed to share dream. 🌌', 'error');
        }
      });
    }
  }
}
