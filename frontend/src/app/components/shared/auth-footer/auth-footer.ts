import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-footer.html',
  styleUrl: './auth-footer.css'
})
export class AuthFooter {
  public readonly text = input.required<string>();
  public readonly linkText = input.required<string>();
  public readonly linkRoute = input.required<string>();
}
