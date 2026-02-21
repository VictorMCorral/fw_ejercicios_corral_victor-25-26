import { Component, EventEmitter, inject, Output, signal, Input } from '@angular/core';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { Category } from '../../model/category';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../services/storage-service';
import { User } from '../../model/user';
import { UserMeal, statusUserMeal } from '../../model/user-meal';

@Component({
  selector: 'app-meals-category',
  imports: [],
  templateUrl: './meals-category.html',
  styleUrl: './meals-category.css',
})
export class MealsCategory {
  listaRecetas = signal<MyMeal[]>([]);
  categorias = signal<Category[]>([]);
  cargando = signal<boolean>(false);
  categoriaSeleccionada = signal<string>("");
  categoriaGuardar = signal<string>("btn btn-outline-primary w-100");
  @Output() saveMealsChangeOutput = new EventEmitter<boolean>();
  @Input() saveMealsChange = false;

  recetaCargada: MyMeal | null = null;

  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);

  public isAuthenticated = this.authService.sessionActive;

  ngOnInit() {
    this.loadCategories();
    this.cargando.set(true)
    if (this.isAuthenticated()) {
      const user: User | null = this.storageService.getUserSession();
      if (user && user.favoriteCategory) {
        console.log(user);
        this.categoriaSeleccionada.set(user.favoriteCategory);
        this.categoriaGuardar.set("btn btn-outline-primary w-100 active")
      }
    }

    this.loadWithCategorie(this.categoriaSeleccionada());
  }


  loadCategories() {
    let categorias = null;
    categorias = this.apiService.getCategories()
      .then(cats => {
        if (cats) {
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
    this.categoriaSeleccionada.set(valor);
    this.loadWithCategorie(valor);
  }

  async loadWithCategorie(category: string) {
    let recetas: MyMeal[] | null = null;
    if (this.categoriaSeleccionada() === "") {
      recetas = await this.apiService.get8RandomMeals()
      this.cargando.set(false);
    } else {
      recetas = await this.apiService.getMealsByCategory(category);
      this.cargando.set(false);
    }
    if (recetas) this.listaRecetas.set(recetas);
  }

  saveCategory() {
    this.storageService.saveCategory(this.categoriaSeleccionada());
    this.categoriaGuardar.set("btn btn-primary w-100 py-2-5 fw-bold shadow-sm active");
  


  }

  saveMeal(id: number) {
    const user = this.storageService.getUserSession();
    if (user) {
      const usersMeal: UserMeal = {
        userId: user.id,
        mealId: id,
        saveDate: new Date(),
        status: statusUserMeal.Todo,
      }
      if (!this.storageService.existsMealsInUser(user.id, id)) {
        this.storageService.saveUserMeals(usersMeal);
        this.saveMealsChangeOutput.emit(true);
      }
    }
  }
}
