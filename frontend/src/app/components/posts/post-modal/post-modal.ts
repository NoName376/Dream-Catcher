import { Component, ElementRef, input, output, viewChild, AfterViewInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../interfaces/post';
import { LikeButton } from '../../shared/ui/like-button/like-button';
import { SaveButton } from '../../shared/ui/save-button/save-button';
import { AuthService } from '../../../services/auth/auth';
import { PostService } from '../../../services/post/post';
import { PdfService } from '../../../services/pdf.service';
import { DeleteConfirmModalComponent } from '../../shared/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-post-modal',
  standalone: true,
  imports: [CommonModule, LikeButton, SaveButton, DeleteConfirmModalComponent],
  templateUrl: './post-modal.html',
  styleUrl: './post-modal.css'
})
export class PostModal implements AfterViewInit {
  private readonly _authService = inject(AuthService);
  private readonly _pdfService = inject(PdfService);
  private readonly _dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly post = input.required<IPost>();
  public readonly closed = output<void>();
  public readonly deleted = output<number>();

  public readonly isDeleteModalOpen = signal(false);
  public readonly showMenu = signal(false);

  public get isOwner(): boolean {
    const user = this._authService.currentUser();
    if (!user) return false;
    return user.id === this.post().author || user.username === this.post().author_username;
  }

  public ngAfterViewInit(): void {
    this._dialogRef().nativeElement.showModal();
  }

  public close(): void {
    this._dialogRef().nativeElement.close();
    this.closed.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement) === this._dialogRef().nativeElement) {
      this.close();
    }
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

  public openDeleteModal(event: Event): void {
    event.stopPropagation();
    this.isDeleteModalOpen.set(true);
    this.showMenu.set(false);
  }

  public closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
  }

  public onDeleteSuccess(): void {
    this.deleted.emit(this.post().id);
    this.close();
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.showMenu.set(false);
  }
}
