import { Component, inject } from '@angular/core';

import { LocalStorageService } from '../services/localstorage.service';
import { ApplyService } from '../services/apply.service';
import { WeekDay } from '../enums/week-day';

@Component({
  selector: 'app-apply',
  imports: [],
  templateUrl: './apply.html',
  styleUrl: './apply.css',
})
export class Apply {
  private localstorgaservice = inject(LocalStorageService);
  public applyService = inject(ApplyService);

  public weekDays: WeekDay[] = [
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
  ];

  constructor() {
    this.applyService.load();
  }
}
