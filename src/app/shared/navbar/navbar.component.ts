import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn;
  userDisplayName = this.authService.userDisplayName;

  dropdownOpen = signal(false);

  toggleDropdown() {
    this.dropdownOpen.update(open => !open);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
