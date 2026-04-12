import { Component, inject, signal, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
export class Bookmarks implements OnInit, AfterViewInit, OnDestroy {
  private readonly _postService = inject(PostService);
  
  @ViewChild('scrollTracker') scrollTracker?: ElementRef;
  private _observer?: IntersectionObserver;

  public readonly posts = this._postService.posts;
  public readonly isLoading = signal<boolean>(false);
  public readonly hasMore = this._postService.hasMore;

  public ngOnInit(): void {
    this.initialLoad();
  }

  public ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  public ngOnDestroy(): void {
    this._observer?.disconnect();
  }

  public initialLoad(): void {
    this.loadBookmarks(1);
  }

  public loadBookmarks(page: number): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this._postService.getPosts([], true, page).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  private setupInfiniteScroll(): void {
    this._observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore() && !this.isLoading()) {
        this.loadBookmarks(this._postService.currentPage() + 1);
      }
    }, { threshold: 0.1 });

    if (this.scrollTracker) {
      this._observer.observe(this.scrollTracker.nativeElement);
    }
  }

  public trackById(index: number, item: any): number {
    return item.id;
  }
}
