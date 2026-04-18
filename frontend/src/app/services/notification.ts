import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface INotification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<INotification[]>([]);
  public readonly notifications = this._notifications.asReadonly();

  public show(message: string, type: NotificationType = 'success'): void {
    const id = Date.now();
    const notification: INotification = { id, message, type };
    
    this._notifications.update(n => [...n, notification]);
    
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  public remove(id: number): void {
    this._notifications.update(n => n.filter(notif => notif.id !== id));
  }
}
