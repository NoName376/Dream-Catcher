import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notif of notifications(); track notif.id) {
        <div class="notification" [class]="notif.type">
          <span class="icon">{{ notif.type === 'success' ? '✨' : '🌌' }}</span>
          <span class="message">{{ notif.message }}</span>
          <button (click)="remove(notif.id)" class="close-btn">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .notification {
      min-width: 300px;
      padding: 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .notification.success { border-left: 4px solid #71b280; }
    .notification.error { border-left: 4px solid #ff4b2b; }
    .icon { font-size: 1.2rem; }
    .message { flex: 1; font-weight: 500; }
    .close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class Notification {
  private readonly _notificationService = inject(NotificationService);
  public readonly notifications = this._notificationService.notifications;

  public remove(id: number): void {
    this._notificationService.remove(id);
  }
}
