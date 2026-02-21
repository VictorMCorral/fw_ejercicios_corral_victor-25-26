import { Component, inject, signal, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from '../../model/user';
import { UserMeal, statusUserMeal } from '../../model/user-meal';
import { StorageService } from '../../services/storage-service';


@Component({
  selector: 'app-details-save',
  imports: [DatePipe],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})


export class DetailsSave {
  private storageService = inject(StorageService);

  idReceta = input.required<number>();
  userMeal = signal<UserMeal | null>(null);
  user = input<User | null>();

  qHacerla = signal<boolean>(true);
  hecha = signal<boolean>(false);
  puntuacion = signal<number>(0);
  notes: string = "";



  ngOnInit() {
    const meal = this.storageService.getUserMealById(this.idReceta());
    this.userMeal.set(meal);

    if (meal) {
      this.sincronizarEstados(meal.status === statusUserMeal.Done);
      this.puntuacion.set(meal.rating ?? 0);
    }

  }

  private sincronizarEstados(esHecha: boolean) {
    this.hecha.set(esHecha);
    this.qHacerla.set(!esHecha);
  }

  onChangeObjetive(esHecha: boolean) {
    const userMeal = this.userMeal();
    if (userMeal) {
      const updateMeal: UserMeal = { ...userMeal };

      if (esHecha) {
        updateMeal.status = statusUserMeal.Done;
      } else {
        updateMeal.status = statusUserMeal.Todo;
        delete updateMeal.rating;
        this.puntuacion.set(0);
        delete updateMeal.notes;
        this.notes = "";
      }

      this.userMeal.set(updateMeal);
      this.sincronizarEstados(esHecha);
    }
  }

  onChangeRating(event: any) {
    const puntuacion = event.target.value;
    const userMeal = this.userMeal();
    if (userMeal) {
      const updateMeal: UserMeal = { ...userMeal };
      updateMeal.rating = puntuacion;
      this.puntuacion.set(puntuacion);
      this.userMeal.set(updateMeal);
    }
  }

  onNoteChange(event: any) {
    const texto = event.target.value;
    this.notes = texto;
    const userMeal = this.userMeal();
    if (userMeal) {
      const updateMeal: UserMeal = { ...userMeal };
      updateMeal.notes = texto;
      this.userMeal.set(updateMeal);
    }

  }

  onCancel() {
    const userMeal = this.storageService.getUserMealById(this.idReceta());
    if (userMeal) {
      const updateMeal: UserMeal = { ...userMeal };
      const puntuacion = updateMeal.rating as number;
      const notes = updateMeal.notes as string;

      this.puntuacion.set(updateMeal.rating ?? 0);
      this.notes = updateMeal.notes ?? "";


      const status = userMeal.status;

      if (status === statusUserMeal.Todo) this.sincronizarEstados(false);
      if (status === statusUserMeal.Done) this.sincronizarEstados(true);

      this.userMeal.set(updateMeal);
    }
  }

  onSaveChanges() {
    const userMealSave: UserMeal = { ...this.userMeal() } as UserMeal;
    userMealSave.saveDate = new Date();
    this.storageService.saveUserMeals(userMealSave);
    this.userMeal.set(userMealSave);
  }
}
