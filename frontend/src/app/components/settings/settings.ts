import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  public readonly user = this._authService.currentUser;

  public onTogglePrivacy(): void {
    const currentUser = this.user();
    if (currentUser) {
      this._userService.updatePrivacy(!currentUser.is_private).subscribe();
    }
  }
}
