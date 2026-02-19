import { Component, inject, signal, input } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MyMeal } from '../../model/my-meal';
@Component({
  selector: 'app-details-save',
  imports: [],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})


export class DetailsSave {
  idReceta = input.required<number>();

  ngOnInit() {
    console.log("-----------" + this.idReceta())
  }

}
