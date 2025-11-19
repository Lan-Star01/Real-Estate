import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: any;
  loading = false;
  error: string | null = null;
  showPassword = false;

  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    const hasFieldError = !!(field && field.invalid && (field.dirty || field.touched));

    if (fieldName === 'password' && this.error) {
      return true;
    }

    return hasFieldError;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid email';
      if (field.errors['minlength']) {
        if (fieldName === 'email') return 'Email must contain at least 3 characters';
        if (fieldName === 'password') return 'Password must contain at least 3 characters';
      }
    }

    if (fieldName === 'password' && this.error) {
      return this.error;
    }

    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (userCredential) => {
        console.log('Login successful!', userCredential);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);

        switch (error.code) {
          case 'auth/user-not-found':
            this.error = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            this.error = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            this.error = 'Invalid email address';
            break;
          case 'auth/user-disabled':
            this.error = 'This account has been disabled';
            break;
          case 'auth/invalid-credential':
            this.error = 'Invalid email or password';
            break;
          default:
            this.error = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
