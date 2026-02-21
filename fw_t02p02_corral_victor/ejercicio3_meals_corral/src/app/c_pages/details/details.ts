import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsMeal } from "../details-meal/details-meal";
import { DetailsSave } from "../details-save/details-save";
import { StorageService } from '../../services/storage-service';
import { User } from '../../model/user';

@Component({
  selector: 'app-details',
  imports: [DetailsMeal, DetailsSave],
  templateUrl: './details.html',
  styleUrl: './details.css',
})

export class Details {
  isSaved = signal<boolean>(false);
  idReceta: number =0;
  storageService = inject(StorageService);
  user : User | null = this.storageService.getUserSession();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idReceta = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.storageService.getUserSession();
    if(this.user && this.idReceta) {
      let exists =this.storageService.existsMealsInUser(this.user.id, this.idReceta )
      this.isSaved.set(exists);
    }
  }

  isRemovedOutput(isSavedOutput: boolean) :void{
    this.isSaved.set(isSavedOutput);
  }
}
