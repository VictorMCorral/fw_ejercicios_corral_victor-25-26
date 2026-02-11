import { Component, inject, Input, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsMeal } from "../details-meal/details-meal";
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-details',
  imports: [DetailsMeal],
  templateUrl: './details.html',
  styleUrl: './details.css',
})

export class Details {
  private storageService = inject(StorageService);
  public isAuthenticated = this.storageService.isSessionActive(); // más adelante vendrá de un AuthService

  idReceta: number =  0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idReceta = Number(this.route.snapshot.paramMap.get('id'));
  }

}
