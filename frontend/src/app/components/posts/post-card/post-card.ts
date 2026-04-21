import { Component, inject, input, signal, HostListener } from '@angular/core';
import { IPost } from '../../../interfaces/post';
import { PostService } from '../../../services/post/post';
import { PostModal } from '../post-modal/post-modal';
import { LikeButton } from '../../shared/ui/like-button/like-button';
import { SaveButton } from '../../shared/ui/save-button/save-button';
import { AuthService } from '../../../services/auth/auth';
import { DeleteConfirmModalComponent } from '../../shared/delete-confirm-modal/delete-confirm-modal';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [PostModal, LikeButton, SaveButton, DeleteConfirmModalComponent],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  private readonly _authService = inject(AuthService);
  private readonly _postService = inject(PostService);
  private readonly _pdfService = inject(PdfService);

  public readonly post = input.required<IPost>();
  public readonly isModalOpen = signal(false);
  public readonly isDeleteModalOpen = signal(false);
  public readonly isDeleted = signal(false);
  public readonly showMenu = signal(false);

  public get isOwner(): boolean {
    const user = this._authService.currentUser();
    if (!user) return false;
    return user.id === this.post().author || user.username === this.post().author_username;
  }

  public livePost(): IPost {
    return this._postService.posts().find(p => p.id === this.post().id) ?? this.post();
  }

  public openModal(): void {
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }

  public openDeleteModal(event: Event): void {
    event.stopPropagation();
    this.isDeleteModalOpen.set(true);
  }

  public closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
  }

  public onExport(event: Event): void {
    event.stopPropagation();
    this._pdfService.exportPost(this.post());
    this.showMenu.set(false);
  }

  public toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu.update(v => !v);
  }

  public closeMenu(): void {
    this.showMenu.set(false);
  }

  public onDeleteSuccess(): void {
    this.isDeleted.set(true);
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeMenu();
  }
}
