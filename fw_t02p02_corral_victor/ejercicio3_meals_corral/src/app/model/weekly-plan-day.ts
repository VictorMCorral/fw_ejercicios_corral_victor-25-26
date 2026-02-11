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
    lunchMealId?: number;
    dinnerMealId?: number;
}
