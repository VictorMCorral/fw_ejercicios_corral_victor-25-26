export class ApiService {
    private API_URL: string;
    private API_KEY: string;

    constructor(apiUrl: string, apiKey: string = '') {
        this.API_URL = apiUrl;
        this.API_KEY = apiKey;
    }

    //TODO repasar los metodos
    async getRandomMeals(category?: string): Promise<MealSummary[]> {
        let url = `${this.API_URL}/random.php`;
        if (category) {
            // Filtrar por categoría requiere obtener primero por categoría y luego aleatorio
            const meals = await this.getMealsByCategory(category);
            return meals.sort(() => 0.5 - Math.random()).slice(0, 1); // Devuelve 1 aleatoria
        }

        const response = await fetch(url);
        const data = await response.json();
        return data.meals;
    }

    async getMealsByIngredient(ingredient: string): Promise<MealSummary[]> {
        const url = `${this.API_URL}/filter.php?i=${encodeURIComponent(ingredient)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.meals;
    }

    async getMealDetails(idMeal: string): Promise<MealDetail> {
        const url = `${this.API_URL}/lookup.php?i=${idMeal}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.meals[0];
    }

    async getCategories(): Promise<Category[]> {
        const url = `${this.API_URL}/categories.php`;
        const response = await fetch(url);
        const data = await response.json();
        return data.categories;
    }

    private async getMealsByCategory(category: string): Promise<MealSummary[]> {
        const url = `${this.API_URL}/filter.php?c=${encodeURIComponent(category)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.meals;
    }

}