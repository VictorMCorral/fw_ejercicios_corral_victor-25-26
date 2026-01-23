"use strict";
// console.log("victor Manuel")
function completarCategorias() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error("Error al obtener los datos de las categorias");
        }
        return respuesta.json();
    })
        .then(data => {
        const selectCategorias = document.getElementById('Categorias');
        if (selectCategorias !== null) {
            data.categories.forEach((categoria) => {
                const option = document.createElement('option');
                option.value = categoria.strCategory;
                option.textContent = categoria.strCategory;
                selectCategorias.appendChild(option);
            });
        }
    });
}
function completarUnaAleatoria(categoria) {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(res => {
        if (!res.ok)
            throw new Error("Error al obtener receta random");
        return res.json();
    })
        .then(data => {
        const contenedor = document.getElementById("ochoAleatorias");
        if (!contenedor)
            return;
        const recetaData = data.meals[0];
        const receta = document.createElement('div');
        receta.classList.add("col");
        receta.innerHTML = crearCard(recetaData);
        contenedor.appendChild(receta);
    })
        .catch(err => console.error(err));
}
function filtrarAleatorias() {
    const selectCategorias = document.getElementById('Categorias');
    let categoriaFiltrada = "";
    if (selectCategorias !== null && selectCategorias instanceof HTMLSelectElement) {
        categoriaFiltrada = selectCategorias.value;
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaFiltrada}`)
        .then(res => {
        if (!res.ok)
            throw new Error("Error al obtener recetas");
        return res.json();
    })
        .then(data => {
        const contenedor = document.getElementById("ochoAleatorias");
        if (!contenedor)
            return;
        contenedor.innerHTML = "";
        const aleatorios = crearOchoAleatorios(data.meals.length);
        aleatorios.forEach(async (numero) => {
            const mealID = data.meals[numero].idMeal;
            try {
                const resDetalle = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
                if (!resDetalle.ok)
                    throw new Error("Error al obtener detalles de la receta");
                const detalleData = await resDetalle.json();
                const recetaCompleta = detalleData.meals[0];
                const recetaDiv = document.createElement('div');
                recetaDiv.classList.add("col");
                recetaDiv.innerHTML = crearCard(recetaCompleta);
                contenedor.appendChild(recetaDiv);
            }
            catch (err) {
                console.error(err);
            }
        });
    })
        .catch(err => console.error(err));
}
function crearOchoAleatorios(max) {
    const resultado = [];
    while (resultado.length < 8 && resultado.length < max) {
        const numero = Math.floor(Math.random() * max);
        if (!resultado.includes(numero)) {
            resultado.push(numero);
        }
    }
    return resultado;
}
function crearCard(receta) {
    let ingredientesCount = 0;
    for (let i = 1; i <= 20; i++) {
        const ingrediente = receta[`strIngredient${i}`];
        if (ingrediente && ingrediente.trim() !== "") {
            ingredientesCount++;
        }
    }
    let contenido = `
        <div class="card" id="${receta.idMeal}">
            <img src="${receta.strMealThumb}" class="card-img-top" alt="${receta.strMeal}">
            <div class="card-body">
                <h5 class="card-title">${receta.strMeal}</h5>
                <p class="card-text">
                    <strong>Categoría:</strong> ${receta.strCategory ?? "Desconocida"}<br>
                    <strong>País:</strong> ${receta.strArea ?? "Desconocido"}<br>
                    <strong>Ingredientes:</strong> ${ingredientesCount} diferentes
                </p>
            </div>
        </div>
    `;
    return contenido;
}
window.addEventListener('DOMContentLoaded', () => {
    completarCategorias();
    for (let i = 0; i < 8; i++) {
        completarUnaAleatoria("");
    }
    const select = document.getElementById("Categorias");
    if (select !== null) {
        select.addEventListener("change", filtrarAleatorias);
    }
});
//# sourceMappingURL=app.js.map