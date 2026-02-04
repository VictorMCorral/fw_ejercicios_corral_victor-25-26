// Clase ViewService: pinta la interfaz (vengan los datos de API o de localStorage)
// Responsabilidades
// Renderizar listados de recetas
// Renderizar detalles de receta
// Renderizar planes semanales
// Mostrar mensajes de error o aviso
// …

// Las funciones siempre reciben el elemento contenedor del DOM y los datos a representar.
import { MyMeal } from './MyMeal';


export class ViewService {
    renderMealList(contenedor: HTMLElement, recetas: MyMeal[]): void {
        contenedor.innerHTML = '';

        recetas.forEach(receta => {
            const ingredientesCount = receta?.ingredients.length || 0;

            const recetaDiv = document.createElement('div');
            recetaDiv.classList.add('meal-card');

            recetaDiv.innerHTML = ` 
            <div class="card" id="${receta.idMeal}">
                <img src="${receta.strMealThumb}" class="card-img-top" alt="${receta.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${receta.strMeal}</h5>
                    <p class="card-text">
                        <strong>Categoría:</strong> ${receta.strCategory}<br>
                        <strong>País:</strong> ${receta.strArea}<br>
                        <strong>Ingredientes:</strong> ${ingredientesCount} diferentes
                    </p> 
                    <form action="receta.html" method="GET" class="mb-4">
                            <input type="hidden" name="id" value="${receta.idMeal}">
                        <input type="submit" id="btnDetalles" value="Detalles >>" class="btn btn-outline-primary w-100 d-block">
                    </form>
                </div>
            </div>           
            `;
            contenedor.appendChild(recetaDiv);
        });
    }

    renderMealListOutDetails(contenedor: HTMLElement, recetas: MyMeal[]): void {
        contenedor.innerHTML = '';

        recetas.forEach(receta => {
            const ingredientesCount = receta?.ingredients.length || 0;

            const recetaDiv = document.createElement('div');
            recetaDiv.classList.add('meal-card');

            recetaDiv.innerHTML = ` 
            <div class="card" id="${receta.idMeal}">
                <img src="${receta.strMealThumb}" class="card-img-top" alt="${receta.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${receta.strMeal}</h5>
                    <p class="card-text">
                        <strong>Categoría:</strong> ${receta.strCategory}<br>
                        <strong>País:</strong> ${receta.strArea}<br>
                        <strong>Ingredientes:</strong> ${ingredientesCount} diferentes
                    </p> 
                </div>
            </div>           
            `;
            contenedor.appendChild(recetaDiv);
        });
    }

    renderCategoryOptions(contenedor: HTMLElement, categorias: string[], categoriaSelected: string): void {
        contenedor.innerHTML = '<option value="">-- Selecciona una categoría --</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            contenedor.appendChild(option);
            if (categoriaSelected === categoria) {
                option.selected = true;
            }
        });
    }

    renderBtnSessions(contenedor: HTMLElement): void {
        contenedor.classList.toggle("d-none");
        contenedor.classList.toggle("d-block");
    }

    renderBtnFavorite(contenedor: HTMLElement): void {
        contenedor.classList.toggle("active");
    }

    renderMeal(receta: MyMeal): void {
        //El nombre, la categoría, el país, la fotografía mediana, 
        // una lista ordenada de ingredientes y cantidades.

        const img = document.getElementById("recipe-img") as HTMLImageElement;
        const cat = document.getElementById("recipe-category") as HTMLSpanElement;
        const area = document.getElementById("recipe-area") as HTMLSpanElement;
        const ingUl = document.getElementById("recipe-ingredients") as HTMLUListElement;

        img.src = receta.strMealThumb;
        cat.textContent = receta.strCategory;
        area.textContent = receta.strArea;

        receta.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
            <span>${ing.name}</span>
            <span class="badge bg-primary rounded-pill">${ing.measure}</span>
        `;

            ingUl.appendChild(li);
        });
    }

    renderBtnRecetas(): void {
        const btnGuardarReceta = document.getElementById("btnGuardarReceta") as HTMLButtonElement;
        const btnEliminarReceta = document.getElementById("btnEliminarReceta") as HTMLButtonElement;
        this.renderBtnSessions(btnGuardarReceta);
        this.renderBtnSessions(btnEliminarReceta);
    }
}

