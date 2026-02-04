// console.log("victor Manuel")
import { ApiService } from "./ApiService.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
import { User } from "./User.js";
import { AuthSession } from "./AuthSession.js";
import { UserMeal, statusUserMeal } from './UserMeal.js';



function completarCategorias(categoriaSelected: string): void {
    const apiService = new ApiService();
    const viewService = new ViewService();
    apiService.getCategories()
        .then(categorias => {
            const selectCategorias: HTMLElement | null = document.getElementById('categorias');
            if (selectCategorias !== null) {
                viewService.renderCategoryOptions(selectCategorias, categorias, categoriaSelected);
            }
        })
        .catch(error => {
            console.error("Error al cargar las categorias:", error);
        });
}

async function completarAleatorias(): Promise<void> {
    const apiService = new ApiService();
    const viewService = new ViewService();

    const recetas: MyMeal[] = [];
    const contenedor = document.getElementById("ochoAleatorias");
    if (!contenedor) return;

    try {
        const peticiones: Promise<MyMeal>[] = [];

        for (let i = 0; i < 8; i++) {
            peticiones.push(apiService.getRandomMeals());
        }

        const resultados = await Promise.all(peticiones);
        const recetas: MyMeal[] = resultados.flat();

        const storage = new StorageService();
        if(storage.isSessionActive()){
            viewService.renderMealList(contenedor, recetas);
        } else {
            viewService.renderMealListOutDetails(contenedor, recetas);
        }


    } catch (error) {
        console.error("Error cargando recetas:", error);
    }
}

function filtrarAleatorias(categoria: string): void {
    const apiService = new ApiService();
    const viewService = new ViewService();
    const selectCategorias = document.getElementById('categorias') as HTMLSelectElement;
    let categoriaFiltrada: string = categoria;
    if (selectCategorias !== null && selectCategorias.value !== "") {
        categoriaFiltrada = selectCategorias.value;
    }
    apiService.getMealsByCategory(categoriaFiltrada)
        .then(async (mealsMini) => {
            const contenedor = document.getElementById("ochoAleatorias") as HTMLDivElement;
            if (!contenedor) return;
            contenedor.innerHTML = "";
            const aleatorios = crearOchoAleatorios(mealsMini.length);
            const peticiones: Promise<MyMeal>[] = [];
            aleatorios.forEach(numero => {
                const mealID = mealsMini[numero].idMeal;
                peticiones.push(apiService.getMealDetails(mealID));
            });
            const recetas: MyMeal[] = await Promise.all(peticiones);
            viewService.renderMealList(contenedor, recetas);
        })
        .catch(err => console.error(err));
}

function crearOchoAleatorios(max: number): number[] {
    const resultado: number[] = [];

    while (resultado.length < 8 && resultado.length < max) {
        const numero = Math.floor(Math.random() * max);
        if (!resultado.includes(numero)) {
            resultado.push(numero);
        }
    }

    return resultado;
}

function registrarUsuario(): void {
    console.log("Registrando usuario...");
    const storageService = new StorageService();
    const usernameInput = document.getElementById("nombre") as HTMLInputElement | null;
    const emailInput = document.getElementById("emailCrear") as HTMLInputElement | null;
    const passwordInput = document.getElementById("passwordCrear") as HTMLInputElement | null;
    const passwordConfirmInput = document.getElementById("passwordComprobar") as HTMLInputElement | null;

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
            const nuevoUser: User = {
                id: storageService.nextUserId(),
                name: username,
                email: email,
                password: password
            };
            console.log("Usuario registrado:", nuevoUser);
            storageService.registerUser(nuevoUser);
            const authSession: AuthSession = {
                userId: nuevoUser.id,
                name: nuevoUser.name,
                loginDate: new Date()
            };
            storageService.saveUserSession(authSession);
            console.log("Sesión de autenticación creada:", authSession);
            window.location.href = "index.html";
        } else {
            console.error("Las contraseñas no coinciden");
        }
    }
}

function logearUsuario(): void {
    console.log("Logeando usuario...");
    const storageService = new StorageService();
    const emailInput = document.getElementById("emailLogin") as HTMLInputElement | null;
    const passwordInput = document.getElementById("passwordLogin") as HTMLInputElement | null;

    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const usuarioGuardado: User | null = storageService.getUserByEmail(email);
        if (!usuarioGuardado) {
            console.error("Usuario no encontrado");
            return;
        }
        if (password === usuarioGuardado.password) {
            const authSession: AuthSession = {
                userId: usuarioGuardado.id,
                name: usuarioGuardado.name,
                loginDate: new Date()
            };
            storageService.saveUserSession(authSession);
            console.log("Sesión de autenticación creada:", authSession);

            window.location.reload();
        }
    } else {
        console.error("Credenciales incorrectas");
    }
}

function logoutUsuario(): void {
    console.log("Cerrando sesión de usuario...");
    const storageService = new StorageService();
    storageService.clearSession();
    window.location.href = "index.html";
}

