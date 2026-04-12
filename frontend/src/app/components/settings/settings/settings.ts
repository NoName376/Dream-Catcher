import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../user-profile/user-profile';
import { Security } from '../security/security';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, UserProfile, Security],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {}
