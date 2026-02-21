import { Component, inject, signal, input } from '@angular/core';
import { User } from '../../model/user';
@Component({
  selector: 'app-details-save',
  imports: [],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})


export class DetailsSave {
  idReceta = input.required<number>();
  user = input<User | null>();
  qHacerla = signal<boolean>(true);
  hecha = signal<boolean>(!this.qHacerla());



  ngOnInit() {
    console.log("-----------" + this.idReceta())

  }


  //TODO revisar funcionamiento
  onChangeObjetive(esHecha: boolean){
    this.qHacerla.set(esHecha);
  }
}
