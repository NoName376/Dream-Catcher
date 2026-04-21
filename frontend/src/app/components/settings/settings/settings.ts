import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { UserService } from '../../../services/user/user';
import { PasswordChange } from '../password-change/password-change';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PasswordChange],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);
  private readonly _notifService = inject(NotificationService);

  public readonly user = this._authService.currentUser;

  public onTogglePrivacy(): void {
    const currentUser = this.user();
    if (currentUser) {
      const newStatus = !currentUser.is_private;
      this._userService.updatePrivacy(newStatus).subscribe({
        next: () => {
          const msg = newStatus ? 'Dreams are now private' : 'Profile is now public';
          this._notifService.show(msg);
        },
        error: () => this._notifService.show('Failed to update privacy settings', 'error')
      });
    }
  }
}
