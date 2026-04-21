import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-stats.html',
  styleUrl: './user-stats.css'
})
export class UserStatsComponent implements OnInit {
  private readonly _postService = inject(PostService);
  private readonly _router = inject(Router);

  public stats = signal<any>(null);
  public loading = signal<boolean>(true);

  public ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.loading.set(true);
    this._postService.getStats().subscribe({
      next: (data) => {
        this.stats.set({
          top_categories: data.categories.slice(0, 3),
          top_hashtags: data.hashtags.slice(0, 5)
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  public getCategoryName(id: string): string {
    const names: Record<string, string> = {
      ordinary: 'Ordinary',
      nightmare: 'Nightmare',
      anxiety: 'Anxiety',
      erotic: 'Erotic',
      archetypal: 'Archetypal'
    };
    return names[id] || id;
  }

  public onHashtagClick(tag: string): void {
    this._router.navigate(['/feed'], { queryParams: { hashtags: tag } });
  }
}
