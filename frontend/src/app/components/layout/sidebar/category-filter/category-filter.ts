import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../../services/post/post';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.css'
})
export class CategoryFilterComponent {
  private readonly _postService = inject(PostService);
  
  public readonly selectedCategory = this._postService.selectedCategory;

  public categories = [
    { id: 'ordinary', name: 'Ordinary', icon: '' },
    { id: 'nightmare', name: 'Nightmares', icon: '' },
    { id: 'anxiety', name: 'Anxiety Dreams', icon: '' },
    { id: 'erotic', name: 'Erotic Dreams', icon: '' },
    { id: 'archetypal', name: 'Archetypal Dreams', icon: '' }
  ];

  public selectCategory(id: string | null): void {
    this._postService.setCategory(id);
  }
}
