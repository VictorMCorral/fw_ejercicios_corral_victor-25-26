// Clase ViewService: pinta la interfaz (vengan los datos de API o de localStorage)
// Responsabilidades
// Renderizar listados de recetas
// Renderizar detalles de receta
// Renderizar planes semanales
// Mostrar mensajes de error o aviso
// …
export class ViewService {
    renderMealList(contenedor, recetas) {
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
    renderMealListOutDetails(contenedor, recetas) {
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
    renderCategoryOptions(contenedor, categorias, categoriaSelected) {
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
    renderBtnSessions(contenedor) {
        contenedor.classList.toggle("d-none");
        contenedor.classList.toggle("d-block");
    }
    renderBtnFavorite(contenedor) {
        contenedor.classList.toggle("active");
    }
    renderMeal(receta) {
        //El nombre, la categoría, el país, la fotografía mediana, 
        // una lista ordenada de ingredientes y cantidades.
        const img = document.getElementById("recipe-img");
        const cat = document.getElementById("recipe-category");
        const area = document.getElementById("recipe-area");
        const ingUl = document.getElementById("recipe-ingredients");
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
    renderBtnRecetas() {
        const btnGuardarReceta = document.getElementById("btnGuardarReceta");
        const btnEliminarReceta = document.getElementById("btnEliminarReceta");
        this.renderBtnSessions(btnGuardarReceta);
        this.renderBtnSessions(btnEliminarReceta);
    }
}
//# sourceMappingURL=ViewService.js.map