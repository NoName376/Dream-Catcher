import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-change.html',
  styleUrl: './password-change.css',
})
export class PasswordChange {
  private readonly _userService = inject(UserService);

  public readonly password = signal('');
  public readonly confirmPassword = signal('');
  public readonly isSubmitting = signal(false);
  public readonly errorMessage = signal('');
  public readonly successMessage = signal('');

  public readonly isValid = computed(() => {
    const p = this.password();
    const cp = this.confirmPassword();
    return p.length >= 6 && p === cp;
  });

  public onSubmit(): void {
    if (this.isValid()) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      this._userService.changePassword(this.password(), this.confirmPassword()).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('Password updated successfully');
          this.password.set('');
          this.confirmPassword.set('');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Failed to update password');
        }
      });
    }
  }
}
