import { Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WeeklyPlan, WeeklyPlanId } from '../../model/weekly-plan';
import { StorageService } from '../../services/storage-service';
import { ApiService } from '../../services/api-service';
import { WeeklyPlanDay } from '../../model/weekly-plan-day';

@Component({
  selector: 'app-plan-week-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './plan-week-list.html',
  styleUrl: './plan-week-list.css',
})
export class PlanWeekList implements OnInit {
  private storageService = inject(StorageService);
  private apiService = inject(ApiService);

  @Input() set weeklyPlanCreate(value: number) {
    if (value > 0) this.loadPlans();
  }

  plans = signal<WeeklyPlan[]>([]);

  planActivo = signal<any>(null);

  currentWeekId = signal<string>('');

  ngOnInit() {
    this.calculateCurrentWeekId();
    this.loadPlans();
  }

  async loadPlans() {
    const data = this.storageService.getWeeklyPlansUser();
    data.sort((a, b) => b.id.localeCompare(a.id));
    this.plans.set(data);

    const idActual = this.planActivo()?.id;
    const planParaCargar = data.find(p => p.id === idActual) || data[0];

    if (planParaCargar) {
      await this.cargarDatosDesdeApi(planParaCargar);
    }
  }

  async onPlanChange(event: Event) {
    const id = (event.target as HTMLSelectElement).value as WeeklyPlanId;
    const plan = this.plans().find(p => p.id === id);
    if (plan) await this.cargarDatosDesdeApi(plan);
  }

  async cargarDatosDesdeApi(plan: WeeklyPlan) {
    const copiaDias = JSON.parse(JSON.stringify(plan.days));

    for (const dia of copiaDias) {
      if (dia.lunchMealId) {
        dia.lunchMeal = await this.apiService.getMealDetails(dia.lunchMealId);
      }

      if (dia.dinnerMealId) {
        dia.dinnerMeal = await this.apiService.getMealDetails(dia.dinnerMealId);
      }
    }

    this.planActivo.set({
      plan,
      days: copiaDias
    });
  }

  onDeleteCurrentPlan() {
    const plan = this.planActivo();
    if (plan && confirm(`¿Deseas borrar el plan ${plan.id}?`)) {
      this.storageService.deleteWeeklyPlan(plan);
      this.planActivo.set(null);
      this.loadPlans();
    }
  }

  calculateCurrentWeekId() {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    this.currentWeekId.set(`${now.getFullYear()}-W${weekNo < 10 ? '0' + weekNo : weekNo}`);
  }
}
