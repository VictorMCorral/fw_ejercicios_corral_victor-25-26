export class StorageService {
    saveUser(User) {
        localStorage.setItem(`user_${User.id}`, JSON.stringify(User));
    }
    validateUser(email, password) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_")) {
                const userJson = localStorage.getItem(key);
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user.email === email && user.password === password) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getUserByEmail(email) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("user_")) {
                const userJson = localStorage.getItem(key);
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user.email === email) {
                        return user;
                    }
                }
            }
        }
        return null;
    }
    saveUserSession(session) {
        localStorage.setItem(StorageService.USER_KEY_ITEM, JSON.stringify(session));
    }
    getUserSession(User) {
        const sessionJson = localStorage.getItem(StorageService.USER_KEY_ITEM);
        if (sessionJson) {
            const sessionObj = JSON.parse(sessionJson);
            const session = sessionObj;
            if (session.userId === User.id)
                return session;
        }
        return null;
    }
}
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
StorageService.USER_KEY_ITEM = "user_logged_in";
StorageService.USER_MEAL_KEY_ITEM = "user_meals";
//# sourceMappingURL=StorageService.js.map