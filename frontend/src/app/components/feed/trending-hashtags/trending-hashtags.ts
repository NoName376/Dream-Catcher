import { Component, inject, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post/post';
import { IHashtag } from '../../../interfaces/hashtag';

@Component({
  selector: 'app-trending-hashtags',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-hashtags.html',
  styleUrl: './trending-hashtags.css'
})
export class TrendingHashtags implements OnInit {
  private readonly _postService = inject(PostService);
  
  public readonly hashtags = signal<IHashtag[]>([]);
  public readonly hashtagSelected = output<string>();

  public ngOnInit(): void {
    this._postService.getTrendingHashtags().subscribe(tags => {
      this.hashtags.set(tags);
    });
  }

  public onSelect(name: string): void {
    this.hashtagSelected.emit(name);
  }
}
