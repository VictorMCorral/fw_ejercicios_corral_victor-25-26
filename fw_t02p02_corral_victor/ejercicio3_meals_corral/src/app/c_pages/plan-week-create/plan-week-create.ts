import { Component, EventEmitter, Output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayList, WeeklyPlanDay } from '../../model/weekly-plan-day';
import { WeekNumber, WeeklyPlan, WeeklyPlanId } from '../../model/weekly-plan';
import { StorageService } from '../../services/storage-service';
import { ApiService } from '../../services/api-service';
import { MyMeal } from '../../model/my-meal';

@Component({
  selector: 'app-plan-week-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-week-create.html',
  styleUrl: './plan-week-create.css',
})
export class PlanWeekCreate implements OnInit {
  private storageService = inject(StorageService);
  private apiService = inject(ApiService);

  @Output() createWeeklyPlan = new EventEmitter<boolean>();

  yearSelected = signal<number>(new Date().getFullYear());
  weekSelected = signal<WeekNumber | ''>('');
  listWeek = signal<WeekNumber[]>([]);
  userRecipes = signal<MyMeal[]>([]);

  diasSemana: DayList[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];

  selections = signal<WeeklyPlanDay[]>(
    this.diasSemana.map(d => ({ day: d }))
  );

  ngOnInit() {
    const weekNow = this.getWeekNumber();
    this.cargarSelectWeek(weekNow);
    this.loadUserRecipes();
  }

  async loadUserRecipes() {
    const userId = this.storageService.getUserSession()?.id;
    if (!userId) return;

    const favoriteMeals = this.storageService.getUserMeals(userId) ?? [];

    if (favoriteMeals.length > 0) {
      try {
        const detailPromises = favoriteMeals.map(fav =>
          this.apiService.getMealDetails(fav.mealId)
        );
        const results = await Promise.all(detailPromises);
        this.userRecipes.set(results.filter((meal): meal is MyMeal => meal !== null));
      } catch (error) {
        console.error("Error cargando detalles:", error);
      }
    }
  }

  onMealSelected(day: DayList, type: 'lunch' | 'dinner', event: Event) {
    const mealId = Number((event.target as HTMLSelectElement).value) || undefined;
    const days = this.selections();

    const dayToUpdate = days.find(d => d.day === day);

    if (dayToUpdate) {
      if (type === 'lunch') {
        dayToUpdate.lunchMealId = mealId;
      } else {
        dayToUpdate.dinnerMealId = mealId;
      }
    }

    this.selections.set([...days]);
  }

  onCreatePlan() {
    const user = this.storageService.getUserSession();
    if (!user) return;

    const newPlan: WeeklyPlan = {
      id: `${this.yearSelected()}-W${this.weekSelected()}` as WeeklyPlanId,
      userId: Number(user.id),
      days: this.selections()
    };

    this.storageService.saveWeeklyPlan(newPlan);
    this.createWeeklyPlan.emit(true);
  }

  // --- Helpers de fecha ---
  getWeekNumber(date: Date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  cargarSelectWeek(desde: number) {
    const semanas: WeekNumber[] = [];
    for (let i = desde; i <= 53; i++) {
      const num = i < 10 ? `0${i}` : `${i}`;
      semanas.push(num as WeekNumber);
    }
    this.listWeek.set(semanas);
    if (semanas.length > 0) this.weekSelected.set(semanas[0]);
  }

  onYearChange(event: Event) {
    this.yearSelected.set(Number((event.target as HTMLInputElement).value));
  }

  onWeekChange(event: Event) {
    this.weekSelected.set((event.target as HTMLSelectElement).value as WeekNumber);
  }
}
