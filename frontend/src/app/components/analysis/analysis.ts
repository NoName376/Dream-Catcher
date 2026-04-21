import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css'
})
export class AnalysisComponent implements OnInit {
  private readonly _postService = inject(PostService);
  private readonly _router = inject(Router);

  public readonly stats = signal<any>(null);
  public readonly loading = signal<boolean>(false);
  
  public readonly selectedYear = signal<number>(new Date().getFullYear());
  public readonly selectedMonth = signal<number | null>(null);

  public readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  public readonly months = [
    { id: 1, name: 'January' }, { id: 2, name: 'February' }, { id: 3, name: 'March' },
    { id: 4, name: 'April' }, { id: 5, name: 'May' }, { id: 6, name: 'June' },
    { id: 7, name: 'July' }, { id: 8, name: 'August' }, { id: 9, name: 'September' },
    { id: 10, name: 'October' }, { id: 11, name: 'November' }, { id: 12, name: 'December' }
  ];

  public ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.loading.set(true);
    const year = this.selectedYear();
    const month = this.selectedMonth();

    this._postService.getStats(year, month || undefined).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  public onFilterChange(): void {
    this.loadStats();
  }

  public getCategoryName(id: string): string {
    const names: Record<string, string> = {
      ordinary: 'Ordinary',
      nightmare: 'Nightmares',
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
