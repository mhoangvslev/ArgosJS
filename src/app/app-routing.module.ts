import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualiserComponent } from './visualiser/visualiser.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: 'visualiser', component: VisualiserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
