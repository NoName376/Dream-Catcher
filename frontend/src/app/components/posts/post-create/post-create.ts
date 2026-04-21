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
  public readonly selectedGenre = signal<string>('');
  public readonly isSubmitting = signal<boolean>(false);
  public readonly showHashtagWarning = signal<boolean>(false);
  public readonly genres = [
    { id: 'Nightmares', label: 'Nightmares', icon: '🌙' },
    { id: 'Lucid Dreaming', label: 'Lucid Dreaming', icon: '✨' },
    { id: 'Adventure', label: 'Adventure', icon: '🧭' },
    { id: 'Romance', label: 'Romance', icon: '💕' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🦄' },
    { id: 'Surrealism', label: 'Surrealism', icon: '🌀' },
    { id: 'Action', label: 'Action', icon: '💥' },
    { id: 'Liminal', label: 'Liminal', icon: '🚪' }
  ];

  public selectGenre(id: string): void {
    if (this.selectedGenre() === id) {
      this.selectedGenre.set('');
    } else {
      this.selectedGenre.set(id);
    }
  }

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

    const postData = {
      title: this.title(),
      content: this.content(),
      hashtag_names: this.selectedTags(),
      genre: this.selectedGenre()
    };

    if (this.content().trim()) {
      console.log("ОТПРАВЛЯЕМЫЕ ДАННЫЕ:", postData);
      this.isSubmitting.set(true);
      this._postService.createPost(postData.title, postData.content, postData.hashtag_names, postData.genre).subscribe({
        next: () => {
          this.title.set('');
          this.content.set('');
          this.selectedGenre.set('');
          this.hashtagSelector?.reset();
          this.selectedTags.set([]);
          this.isSubmitting.set(false);
          this._notifService.show('Dream shared successfully! ✨');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error("Ошибка сервера:", err.error || err);
          this._notifService.show('Failed to share dream. 🌌', 'error');
        }
      });
    } else {
      console.warn("Content is empty, skipping submission.");
    }
  }
}
