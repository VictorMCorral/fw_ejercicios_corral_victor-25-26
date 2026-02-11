import { Component, input, Input } from '@angular/core';
import { MyMeal } from '../../model/my-meal';


@Component({
  selector: 'app-meals-save',
  imports: [],
  templateUrl: './meals-save.html',
  styleUrl: './meals-save.css',
})
export class MealsSave {

  @Input() receta: MyMeal | null = null;;
}
