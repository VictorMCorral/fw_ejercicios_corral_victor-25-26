import { Component, inject, Input, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsMeal } from "../details-meal/details-meal";


@Component({
  selector: 'app-details',
  imports: [DetailsMeal],
  templateUrl: './details.html',
  styleUrl: './details.css',
})

export class Details {
  public isAuthenticated = true; // más adelante vendrá de un AuthService

  idReceta: number =0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idReceta = Number(this.route.snapshot.paramMap.get('id'));
  }

}
