import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-auth-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-field.html',
  styleUrl: './auth-field.css'
})
export class AuthField {
  public readonly id = input.required<string>();
  public readonly label = input.required<string>();
  public readonly type = input<string>('text');
  public readonly placeholder = input<string>('');
  public readonly control = input.required<FormControl>();

  public getErrorMessage(): string {
    const ctrl = this.control();
    if (ctrl.hasError('required')) return 'This field is required';
    if (ctrl.hasError('email')) return 'Invalid email address';
    if (ctrl.hasError('minlength')) return `Minimum length is ${ctrl.errors?.['minlength'].requiredLength}`;
    return '';
  }
}
