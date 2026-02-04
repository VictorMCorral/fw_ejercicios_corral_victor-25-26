export class StorageService {
    getLocalStorage(key) {
        const storage = localStorage.getItem(key) ?? null;
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
        console.log(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`);
        const storage = this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`);
        if (storage) {
            storage.push(meal);
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`, JSON.stringify(storage));
        }
        else {
            const nueva = [meal];
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`, JSON.stringify(nueva));
        }
    }
    getUserMeals(id) {
        return this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${id}`) ?? null;
    }
    deleteUserMeals(idmeal) {
        const user = this.getUserSession();
        const meals = this.getUserMeals(user.id);
        console.log(meals);
        const newMeals = meals.filter(receta => receta.mealId !== idmeal);
        console.log(meals);
        if (newMeals.length > 0) {
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`, JSON.stringify(newMeals));
        }
        else {
            localStorage.removeItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`);
        }
    }
}
StorageService.USER_KEY = "users";
StorageService.USER_KEY_ITEM = "authSession";
StorageService.USER_MEAL_KEY_ITEM = "userMeals_";
//# sourceMappingURL=StorageService.js.map