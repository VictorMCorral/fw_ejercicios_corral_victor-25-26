import { MyMeal } from "./MyMeal.js";

export interface UserMiniMeal {
    idMeal: MyMeal["idMeal"];
    name: string;
    image_small: string;
}
