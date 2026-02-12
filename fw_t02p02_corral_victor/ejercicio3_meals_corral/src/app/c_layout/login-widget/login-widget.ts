import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-widget',
  imports: [RouterLink],
  templateUrl: './login-widget.html',
  styleUrl: './login-widget.css',
})
export class LoginWidget {
  authService = inject(AuthService)
  private router = inject(Router);


  public onLogout() {
    this.authService.logOut();
    if (!this.authService.sessionActive()) {
      this.router.navigate(["/"])
    }
  }
}
