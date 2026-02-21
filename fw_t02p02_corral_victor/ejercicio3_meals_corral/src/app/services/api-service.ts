import { Injectable } from '@angular/core';
import { MyMeal } from '../model/my-meal';
import { UserMiniMeal } from '../model/user-mini-meal';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private API_URL: string;
  private API_KEY: string;

  constructor() {
    this.API_URL = "https://www.themealdb.com/api/json/v1"
    this.API_KEY = "1";
  }

  async getRandomMeals(): Promise<MyMeal | null> {
    let recetasConvertidas: MyMeal | null = null;
    try {
      let url = `${this.API_URL}/${this.API_KEY}/random.php`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        recetasConvertidas = this.toMyMeal(data.meals[0]);
      }
    } catch (error) {
      console.error("Error al obtener la receta aleatoria:", error);
      throw error;
    }

    return recetasConvertidas;
  }

  async get8RandomMeals(): Promise<MyMeal[] | null> {
    let meals: MyMeal[] = [];
    for (let i = 0; i < 8; i++) {
      const meal = await this.getRandomMeals();
      if (meal) {
        meals.push(meal);
      }
    }

    if (meals.length === 0) return null;
    return meals.length > 0 ? meals : null;
  }

  async getMultipleMeals(id: number[]): Promise<MyMeal[] | null>{
    let meals: MyMeal[] = [];
    for (let i = 0; i < id.length; i++) {
      const meal = await this.getMealDetails(id[i]);
      if (meal) {
        meals.push(meal);
      }
    }

    if (meals.length === 0) return null;
    return meals.length > 0 ? meals : null;
  }

  async getMealDetails(idMeal: number): Promise<MyMeal | null> {
    let receta: MyMeal | null = null;
    try {
      const url = `${this.API_URL}/${this.API_KEY}/lookup.php?i=${idMeal}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        receta = this.toMyMeal(data.meals[0]);
      }
      return receta;
    } catch (error) {
      console.error("Error al obtener los detalles de la receta:", error);
      return null;
    }

  }

  async getCategories(): Promise<string[] | null> {
    let categorias: string[] = [];

    try {
      const url = `${this.API_URL}/${this.API_KEY}/list.php?c=list`;
      const response = await fetch(url);
      const data = await response.json();
      for (const meal of data.meals) {
        categorias.push(meal.strCategory);
      }
      return categorias;

    } catch (error) {

      console.error("Error al obtener las categorías:", error);
      return null;
    }
  }

  async getMealsByCategory(categoria: string): Promise<MyMeal[] | null> {
    const meals: MyMeal[] = [];
    const resultado: number[] = [];
    let idMeals: number[] = [];

    try {
      const url = `${this.API_URL}/${this.API_KEY}/filter.php?c=${categoria}`;
      const response = await fetch(url);
      const data = await response.json();
      idMeals = data.meals.map((meal: any) => meal.idMeal);

    } catch (error) {
      console.error("Error al obtener las recetas por categoría:", error);
      return null;
    }

    while (resultado.length < 8 && resultado.length < idMeals.length) {
      const numero = Math.floor(Math.random() * idMeals.length);
      if (!resultado.includes(numero)) {
        resultado.push(numero);
      }
    }

    for (const numero of resultado) {
      const receta: MyMeal | null = await this.getMealDetails(idMeals[numero]);

      if (receta) {
        meals.push(receta);
      }
    }

    return meals;
  }

  private toMyMeal(apiMeal: any): MyMeal {
    return {
      idMeal: Number(apiMeal.idMeal),
      strMeal: apiMeal.strMeal,
      strCategory: apiMeal.strCategory,
      strArea: apiMeal.strArea,
      strMealThumb: (apiMeal.strMealThumb || '').trim(),
      ingredients: this.convertirIngredientes(apiMeal)
    };
  }

  private convertirIngredientes(apiMeal: any): { name: string; measure: string }[] {
    const ingredients: { name: string; measure: string }[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredientName = apiMeal[`strIngredient${i}`];
      const measure = apiMeal[`strMeasure${i}`];

      if (ingredientName && ingredientName.trim() !== '') {
        ingredients.push({
          name: ingredientName.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients
  }
}
