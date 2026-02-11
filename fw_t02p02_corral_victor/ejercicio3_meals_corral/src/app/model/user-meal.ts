export enum statusUserMeal {
    Todo = "Quiero hacerla",
    Done = "La he hecho",
}

export interface UserMeal {
    userId: number;
    mealId: number;
    saveDate: Date;
    status: statusUserMeal;
    notes?: string;
    rating?: number;
}
