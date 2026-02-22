import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { UserMeal } from '../model/user-meal';
import { AuthSession } from '../model/auth-session';
import { WeeklyPlanDay, DayList } from '../model/weekly-plan-day';
import { WeeklyPlan, WeeklyPlanId } from '../model/weekly-plan';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private static USER_KEY: string = "users";
  private static USER_KEY_ITEM: string = "authSession";
  private static USER_MEAL_KEY_ITEM: string = "userMeals_";
  private static USER_WEEKLYPLANS_KEY: string = "weeklyPlans_";

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

  saveCategory(Category: string) {
    const usuario: User | null = this.getUserSession();
    if (usuario) {
      if (usuario.favoriteCategory === Category) {
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

  saveUserMeals(meal: UserMeal) {
    console.log(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`);
    const storage = this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`) as UserMeal[];
    const index = storage.findIndex(item => item.mealId === meal.mealId);

    if (index !== -1) {
      storage[index] = meal;
    } else {
      storage.push(meal);
    }

    localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${meal.userId}`, JSON.stringify(storage));
  }

  existsMealsInUser(id: number, idMeal: number): boolean {
    const meals = this.getUserMeals(id);
    let encontrada = false;
    if (meals) {
      meals.forEach(meal => {
        if (meals) {
          meals.forEach(meal => {
            if (meal.mealId === idMeal) {
              encontrada = true;
            }
          });
        }
      });
    }
    return encontrada;
  }

  getUserMeals(id: number): UserMeal[] {
    return this.getLocalStorage(`${StorageService.USER_MEAL_KEY_ITEM}${id}`) as UserMeal[] ?? null;
  }

  getUserMealById(id: number): UserMeal | null {
    const user = this.getUserSession();
    let userMeal: UserMeal | null = null;
    if (user) {
      const userMeals = this.getUserMeals(user.id);
      if (userMeals) {
        userMeals.forEach(userMealInUser => {
          if (userMealInUser.mealId == id) userMeal = userMealInUser;
        });
      }
    }
    return userMeal;
  }

  deleteUserMeals(idmeal: number) {
    const user = this.getUserSession() as User;
    const meals = this.getUserMeals(user.id);
    console.log(meals);

    const newMeals = meals.filter(receta => receta.mealId !== idmeal);

    if (newMeals.length > 0) {
      localStorage.setItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`, JSON.stringify(newMeals));
    } else {
      localStorage.removeItem(`${StorageService.USER_MEAL_KEY_ITEM}${user.id}`)
    }
  }

  getWeeklyPlansUser(): WeeklyPlan[] {
    const userId = this.getUserSession()?.id;
    const userWeeklyPlans = this.getLocalStorage(`${StorageService.USER_WEEKLYPLANS_KEY}${userId}`) as WeeklyPlan[];
    return (userWeeklyPlans as WeeklyPlan[]) ?? [];
  }

  setWeeklyPlanUser(weeklyPlanSave: WeeklyPlan[]): void {
    const userId = this.getUserSession()?.id;
    if (userId) {
      localStorage.setItem(`${StorageService.USER_WEEKLYPLANS_KEY}${userId}`, JSON.stringify(weeklyPlanSave))
    } else {
      console.log("setWeeklyPlanUser no puede acceder a userID =>" + userId)
    }
  }

  saveWeeklyPlan(planSave: WeeklyPlan): void {
    const weeklyPlansByUser = this.getWeeklyPlansUser() as WeeklyPlan[];
    const indice = weeklyPlansByUser.findIndex(plan => plan.id === planSave.id);
    if (indice !== -1) {
      weeklyPlansByUser[indice] = planSave;
    } else {
      weeklyPlansByUser.push(planSave);
    }

    this.setWeeklyPlanUser(weeklyPlansByUser);
  }

  deleteWeeklyPlan(planDelete: WeeklyPlan) {
    const weeklyPlansByUser = this.getWeeklyPlansUser() as WeeklyPlan[];
    const weeklyPlanNew = weeklyPlansByUser.filter(plan => plan.id !== planDelete.id);
    this.setWeeklyPlanUser(weeklyPlanNew);
  }

  // Ejemplo
  //  KEY: `${StorageService.USER_WEEKLYPALNS_KEY}${user.id}`
  //   [{
  //      "id": "2026-W02",
  //      "userId": 56,
  //      "days":
  //      [
  //       {"day": "lunes"},
  //       {"day": "martes"},
  //       {"day": "miércoles"},
  //       {"day": "jueves"},
  //       {"day": "viernes"},
  //       {"day": "sábado"},
  //       {"day": "domingo", "dinnerMealId": 52819}
  //     ]
  //   },{
  //     "id": "2026-W03",
  //      "userId": 56,
  //      "days":
  //      [
  //       {"day": "lunes", "lunchMealId": 52772, "dinnerMealId": 52819},
  //       {"day": "martes", "lunchMealId": 52944, "dinnerMealId": 53026},
  //       {"day": "miércoles"},
  //       {"day": "jueves"},
  //       {"day": "viernes"},
  //       {"day": "sábado"},
  //       {"day": "domingo"}
  //     ]
  //   }
  // ]


}
