import { Component, inject, signal, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post/post';
import { PostCreate } from '../posts/post-create/post-create';
import { PostCard } from '../posts/post-card/post-card';
import { TrendingHashtags } from './trending-hashtags/trending-hashtags';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCreate, PostCard, TrendingHashtags],
  templateUrl: './feed.html',
  styleUrl: './feed.css'
})
export class Feed implements OnInit, AfterViewInit, OnDestroy {
  private readonly _postService = inject(PostService);
  
  @ViewChild('scrollTracker') scrollTracker?: ElementRef;
  private _observer?: IntersectionObserver;

  public readonly posts = this._postService.posts;
  public readonly searchQuery = signal<string>('');
  public readonly isLoading = signal<boolean>(false);
  public readonly sortMode = signal<string>('newest');
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
    this.loadPosts(1);
  }

  public loadPosts(page: number): void {
    if (this.isLoading()) return;
    
    this.isLoading.set(true);
    if (page === 1) this._postService.posts; // Trigger read if needed, but not necessary
    
    const hashtags = this.searchQuery() 
      ? this.searchQuery().split(' ').map(h => h.trim().replace(/#/g, '')).filter(h => h)
      : [];
    
    this._postService.getPosts(hashtags, false, page, this.sortMode()).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  public onSortChange(mode: string): void {
    this.sortMode.set(mode);
    this.initialLoad();
  }

  public onSearch(): void {
    this.initialLoad();
  }

  public onHashtagSelect(name: string): void {
    this.searchQuery.set(name);
    this.initialLoad();
  }

  private setupInfiniteScroll(): void {
    this._observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore() && !this.isLoading()) {
        this.loadPosts(this._postService.currentPage() + 1);
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
