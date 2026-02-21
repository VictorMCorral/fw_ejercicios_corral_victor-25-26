import { Component, inject, signal } from '@angular/core';
import { MealsCategory } from '../meals-category/meals-category';
import { MealsSave } from '../meals-save/meals-save';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [MealsCategory, MealsSave],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private authService = inject(AuthService);
  public isAuthenticated = this.authService.sessionActive;
  public saveChanges = signal<number>(0);


  actualizarFavoritos() {
    let valorAnterior = this.saveChanges();
    valorAnterior ++;
    this.saveChanges.set(valorAnterior);
  }
}
