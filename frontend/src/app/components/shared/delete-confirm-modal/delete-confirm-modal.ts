import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post/post';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: './delete-confirm-modal.css'
})
export class DeleteConfirmModalComponent {
  private readonly _postService = inject(PostService);
  private readonly _notifService = inject(NotificationService);

  public readonly postId = input.required<number>();
  public readonly postTitle = input.required<string>();
  
  public readonly close = output<void>();
  public readonly deleted = output<number>();

  public readonly isDeleting = signal(false);

  public onCancel(): void {
    if (!this.isDeleting()) {
      this.close.emit();
    }
  }

  public onConfirm(): void {
    this.isDeleting.set(true);
    this._postService.deletePost(this.postId()).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this._notifService.show('Dream released to the void.');
        this.deleted.emit(this.postId());
        this.close.emit();
      },
      error: () => {
        this.isDeleting.set(false);
        this._notifService.show('Failed to delete dream. It haunts you still.', 'error');
      }
    });
  }
}
