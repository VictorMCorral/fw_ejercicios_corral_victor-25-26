import { MyMeal } from "./MyMeal.js";

enum statusUserMeal {
    Todo = "Quiero hacerla",
    Done = "La he hecho",
}

export interface UserMeal {
    readonly userId: number;
    mealId: MyMeal["idMeal"];
    saveDate: Date;
    status: statusUserMeal;
    notes?: string;
    rating?: number;
}