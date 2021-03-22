import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log(`saved: ${JSON.stringify(user)}`);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user === null) {
      return {};
    }

    return JSON.parse(user);
  }

  public getTokenData() {
    return jwtDecode(this.getToken()!);
  }
}
