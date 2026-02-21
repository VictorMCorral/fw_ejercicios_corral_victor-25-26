import { Component } from '@angular/core';
import { PlanWeekList } from "../plan-week-list/plan-week-list";
import { PlanWeekCreate } from "../plan-week-create/plan-week-create";

@Component({
  selector: 'app-plan-week',
  imports: [PlanWeekList, PlanWeekCreate],
  templateUrl: './plan-week.html',
  styleUrl: './plan-week.css',
})
export class PlanWeek {
  //TODO voy por los planes semanales, solo tengo la estructura html tanto del padre como de los hijos
  //USAR UserMiniMeal en lugar de UserMeal
  //EJEMPLO de imagen en miniatura:
  //"https://www.themealdb.com/images/media/meals/ll792x1505135249.jpg" + /preview
}
