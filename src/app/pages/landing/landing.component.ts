import { Component, inject, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Effect runs when isLoggedIn signal changes
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/listings']);
      }
    });
  }
}
