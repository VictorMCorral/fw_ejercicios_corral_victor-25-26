export class StorageService {
    getLocalStorage(key) {
        const storage = localStorage.getItem(key) ?? null;
        let datos = null;
        if (storage) {
            try {
                return JSON.parse(storage);
            }
            catch (error) {
                return null;
            }
        }
    }
    saveUser(user) {
        const users = this.getLocalStorage(StorageService.USER_KEY) ?? [];
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        }
        else {
            users.push(user);
        }
        localStorage.setItem(StorageService.USER_KEY, JSON.stringify(users));
    }
    registerUser(user) {
        const users = this.getLocalStorage(StorageService.USER_KEY) ?? [];
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        }
        else {
            users.push(user);
        }
        if (!this.existeEmail(user.email)) {
            users.push(user);
            localStorage.setItem(StorageService.USER_KEY, JSON.stringify(users));
        }
    }
    existeEmail(email) {
        let userFound = this.getUserByEmail(email);
        if (userFound) {
            return true;
        }
        return false;
    }
    nextUserId() {
        const users = this.getLocalStorage(StorageService.USER_KEY) ?? [];
        const user = users[users.length - 1];
        if (user) {
            let id = user.id;
            return id + 1;
        }
        return 1;
    }
    getUserByEmail(email) {
        const users = this.getLocalStorage(StorageService.USER_KEY) ?? [];
        let user = users.find(user => user.email === email) ?? null;
        return user;
    }
    getUserById(id) {
        const users = this.getLocalStorage(StorageService.USER_KEY) ?? [];
        let user = users.find(user => user.id === id) ?? null;
        return user;
    }
    isSessionActive() {
        const sessionsJson = this.getLocalStorage(StorageService.USER_KEY_ITEM) ?? null;
        if (sessionsJson) {
            return true;
        }
        return false;
    }
    clearSession() {
        localStorage.removeItem(StorageService.USER_KEY_ITEM);
    }
    saveUserSession(session) {
        localStorage.setItem(StorageService.USER_KEY_ITEM, JSON.stringify(session));
    }
    getUserSession() {
        const session = this.getLocalStorage(StorageService.USER_KEY_ITEM) ?? null;
        const user = this.getUserById(session.userId);
        return user;
    }
    //TODO estamos con las recetas
    saveUserMeals(meal) {
        const user = this.getUserById(meal.userId);
        if (user) {
            const userMeals = this.getUserMeals(user);
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`, JSON.stringify(userMeals));
        }
    }
    getUserMeals(user) {
        let meals2 = this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`) ?? [];
        return meals2;
    }
}
StorageService.USER_KEY = "users";
StorageService.USER_KEY_ITEM = "authSession";
StorageService.USER_MEAL_KEY_ITEM = "userMeals_";
//# sourceMappingURL=StorageService.js.map