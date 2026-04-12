import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css'
})
export class AuthHeader {
  public title = input.required<string>();
  public subtitle = input<string>('');
}
