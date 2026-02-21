import { Component, inject, Input, input, signal, Output, EventEmitter } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { StorageService } from '../../services/storage-service';
import { UserMeal, statusUserMeal } from '../../model/user-meal';


@Component({
  selector: 'app-details-meal',
  imports: [],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
})
export class DetailsMeal {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  recetaSeleccionada = signal<MyMeal | null>(null);
  idReceta = input.required<number>();
  @Output() isSavedOutput = new EventEmitter<boolean>();
  @Input() isSaved = false;


  ngOnInit() {
    this.obtenerReceta();

  }

  async obtenerReceta() {
    const receta: MyMeal | null = await this.apiService.getMealDetails(this.idReceta());
    if (receta !== null) {
      this.recetaSeleccionada.set(receta);
    }
  }

  guardarReceta() {
    const user = this.storageService.getUserSession();
    if (user) {
      const usersMeal: UserMeal = {
        userId: user.id,
        mealId: this.idReceta(),
        saveDate: new Date(),
        status: statusUserMeal.Todo,
      }
      if(!this.storageService.existsMealsInUser(user.id, this.idReceta())){
        this.storageService.saveUserMeals(usersMeal);
        this.isSavedOutput.emit(true);
      }
    }
  }

  eliminarReceta() {
    this.storageService.deleteUserMeals(this.idReceta());
    this.isSavedOutput.emit(false);
  }
}
