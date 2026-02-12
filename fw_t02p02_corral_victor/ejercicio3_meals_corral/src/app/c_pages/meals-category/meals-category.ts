import { Component, inject, resource, signal } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { Category } from '../../model/category';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-meals-category',
  imports: [],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
})
export class MealsCategory {
  private apiService = inject(ApiService);
  authService = inject(AuthService).sessionActive();

  listaRecetas = signal<MyMeal[]>([]);
  public isAuthenticated = true; // más adelante vendrá de un AuthService
  categorias = signal<Category[]>([]);
  cargando = signal<boolean>(false);


  recetaCargada: MyMeal | null = null;
  categoriaSeleccionada = "";

  ngOnInit() {
    this.loadCategories();
    this.loadWithCategorie("");
  }


  loadCategories() {
    let categorias = null;
    categorias = this.apiService.getCategories()
        .then(cats => {
          if(cats) {
            this.categorias.set(cats);
          }
        })
        .catch(error => {
          console.error("Error al cargar las categorías:", error);
        });
  }

  onCategorieChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const valor = select.value;
    this.categoriaSeleccionada = valor;
    this.loadWithCategorie(valor);
  }

    async loadWithCategorie(category: string) {
    let recetas : MyMeal[] | null = null;
    if (this.categoriaSeleccionada === "") {
      recetas =  await this.apiService.get8RandomMeals()
      this.cargando.set(true);
    } else {
      recetas = await this.apiService.getMealsByCategory(category);
    }
    if(recetas) this.listaRecetas.set(recetas);
  }


}
