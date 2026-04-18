import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { AuthField } from '../../shared/auth-field/auth-field';
import { AuthHeader } from '../../shared/auth-header/auth-header';
import { AuthFooter } from '../../shared/auth-footer/auth-footer';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthField, AuthHeader, AuthFooter],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly registerForm = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: (group: any) => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return pass === confirmPass ? null : { passwordMismatch: true };
    }
  });

  public get usernameControl(): FormControl { return this.registerForm.get('username') as FormControl; }
  public get emailControl(): FormControl { return this.registerForm.get('email') as FormControl; }
  public get passwordControl(): FormControl { return this.registerForm.get('password') as FormControl; }
  public get confirmPasswordControl(): FormControl { return this.registerForm.get('confirmPassword') as FormControl; }

  public onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      const { username, email, password } = this.registerForm.value;
      this._authService.register({ username, email, password }).subscribe({
        next: () => this._router.navigate(['/feed']),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.error || 'Registration failed. Please try again.');
        }
      });
    }
  }
}
