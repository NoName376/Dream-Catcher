import { Component, ElementRef, input, output, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../interfaces/post';
import { LikeButton } from '../../shared/ui/like-button/like-button';
import { SaveButton } from '../../shared/ui/save-button/save-button';

@Component({
  selector: 'app-post-modal',
  standalone: true,
  imports: [CommonModule, LikeButton, SaveButton],
  templateUrl: './post-modal.html',
  styleUrl: './post-modal.css'
})
export class PostModal implements AfterViewInit {
  private readonly _dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly post = input.required<IPost>();
  public readonly closed = output<void>();

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
}
