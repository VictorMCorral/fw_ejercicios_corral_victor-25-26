import { MyMeal } from "./MyMeal.js";

export interface UserMiniMeal {
    id: MyMeal["idMeal"];
    name: string;
    image_small: string;
}
