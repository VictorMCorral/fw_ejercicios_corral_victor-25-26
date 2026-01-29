import { findIndex } from 'rxjs';
import { User } from "./User.js";
import { AuthSession } from "./AuthSession.js";
import { MyMeal } from './MyMeal.js';
import { UserMeal } from './UserMeal.js';


export class StorageService {
    private static USER_KEY: string = "users";
    private static USER_KEY_ITEM: string = "authSession";
    private static USER_MEAL_KEY_ITEM: string = "userMeals_";

    getLocalStorage(key: string) {
        const storage = localStorage.getItem(key) ?? null;
        let datos = null;
        if (storage) {
            try {
                return JSON.parse(storage);
            } catch (error) {
                return null
            }
        }
    }

    saveUser(user: User): void {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        const index = users.findIndex(u => u.id === user.id);

        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }

        localStorage.setItem(StorageService.USER_KEY, JSON.stringify(users));
    }

    registerUser(user: User): void {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        const index = users.findIndex(u => u.id === user.id);

        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }

        if (!this.existeEmail(user.email)) {
            users.push(user);
            localStorage.setItem(StorageService.USER_KEY, JSON.stringify(users));
        }
    }

    existeEmail(email: string) {
        let userFound: User | null = this.getUserByEmail(email);
        if (userFound) {
            return true;
        }
        return false;
    }

    nextUserId(): number {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        const user = users[users.length - 1] as User;
        if (user) {
            let id = user.id;
            return id + 1;
        }
        return 1;
    }

    getUserByEmail(email: string): User | null {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        let user = users.find(user => user.email === email) as User ?? null;
        return user;
    }

    getUserById(id: number): User | null {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        let user = users.find(user => user.id === id) as User ?? null;
        return user;
    }

    isSessionActive(): boolean {
        const sessionsJson = (this.getLocalStorage(StorageService.USER_KEY_ITEM) as AuthSession) ?? null;
        if (sessionsJson) {
            return true;
        }
        return false;
    }

    clearSession(): void {
        localStorage.removeItem(StorageService.USER_KEY_ITEM);
    }

    saveUserSession(session: AuthSession): void {
        localStorage.setItem(StorageService.USER_KEY_ITEM, JSON.stringify(session));
    }

    getUserSession(): User | null {
        const session = (this.getLocalStorage(StorageService.USER_KEY_ITEM) as AuthSession) ?? null;
        const user = this.getUserById(session.userId)
        return user;
    }

    //TODO estamos con las recetas
    saveUserMeals(meal : UserMeal) {
        const user : User | null = this.getUserById(meal.userId);
        if(user){
            const userMeals = this.getUserMeals(user) as MyMeal[];
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`, JSON.stringify(userMeals))
        }

    }

    getUserMeals(user: User) : MyMeal[]{
        let meals2 = this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`) as MyMeal[] ?? [];
        return meals2;
    }

}


