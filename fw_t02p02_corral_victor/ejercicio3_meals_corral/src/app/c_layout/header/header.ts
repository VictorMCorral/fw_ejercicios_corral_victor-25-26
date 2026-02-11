import { Component, inject } from '@angular/core';
import { LoginWidget } from '../login-widget/login-widget';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-header',
  imports: [LoginWidget],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
