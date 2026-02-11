import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-login-widget',
  imports: [RouterLink],
  templateUrl: './login-widget.html',
  styleUrl: './login-widget.css',
})
export class LoginWidget {
  private storageService = inject(StorageService);
  public isAuthenticated = this.storageService.isSessionActive();
}
