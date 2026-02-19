import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage-service';
import { AuthSession } from '../model/auth-session';


@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private localStorageService = inject(StorageService);

  sessionActive = signal(this.isSessionActive());


  isSessionActive(): boolean {
    return this.localStorageService.isSessionActive();
  }

  login(email: string, pass: string) {
    const user = this.localStorageService.getUserByEmail(email);

    if(user && user.password === pass){
      const newSession: AuthSession = {
        userId: user.id,
        name: user.name,
        loginDate: new Date(),
      }
      this.localStorageService.saveUserSession(newSession);
      this.sessionActive.set(true)
    }
  }


  logOut() {
    this.sessionActive.set(false)
    this.localStorageService.clearSession();
  }


}
