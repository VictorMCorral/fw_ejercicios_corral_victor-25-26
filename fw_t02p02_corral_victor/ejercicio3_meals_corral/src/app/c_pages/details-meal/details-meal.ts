import { Component, inject, input, signal } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';


@Component({
  selector: 'app-details-meal',
  imports: [],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
})
export class DetailsMeal {
  private apiService = inject(ApiService);
  recetaSeleccionada = signal<MyMeal | null>(null);
  idReceta = input.required<number>();

  ngOnInit(){
    this.obtenerReceta();
  }

  async obtenerReceta(){
    const receta: MyMeal | null = await this.apiService.getMealDetails(this.idReceta());
    if (receta !== null){
      this.recetaSeleccionada.set(receta);
    }
  }
}
