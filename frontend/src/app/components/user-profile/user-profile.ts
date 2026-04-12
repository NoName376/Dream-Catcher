import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { AuthField } from '../shared/auth-field/auth-field';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthField],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);

  public readonly isUpdating = signal<boolean>(false);
  public readonly updateSuccess = signal<boolean>(false);

  public readonly profileForm = this._fb.group({
    username: [this._authService.currentUser()?.username || '', [Validators.required, Validators.minLength(3)]],
    firstName: [this._authService.currentUser()?.firstName || ''],
    lastName: [this._authService.currentUser()?.lastName || '']
  });

  public get usernameControl(): FormControl { return this.profileForm.get('username') as FormControl; }
  public get firstNameControl(): FormControl { return this.profileForm.get('firstName') as FormControl; }
  public get lastNameControl(): FormControl { return this.profileForm.get('lastName') as FormControl; }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      this.isUpdating.set(true);
      this.updateSuccess.set(false);
      this._authService.updateProfile(this.profileForm.value as any).subscribe({
        next: () => {
          this.isUpdating.set(false);
          this.updateSuccess.set(true);
        },
        error: () => this.isUpdating.set(false)
      });
    }
  }
}
