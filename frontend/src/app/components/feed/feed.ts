import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.html',
  styleUrl: './feed.css'
})
export class Feed {
  public readonly posts = [1, 2, 3, 4, 5]; // Placeholder for trackBy demo

  public trackById(index: number, item: any): number {
    return index;
  }
}
