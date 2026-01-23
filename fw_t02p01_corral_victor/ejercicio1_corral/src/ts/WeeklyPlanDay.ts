import { MyMeal } from "./MyMeal.js";

type DayList = 
    | "lunes" 
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";


export interface WeeklyPlanDay {
    day: DayList;
    lunchMealId?: MyMeal["idMeal"];
    dinnerMealId?: MyMeal["idMeal"];
}   