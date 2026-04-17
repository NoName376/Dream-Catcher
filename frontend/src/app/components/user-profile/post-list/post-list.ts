import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../interfaces/post';
import { PostCard } from '../../posts/post-card/post-card';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostCard],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  public readonly posts = input.required<IPost[]>();
  public readonly isLoading = input<boolean>(false);
  public readonly listChanged = output<void>();

  public onPostAction(): void {
    this.listChanged.emit();
  }
}
