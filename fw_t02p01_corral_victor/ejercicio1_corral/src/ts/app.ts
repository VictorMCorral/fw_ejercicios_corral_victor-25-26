// console.log("victor Manuel")
import { ApiService } from "./ApiService.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
import { User } from "./User.js";
import { AuthSession } from "./AuthSession.js";



function completarCategorias(): void {
    // fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    //     .then(respuesta => {
    //         if (!respuesta.ok) {
    //             throw new Error("Error al obtener los datos de las categorias")
    //         }
    //         return respuesta.json();
    //     })
    //     .then(data => {
    //         const selectCategorias: HTMLElement | null = document.getElementById('Categorias');
    //         if (selectCategorias !== null) {
    //             data.categories.forEach((categoria: any) => {
    //                 const option = document.createElement('option');
    //                 option.value = categoria.strCategory;
    //                 option.textContent = categoria.strCategory;
    //                 selectCategorias.appendChild(option);
    //             });
    //         }
    //     })
    //     .catch(error => {
    //         console.error("Error al cargar las categorias:", error);
    //     });
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
    const viewService = new ViewService();
    apiService.getCategories()
        .then(categorias => {
            const selectCategorias: HTMLElement | null = document.getElementById('categorias');
            if (selectCategorias !== null) {
                viewService.renderCategoryOptions(selectCategorias, categorias);
            }
        })
        .catch(error => {
            console.error("Error al cargar las categorias:", error);
        });
}


async function completarAleatorias(): Promise<void> {
    // fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    //     .then(res => {
    //         if (!res.ok) throw new Error("Error al obtener receta random");
    //         return res.json();
    //     })
    //     .then(data => {
    //         const contenedor = document.getElementById("ochoAleatorias");
    //         if (!contenedor) return;

    //         const recetaData = data.meals[0];
    //         const receta = document.createElement('div');
    //         receta.classList.add("col");
    //         receta.innerHTML = crearCard(recetaData)

    //         contenedor.appendChild(receta);
    //     })
    //     .catch(err => console.error(err));
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
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

        viewService.renderMealList(contenedor, recetas);

    } catch (error) {
        console.error("Error cargando recetas:", error);
    }
}

function filtrarAleatorias(): void {
    // const selectCategorias: HTMLElement | null = document.getElementById('Categorias');
    // let categoriaFiltrada: string = "";
    // if (selectCategorias !== null && selectCategorias instanceof HTMLSelectElement) {
    //     categoriaFiltrada = selectCategorias.value;
    // }

    // fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaFiltrada}`)
    //     .then(res => {
    //         if (!res.ok) throw new Error("Error al obtener recetas");
    //         return res.json();
    //     })
    //     .then(data => {
    //         const contenedor = document.getElementById("ochoAleatorias") as HTMLDivElement;
    //         if (!contenedor) return;
    //         contenedor.innerHTML = "";

    //         const aleatorios = crearOchoAleatorios(data.meals.length);

    //         aleatorios.forEach(async numero => {
    //             const mealID = data.meals[numero].idMeal;

    //             try {
    //                 const resDetalle = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    //                 if (!resDetalle.ok) throw new Error("Error al obtener detalles de la receta");

    //                 const detalleData = await resDetalle.json();
    //                 const recetaCompleta: Receta = detalleData.meals[0];

    //                 const recetaDiv = document.createElement('div');
    //                 recetaDiv.classList.add("col");
    //                 recetaDiv.innerHTML = crearCard(recetaCompleta);

    //                 contenedor.appendChild(recetaDiv);
    //             } catch (err) {
    //                 console.error(err);
    //             }
    //         });
    //     })
    //     .catch(err => console.error(err));
    const apiService = new ApiService("https://www.themealdb.com/api/json/v1", "1");
    const viewService = new ViewService();
    const selectCategorias: HTMLElement | null = document.getElementById('categorias');
    let categoriaFiltrada: string = "";
    if (selectCategorias !== null && selectCategorias instanceof HTMLSelectElement) {
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
                id: 1,
                name: username,
                email: email,
                password: password
            };
            console.log("Usuario registrado:", nuevoUser);
            storageService.saveUser(nuevoUser);
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
    //TODO implementar guardar sesion

    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (storageService.validateUser(email, password)) {
            const usuarioGuardado: User | null = storageService.getUserByEmail(email);
            if (!usuarioGuardado) {
                console.error("Usuario no encontrado");
                return;
            }
            const authSession: AuthSession = {
                userId: usuarioGuardado.id,
                name: usuarioGuardado.name,
                loginDate: new Date()
            };
            storageService.saveUserSession(authSession);
            console.log("Sesión de autenticación creada:", authSession);
            cargarZonaPrivada(usuarioGuardado);
        } else {
            console.error("Credenciales incorrectas");
        }
    }
}

function cargarZonaPrivada(usuarioGuardado: User): void {
    const storageService = new StorageService();
    const sessionGuardada = storageService.getUserSession(usuarioGuardado);

    if (sessionGuardada) {
        window.location.href = "private.html";
    } else {
        console.error("No hay sesión activa");
    }
}

function cargarFavoritos(): void {
    //TODO implementar cargar favoritos
    const storageService = new StorageService();
    const contenedor = document.getElementById("favoritos");
    if (!contenedor) return;
    contenedor.innerHTML = "<p>No hay favoritos aun</p>";
}

window.addEventListener('DOMContentLoaded', () => {
    const archivo = window.location.pathname.split("/").pop();
    if (archivo === "index.html") {
        console.log(archivo);
        completarCategorias();

        completarAleatorias();

        const select: HTMLElement | null = document.getElementById("categorias");
        if (select !== null) {
            select.addEventListener("change", filtrarAleatorias);
        }

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
    }

    if (archivo === "private.html") {
        console.log(archivo);
        completarCategorias();

        completarAleatorias();

        cargarFavoritos();

        const select: HTMLElement | null = document.getElementById("categorias");
        if (select !== null) {
            select.addEventListener("change", filtrarAleatorias);
        }
    }
});



