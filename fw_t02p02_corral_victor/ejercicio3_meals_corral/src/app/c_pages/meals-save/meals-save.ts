import { Component, inject, signal, Input, SimpleChanges } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../services/storage-service';
import { User } from '../../model/user';
import { UserMeal } from '../../model/user-meal';

@Component({
  selector: 'app-meals-save',
  imports: [],
  templateUrl: './meals-save.html',
  styleUrl: './meals-save.css',
})

export class MealsSave {
  listaRecetas = signal<MyMeal[]>([]);
  cargando = signal<boolean>(false);
  @Input() saveChanges: number = 0;

  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);

  public isAuthenticated = this.authService.sessionActive;

  ngOnInit() {
    this.cargando.set(true)
    if (this.isAuthenticated()) {
      this.obtenerRecetasUser();
    }
    if (this.saveChanges > 0) {
      this.obtenerRecetasUser();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveChanges'] && !changes['saveChanges'].firstChange) {
      this.obtenerRecetasUser();
    }
  }

  async obtenerRecetasUser() {
    const user: User | null = this.storageService.getUserSession() as User;
    try {
      const userMeals: UserMeal[] = this.storageService.getUserMeals(user.id) as UserMeal[];
      if (userMeals.length == 0) {
        this.cargando.set(false);
        return;
      }
      const idsMeals: number[] = [];
      userMeals.forEach(async userMeal => {
        idsMeals.push(userMeal.mealId)
      });
      const recetas = await this.apiService.getMultipleMeals(idsMeals) as MyMeal[];

      this.listaRecetas.set(recetas || []);

    } catch (error) {
      console.error("Error al obtener recetas del usuario: " + error);
      this.listaRecetas.set([]);
    } finally {

      this.cargando.set(false);
    }
  }

  deleteMeal(id: number) {
    this.storageService.deleteUserMeals(id);
    const recetas = this.listaRecetas().filter(receta => receta.idMeal != id);
    this.listaRecetas.set(recetas);
  }

  getRating(idMeal: number): number {
    const meal = this.storageService.getUserMealById(Number(idMeal));
    return meal?.rating || 0;
  }

}
