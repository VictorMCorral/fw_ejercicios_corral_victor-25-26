import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { User } from './user/user';
import { Home } from './home/home';
import { Form } from './form/form';

const routes: Routes = [
  { path: '', title: 'App Home', component: Home },
  { path: 'user', title: 'App User', component: User },
  { path: 'form', title: 'App Form', component: Form },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
