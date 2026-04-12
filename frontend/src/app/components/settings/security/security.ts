import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings';
import { AuthField } from '../../shared/auth-field/auth-field';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthField],
  templateUrl: './security.html',
  styleUrl: './security.css'
})
export class Security {
  private readonly _fb = inject(FormBuilder);
  private readonly _settingsService = inject(SettingsService);

  public readonly isUpdating = signal<boolean>(false);
  public readonly updateSuccess = signal<string>('');
  public readonly updateError = signal<string>('');

  public readonly passwordForm = this._fb.group({
    old_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public get oldPasswordControl(): FormControl { return this.passwordForm.get('old_password') as FormControl; }
  public get newPasswordControl(): FormControl { return this.passwordForm.get('new_password') as FormControl; }

  public onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isUpdating.set(true);
      this.updateSuccess.set('');
      this.updateError.set('');

      this._settingsService.updatePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.isUpdating.set(false);
          this.updateSuccess.set('Password updated successfully');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.isUpdating.set(false);
          this.updateError.set(err.error?.error || 'Failed to update password');
        }
      });
    }
  }
}
