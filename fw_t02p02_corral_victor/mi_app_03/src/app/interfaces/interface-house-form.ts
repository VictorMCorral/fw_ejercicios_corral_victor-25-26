import { WeekDay } from "../enums/week-day";
export interface InterfaceHouseForm {
  firstName: string;
  lastName: string;
  email: string;
  housingLocationId: number;
  consultaDate: Date;
  id: number;
  assignedDay?: WeekDay;

}
