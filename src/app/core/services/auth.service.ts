import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  user,
  authState,
  idToken
} from '@angular/fire/auth';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);
  authState$ = authState(this.auth);
  idToken$ = idToken(this.auth);

  constructor() { }

  register(data: RegisterData): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    ).then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`
      });
    });

    return from(promise);
  }

  login(data: LoginData): Observable<any> {
    const promise = signInWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    );

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });

    return from(promise);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        return await currentUser.getIdToken();
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    return null;
  }

  async getIdTokenRefresh(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        return await currentUser.getIdToken(true);
      } catch (error) {
        console.error('Error refreshing ID token:', error);
        return null;
      }
    }
    return null;
  }
}
