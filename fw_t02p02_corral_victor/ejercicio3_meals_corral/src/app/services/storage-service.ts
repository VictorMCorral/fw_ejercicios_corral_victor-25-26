import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { UserMeal } from '../model/user-meal';
import { AuthSession } from '../model/auth-session';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

private static USER_KEY: string = "users";
    private static USER_KEY_ITEM: string = "authSession";
    private static USER_MEAL_KEY_ITEM: string = "userMeals_";

    getLocalStorage(key: string) {
        const storage = localStorage.getItem(key) ?? null;

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

    saveCategory(Category: string){
        const usuario: User | null= this.getUserSession();
        if(usuario){
          if(usuario.favoriteCategory === Category){
            delete usuario.favoriteCategory;
          } else {
            usuario.favoriteCategory = Category;
          }
          this.saveUser(usuario);
        }
    }
    registerUser(user: User): boolean {
        const users = (this.getLocalStorage(StorageService.USER_KEY) as User[]) ?? [];
        const index = users.findIndex(u => u.id === user.id);

        if (!this.existeEmail(user.email)) {
            users.push(user);
            localStorage.setItem(StorageService.USER_KEY, JSON.stringify(users));
            return true;
        }
        return false;
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
        console.log(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`);
        const storage = this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`) as UserMeal[];
        if(storage){
            storage.push(meal);
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`,JSON.stringify(storage));
        } else {
            const nueva: UserMeal[] = [meal];
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`,JSON.stringify(nueva));
        }

    }

    getUserMeals(id: number): UserMeal[] {
        return this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${id}`) as UserMeal[] ?? null;
    }

    deleteUserMeals(idmeal: number){
        const user = this.getUserSession() as User;
        const meals = this.getUserMeals(user.id);
        console.log(meals);

        const newMeals = meals.filter(receta => receta.mealId !== idmeal);

        console.log(meals);
        if(newMeals.length > 0){
            localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`,JSON.stringify(newMeals));
        } else {
            localStorage.removeItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`)
        }
    }


}
