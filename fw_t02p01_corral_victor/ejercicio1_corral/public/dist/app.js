// console.log("victor Manuel")
import { ApiService } from "./ApiService.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
function completarCategorias(categoriaSelected) {
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
    const viewService = new ViewService();
    apiService.getCategories()
        .then(categorias => {
        const selectCategorias = document.getElementById('categorias');
        if (selectCategorias !== null) {
            viewService.renderCategoryOptions(selectCategorias, categorias, categoriaSelected);
        }
    })
        .catch(error => {
        console.error("Error al cargar las categorias:", error);
    });
}
async function completarAleatorias() {
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
    const viewService = new ViewService();
    const recetas = [];
    const contenedor = document.getElementById("ochoAleatorias");
    if (!contenedor)
        return;
    try {
        const peticiones = [];
        for (let i = 0; i < 8; i++) {
            peticiones.push(apiService.getRandomMeals());
        }
        const resultados = await Promise.all(peticiones);
        const recetas = resultados.flat();
        viewService.renderMealList(contenedor, recetas);
    }
    catch (error) {
        console.error("Error cargando recetas:", error);
    }
}
function filtrarAleatorias(categoria) {
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
    const viewService = new ViewService();
    const selectCategorias = document.getElementById('categorias');
    let categoriaFiltrada = categoria;
    if (selectCategorias !== null && selectCategorias.value !== "") {
        categoriaFiltrada = selectCategorias.value;
    }
    apiService.getMealsByCategory(categoriaFiltrada)
        .then(async (mealsMini) => {
        const contenedor = document.getElementById("ochoAleatorias");
        if (!contenedor)
            return;
        contenedor.innerHTML = "";
        const aleatorios = crearOchoAleatorios(mealsMini.length);
        const peticiones = [];
        aleatorios.forEach(numero => {
            const mealID = mealsMini[numero].idMeal;
            peticiones.push(apiService.getMealDetails(mealID));
        });
        const recetas = await Promise.all(peticiones);
        viewService.renderMealList(contenedor, recetas);
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
function registrarUsuario() {
    console.log("Registrando usuario...");
    const storageService = new StorageService();
    const usernameInput = document.getElementById("nombre");
    const emailInput = document.getElementById("emailCrear");
    const passwordInput = document.getElementById("passwordCrear");
    const passwordConfirmInput = document.getElementById("passwordComprobar");
    if (usernameInput && emailInput && passwordInput && passwordConfirmInput) {
        const username = usernameInput.value;
        console.log(username);
        const email = emailInput.value;
        console.log(email);
        const password = passwordInput.value;
        console.log(password);
        const passwordConfirm = passwordConfirmInput.value;
        console.log(passwordConfirm);
        if (password === passwordConfirm) {
            const nuevoUser = {
                id: storageService.nextUserId(),
                name: username,
                email: email,
                password: password
            };
            console.log("Usuario registrado:", nuevoUser);
            storageService.registerUser(nuevoUser);
            const authSession = {
                userId: nuevoUser.id,
                name: nuevoUser.name,
                loginDate: new Date()
            };
            storageService.saveUserSession(authSession);
            console.log("Sesión de autenticación creada:", authSession);
            window.location.href = "index.html";
        }
        else {
            console.error("Las contraseñas no coinciden");
        }
    }
}
function logearUsuario() {
    console.log("Logeando usuario...");
    const storageService = new StorageService();
    const emailInput = document.getElementById("emailLogin");
    const passwordInput = document.getElementById("passwordLogin");
    //TODO implementar guardar sesion
    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const usuarioGuardado = storageService.getUserByEmail(email);
        if (!usuarioGuardado) {
            console.error("Usuario no encontrado");
            return;
        }
        if (password === usuarioGuardado.password) {
            const authSession = {
                userId: usuarioGuardado.id,
                name: usuarioGuardado.name,
                loginDate: new Date()
            };
            storageService.saveUserSession(authSession);
            console.log("Sesión de autenticación creada:", authSession);
            window.location.href = "index.html";
        }
    }
    else {
        console.error("Credenciales incorrectas");
    }
}
function logoutUsuario() {
    console.log("Cerrando sesión de usuario...");
    const storageService = new StorageService();
    storageService.clearSession();
    window.location.href = "index.html";
}
function saveCategory() {
    const storage = new StorageService();
    const user = storage.getUserSession();
    const view = new ViewService();
    const favoritaCont = document.getElementById("categorias");
    const favoritaBtn = document.getElementById("btnGuardar");
    if (favoritaCont.value !== "") {
        if (user.favoriteCategory === favoritaCont.value) {
            console.log("Eliminando categoría");
            delete user.favoriteCategory;
            view.renderBtnFavorite(favoritaBtn);
            storage.saveUser(user);
            console.log(user);
        }
        else {
            console.log("Asignando nueva categoría favorita");
            user.favoriteCategory = favoritaCont.value;
            view.renderBtnFavorite(favoritaBtn);
            console.log(user);
            storage.saveUser(user);
        }
    }
}
function cargarFavoritos() {
    //TODO implementar cargar favoritos
    const storageService = new StorageService();
    const contenedor = document.getElementById("favoritos");
    if (!contenedor)
        return;
    contenedor.innerHTML = "<p>No hay favoritos aun</p>";
}
window.addEventListener('DOMContentLoaded', () => {
    const archivo = window.location.pathname.split("/").pop();
    const storage = new StorageService();
    const view = new ViewService();
    const usuarioBtn = document.getElementById("usuarioBtn");
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
    if (storage.isSessionActive()) {
        view.renderBtnSessions(cerrarSesionBtn);
        view.renderBtnSessions(usuarioBtn);
        const btnCerrarSesion = document.getElementById("btnCerrarSesion");
        btnCerrarSesion.addEventListener("click", logoutUsuario);
        const btnSaveSession = document.getElementById("btnGuardar");
        btnSaveSession.addEventListener("click", saveCategory);
        const user = storage.getUserSession();
        let categoria = user.favoriteCategory ?? "";
        if (user.favoriteCategory) {
            const btnFavorito = document.getElementById("btnGuardar");
            view.renderBtnFavorite(btnFavorito);
            filtrarAleatorias(categoria);
        }
        else {
            completarAleatorias();
        }
        console.log(user);
        completarCategorias(categoria);
    }
    else {
        completarCategorias("");
        completarAleatorias();
    }
    const select = document.getElementById("categorias");
    if (select !== null) {
        select.addEventListener("change", () => {
            filtrarAleatorias("");
        });
    }
    const formulario = document.getElementById("formCrearUsuario");
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        registrarUsuario();
    });
    const formularioLogin = document.getElementById("formLoginUsuario");
    formularioLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        logearUsuario();
    });
});
//# sourceMappingURL=app.js.map