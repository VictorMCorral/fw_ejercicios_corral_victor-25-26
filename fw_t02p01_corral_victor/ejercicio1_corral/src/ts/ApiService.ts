import { MyMeal } from "./MyMeal.js";
import { UserMiniMeal } from "./UserMiniMeal.js";

export class ApiService {
    private API_URL: string;
    private API_KEY: string;

    constructor(apiUrl: string, apiKey: string = '') {
        this.API_URL = apiUrl
        this.API_KEY = apiKey;
    }

    async getRandomMeals(): Promise<MyMeal> {
        let url = `${this.API_URL}/${this.API_KEY}/random.php`;
        const response = await fetch(url);
        const data = await response.json();
        return this.toMyMeal(data.meals[0]);
    }

    async getMealDetails(idMeal: number): Promise<MyMeal> {
        const url = `${this.API_URL}/${this.API_KEY}/lookup.php?i=${idMeal}`;
        const response = await fetch(url);
        const data = await response.json();
        return this.toMyMeal(data.meals[0]);
    }

    async getCategories(): Promise<string[]> {
        const url = `${this.API_URL}/${this.API_KEY}/list.php?c=list`;
        const response = await fetch(url);
        const data = await response.json();
        const categorias: string[] = [];
        for (const meal of data.meals) {
            categorias.push(meal.strCategory);
        }
        return categorias;
    }

    async getMealsByCategory(categoria: string): Promise<UserMiniMeal[]> {
        const url = `${this.API_URL}/${this.API_KEY}/filter.php?c=${encodeURIComponent(categoria)}`;
        const response = await fetch(url);
        const data = await response.json();
        const mealsConvertidas: UserMiniMeal[] = [];
        for (const apiMeal of data.meals) {
            const mealConvertida: UserMiniMeal = {
                idMeal: Number(apiMeal.idMeal),
                name: apiMeal.strMeal,
                image_small: (apiMeal.strMealThumb || '').trim()
            };
            mealsConvertidas.push(mealConvertida);
        }
        return mealsConvertidas;
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