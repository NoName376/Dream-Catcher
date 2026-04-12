import { Component, inject, signal, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post/post';
import { IHashtag } from '../../../interfaces/hashtag';

@Component({
  selector: 'app-hashtag-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hashtag-selector.html',
  styleUrl: './hashtag-selector.css'
})
export class HashtagSelector {
  private readonly _postService = inject(PostService);

  public readonly selectedHashtags = signal<string[]>([]);
  public readonly hashtagChanged = output<string[]>();
  
  public readonly hashtagInput = signal<string>('');
  public readonly suggestions = signal<IHashtag[]>([]);
  public readonly maxTags = 7;

  constructor() {
    this._postService.getTrendingHashtags().subscribe(tags => this.suggestions.set(tags));
    
    // Emit changes whenever the signal updates
    effect(() => {
      this.hashtagChanged.emit(this.selectedHashtags());
    });
  }

  public addHashtag(name: string): void {
    const cleanName = name.replace(/#/g, '').trim().toLowerCase();
    if (cleanName && !this.selectedHashtags().includes(cleanName) && this.selectedHashtags().length < this.maxTags) {
      this.selectedHashtags.update(tags => [...tags, cleanName]);
      this.hashtagInput.set('');
    }
  }

  public removeHashtag(name: string): void {
    this.selectedHashtags.update(tags => tags.filter(t => t !== name));
  }

  public onEnter(): void {
    this.addHashtag(this.hashtagInput());
  }
}
