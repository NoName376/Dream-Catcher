import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post/post';
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

  public readonly content = signal<string>('');
  public readonly selectedTags = signal<string[]>([]);
  public readonly isSubmitting = signal<boolean>(false);

  public onTagsChanged(tags: string[]): void {
    this.selectedTags.set(tags);
  }

  public onSubmit(): void {
    if (this.content().trim()) {
      this.isSubmitting.set(true);
      this._postService.createPost(this.content(), this.selectedTags()).subscribe({
        next: () => {
          this.content.set('');
          this.isSubmitting.set(false);
          // The PostService updates the signal, so feed will auto-refresh
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }
}
