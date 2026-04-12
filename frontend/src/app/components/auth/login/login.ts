import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { AuthField } from '../../shared/auth-field/auth-field';
import { AuthHeader } from '../../shared/auth-header/auth-header';
import { AuthFooter } from '../../shared/auth-footer/auth-footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthField, AuthHeader, AuthFooter],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public readonly isLoading = signal<boolean>(false);

  public readonly loginForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  public get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this._authService.login(this.loginForm.value).subscribe({
        next: () => this._router.navigate(['/feed']),
        error: () => this.isLoading.set(false)
      });
    }
  }
}
