export class ApiService {
    constructor(apiUrl, apiKey = '') {
        this.API_URL = apiUrl;
        this.API_KEY = apiKey;
    }
    //TODO repasar los metodos
    async getRandomMeals() {
        let url = `${this.API_URL}/${this.API_KEY}/random.php`;
        const response = await fetch(url);
        const data = await response.json();
        return this.toMyMeal(data.meals[0]);
    }
    async getMealDetails(idMeal) {
        const url = `${this.API_URL}/${this.API_KEY}/lookup.php?i=${idMeal}`;
        const response = await fetch(url);
        const data = await response.json();
        return this.toMyMeal(data.meals[0]);
    }
    async getCategories() {
        const url = `${this.API_URL}/${this.API_KEY}/list.php?c=list`;
        const response = await fetch(url);
        const data = await response.json();
        const categorias = [];
        for (const meal of data.meals) {
            categorias.push(meal.strCategory);
        }
        return categorias;
    }
    async getMealsByCategory(categoria) {
        const url = `${this.API_URL}/${this.API_KEY}/filter.php?c=${encodeURIComponent(categoria)}`;
        const response = await fetch(url);
        const data = await response.json();
        const mealsConvertidas = [];
        for (const apiMeal of data.meals) {
            const mealConvertida = {
                idMeal: Number(apiMeal.idMeal),
                name: apiMeal.strMeal,
                image_small: (apiMeal.strMealThumb || '').trim()
            };
            mealsConvertidas.push(mealConvertida);
        }
        return mealsConvertidas;
    }
    toMyMeal(apiMeal) {
        return {
            idMeal: Number(apiMeal.idMeal),
            strMeal: apiMeal.strMeal,
            strCategory: apiMeal.strCategory,
            strArea: apiMeal.strArea,
            strMealThumb: (apiMeal.strMealThumb || '').trim(),
            ingredients: this.convertirIngredientes(apiMeal)
        };
    }
    convertirIngredientes(apiMeal) {
        const ingredients = [];
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
        return ingredients;
    }
}
//# sourceMappingURL=ApiService.js.map