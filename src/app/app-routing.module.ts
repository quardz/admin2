import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent,SettingsGeneralComponent } from './core/components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },

  { path: 'admin/dashboard', component: SettingsComponent },
  { path: 'admin/test', component: SettingsGeneralComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
