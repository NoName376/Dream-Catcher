import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public readonly menuItems = [
    { icon: '🌙', label: 'Feed', route: '/feed' },
    { icon: '👤', label: 'Profile', route: '/profile' },
    { icon: '🔖', label: 'Bookmarks', route: '/bookmarks' },
    { icon: '⚙️', label: 'Settings', route: '/settings' }
  ];

  public readonly genres = [
    { id: 'Nightmares', label: 'Nightmares', icon: '🌙' },
    { id: 'Lucid Dreaming', label: 'Lucid Dreaming', icon: '✨' },
    { id: 'Adventure', label: 'Adventure', icon: '🧭' },
    { id: 'Romance', label: 'Romance', icon: '💕' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🦄' },
    { id: 'Surrealism', label: 'Surrealism', icon: '🌀' },
    { id: 'Action', label: 'Action', icon: '💥' },
    { id: 'Liminal', label: 'Liminal', icon: '🚪' }
  ];

  public onLogout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
