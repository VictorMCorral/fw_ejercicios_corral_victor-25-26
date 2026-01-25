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
    private static USER_KEY_ITEM: string = "user_logged_in";
    private static USER_MEAL_KEY_ITEM: string = "user_meals";

    saveUser(User: User): void {
        localStorage.setItem(`user_${User.id}`, JSON.stringify(User));
    }

    validateUser(email: string, password: string): boolean | null {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_")) {
                const userJson = localStorage.getItem(key);
                if (userJson) {
                    const user: User = JSON.parse(userJson);
                    if (user.email === email && user.password === password) {
                        return true;
                    }
                }
            }
        }
        return false;
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

    saveUserSession(session: AuthSession): void {
        localStorage.setItem(StorageService.USER_KEY_ITEM, JSON.stringify(session));
    }

    getUserSession(User : User): AuthSession | null {
        const sessionJson = localStorage.getItem(StorageService.USER_KEY_ITEM);
        if (sessionJson) {
            const sessionObj = JSON.parse(sessionJson);
            const session: AuthSession = sessionObj;
            if (session.userId === User.id)
                return session;
        }
        return null;
    }

}


