import { User } from "./User.js";
import { AuthSession } from "./AuthSession.js";


export class StorageService {
    //     Clase StorageService: gestiona el acceso a localStorage.

    // Atributos mínimos (voluntario):
    // USER_KEY_ITEM, USER_MEAL_KEY_ITEM, …

    // Responsabilidades
    // Alta y validación de usuarios
    // Gestión de sesión
    // Guardar y recuperar recetas del usuario
    // Guardar y recuperar planes semanales
    // Guardar preferencias del usuario
    // …

    // Nunca toca el DOM
    //TODO repasar para que son user_key_item y User_meal_key_item
    private static USER_KEY: string = "user_";
    private static USER_KEY_ITEM: string = "user_logged_in";
    private static USER_MEAL_KEY_ITEM: string = "user_meals";

    saveUser(user: User): void {
        localStorage.setItem(StorageService.USER_KEY, JSON.stringify(user));
    }


    validateUser(id: number, password: string): boolean {
        const usersString = localStorage.getItem(StorageService.USER_KEY);
        if (!usersString) return false;

        try {
            const users: User[] = JSON.parse(usersString);

            // Buscar el usuario con id y contraseña coincidentes
            const userFound = users.find(user => user.id === id && user.password === password);

            return !!userFound; // true si se encontró, false si no
        } catch (error) {
            console.error("Error parsing users from localStorage", error);
            return false;
        }
    }


    getUserByEmail(email: string): User | null {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_")) {
                const userJson = localStorage.getItem(key);
                if (userJson) {
                    const user: User = JSON.parse(userJson);
                    if (user.email === email) {
                        return user;
                    }
                }
            }
        }
        return null;
    }

    getUserById(id: number): User | null {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_")) {
                const userJson = localStorage.getItem(key);
                if (userJson) {
                    const user: User = JSON.parse(userJson);
                    if (user.id === id) {
                        return user;
                    }
                }
            }
        }
        return null;


    }

    isSessionActive(): boolean {
        const sessionJson = localStorage.getItem(StorageService.USER_KEY_ITEM);
        return sessionJson !== null;
    }

    clearSession(): void {
        localStorage.removeItem(StorageService.USER_KEY_ITEM);
    }

    saveUserSession(session: AuthSession): void {
        localStorage.setItem(StorageService.USER_KEY_ITEM, JSON.stringify(session));
    }

    getUserSession(): AuthSession | null {
        const sessionJson = localStorage.getItem(StorageService.USER_KEY_ITEM);
        if (sessionJson) {
            const sessionObj = JSON.parse(sessionJson);
            const session: AuthSession = sessionObj;
            return session;
        }
        return null;
    }

}


