import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post/post';
import { PostCard } from '../posts/post-card/post-card';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, PostCard],
  templateUrl: './bookmarks.html',
  styleUrl: './bookmarks.css'
})
export class Bookmarks implements OnInit {
  private readonly _postService = inject(PostService);

  public readonly posts = this._postService.posts;
  public readonly isLoading = signal<boolean>(false);

  public ngOnInit(): void {
    this.loadBookmarks();
  }

  public loadBookmarks(): void {
    this.isLoading.set(true);
    this._postService.getPosts([], true).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  public trackById(index: number, item: any): number {
    return item.id;
  }
}
