import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mi_app_02_m');
  public isServerRunning = false;
  public characters:{id:number, name:string}[] = [
    {id:1, name:'Luke Skywalker'},
    {id:2, name:'Darth Vader'},
    {id:3, name:'Leia Organa'},
    {id:4, name:'Han Solo'},
    {id:5, name:'Yoda'} 
  ];

}
