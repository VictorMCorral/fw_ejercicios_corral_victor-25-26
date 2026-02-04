import { MyMeal } from "./MyMeal.js";

export enum statusUserMeal {
    Todo = "Quiero hacerla",
    Done = "La he hecho",
}

export interface UserMeal {
    userId: number;
    mealId: MyMeal["idMeal"];
    saveDate: Date;
    status: statusUserMeal;
    notes?: string;
    rating?: number;
}