function saveCategory(): void {
    const storage = new StorageService();
    const user = storage.getUserSession() as User;
    const view = new ViewService();
    const favoritaCont = document.getElementById("categorias") as HTMLSelectElement;
    const favoritaBtn = document.getElementById("btnGuardar") as HTMLSelectElement;

    if (favoritaCont.value !== "") {
        if (user.favoriteCategory === favoritaCont.value) {
            console.log("Eliminando categoría");
            delete user.favoriteCategory;
            view.renderBtnFavorite(favoritaBtn)
            storage.saveUser(user);
            console.log(user);
        } else {
            console.log("Asignando nueva categoría favorita");
            user.favoriteCategory = favoritaCont.value;
            view.renderBtnFavorite(favoritaBtn)
            console.log(user);
            storage.saveUser(user);
        }
    }
}

function cargarFavoritos(): void {
    //TODO implementar cargar favoritos
    const storageService = new StorageService();
    const contenedor = document.getElementById("favoritos");
    if (!contenedor) return;
    contenedor.innerHTML = "<p>No hay favoritos aun</p>";
}

async function cargarReceta(idMeal: number, view: ViewService) {
    const api = new ApiService();
    const receta = await api.getMealDetails(idMeal);
    view.renderMeal(receta)
}

function pintarCabecera(storage: StorageService, view: ViewService) {
    const usuarioBtn = document.getElementById("usuarioBtn") as HTMLDivElement
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn") as HTMLDivElement

    if (storage.isSessionActive()) {
        view.renderBtnSessions(cerrarSesionBtn);
        view.renderBtnSessions(usuarioBtn)
    }
}

function gestionarRutas(archivo: string) {
    const storage = new StorageService();
    const view = new ViewService();

    pintarCabecera(storage, view);
    const formulario = document.getElementById("formCrearUsuario") as HTMLFormElement;
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        registrarUsuario();
    });

    const formularioLogin = document.getElementById("formLoginUsuario") as HTMLFormElement;
    formularioLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        logearUsuario();
    });

    const btnCerrarSesion = document.getElementById("btnCerrarSesion") as HTMLButtonElement;
    btnCerrarSesion.addEventListener("click", logoutUsuario);


    if (archivo === "index.html") {
        activarIndex(storage, view);
    } else if (archivo === "receta.html") {
        activarReceta(storage, view);
    }
}

function activarIndex(storage: StorageService, view: ViewService) {
    if (storage.isSessionActive()) {
        const guardarBtn = document.getElementById("btnGuardar") as HTMLDivElement
        view.renderBtnSessions(guardarBtn);

        const user = storage.getUserSession() as User;
        let categoria = user.favoriteCategory ?? "";

        if (user.favoriteCategory) {
            const btnFavorito = document.getElementById("btnGuardar") as HTMLDivElement;
            view.renderBtnFavorite(btnFavorito);
            filtrarAleatorias(categoria);
        } else {
            completarAleatorias();
        }
        console.log(user)
        completarCategorias(categoria);

    } else {
        // const btnDetalles = document.getElementById("btnDetalles") as HTMLInputElement;
        // console.log(btnDetalles);
        // view.renderBtnSessions(btnDetalles);
        completarCategorias("");
        completarAleatorias();
    }
    const select: HTMLElement | null = document.getElementById("categorias");
    if (select !== null) {
        select.addEventListener("change", () => {
            filtrarAleatorias("");
        });

        const btnSaveSession = document.getElementById("btnGuardar") as HTMLButtonElement;
        btnSaveSession.addEventListener("click", saveCategory);

    }
}

async function btnDetalles(view: ViewService){
        const btnDetalles = document.getElementById("btnDetalles") as HTMLInputElement;
        console.log(btnDetalles);
        view.renderBtnSessions(btnDetalles);
}

function activarReceta(storage: StorageService, view: ViewService) {
    const params = new URLSearchParams(window.location.search);
    const datos = Object.fromEntries(params.entries());
    let idMeal: number = Number(datos.id);

    const user = storage.getUserSession() as User;
    const userMeals = storage.getUserMeals(user.id);
    let isSave = false;

    const btnGuardarReceta = document.getElementById("btnGuardarReceta") as HTMLButtonElement;
    const btnEliminarReceta = document.getElementById("btnEliminarReceta") as HTMLButtonElement;

    userMeals.forEach(receta => {
        if (receta.mealId === idMeal) {
            isSave = true;
        }
    });

    if (isSave) {
        view.renderBtnSessions(btnGuardarReceta);
        view.renderBtnSessions(btnEliminarReceta);
    }

    cargarReceta(idMeal, view);

    btnGuardarReceta.addEventListener("click", () => {
        guardarReceta(idMeal, storage, view)
    });

    btnEliminarReceta.addEventListener("click", () => {
        eliminarReceta(idMeal, storage, view)
    });

}

function guardarReceta(idMeal: number, storage: StorageService, view: ViewService) {
    const user = storage.getUserSession() ?? null;

    let userId = null;
    if (user) {
        userId = user.id;
        const recetaGuardada: UserMeal = {
            userId: userId,
            mealId: idMeal,
            saveDate: new Date(),
            status: statusUserMeal.Todo,
        }
        storage.saveUserMeals(recetaGuardada)
        view.renderBtnRecetas();
    }
};

function eliminarReceta(idMeal: number, storage: StorageService, view: ViewService) {
    storage.deleteUserMeals(idMeal);
    view.renderBtnRecetas();
}


window.addEventListener('DOMContentLoaded', () => {
    const archivo = window.location.pathname.split("/").pop() as string;

    gestionarRutas(archivo);

});



