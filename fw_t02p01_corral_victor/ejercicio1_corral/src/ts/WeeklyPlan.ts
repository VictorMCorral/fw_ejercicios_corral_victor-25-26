import { User } from "./User.js";
import { WeeklyPlanDay } from "./WeeklyPlanDay.js";


type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type WeekNumber = 
    | `0${Exclude<Digit, 0>}`
    | `${1 | 2 | 3 | 4 }${Digit}`
    | `5${1 | 2 | 3}`;

type WeeklyPlanId = `${number}-W${WeekNumber}`;


export interface WeeklyPlan {
    id: WeeklyPlanId;
    userId: number;
    days: WeeklyPlanDay[];
}