import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnknownComponent } from './pages/unknown/unknown.component';
import { HomeComponent } from './pages/home/home.component';
import { LessonsComponent } from './pages/lessons/lessons.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'unknown', component: UnknownComponent },
  { path: 'lessons', component: LessonsComponent },
  { path: '**', redirectTo: '/unknown' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
