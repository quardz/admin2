import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent,SettingsGeneralComponent,SettingsDiscussionComponent, 
  SettingsMediaComponent,SettingsPermalinkComponent, SettingsReadingComponent, 
  SettingsPrivacyComponent, SettingsWritingComponent
} from './core/components/settings/settings.component';

import { TaxonomyComponent, TaxonomyCategoryComponent, TaxonomyPosttagComponent } from './core/components/taxonomy/taxonomy.component';
import { WpeditorComponent } from './core/components/wpeditor/wpeditor.component';
import { MediaComponent } from './core/components/media/media.component';
import { MenusComponent } from './core/components/menus/menus.component';
import { ThemesListComponent, ThemesComponent } from './core/components/themes/themes.component';
import { WidgetsComponent } from './core/components/widgets/widgets.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },

  { path: 'admin/dashboard', component: SettingsComponent },
  { path: 'admin/settings/general', component: SettingsGeneralComponent },
  { path: 'admin/settings/discussion', component: SettingsDiscussionComponent },
  { path: 'admin/settings/media', component: SettingsMediaComponent },
  { path: 'admin/settings/permalink', component: SettingsPermalinkComponent },
  { path: 'admin/settings/reading', component: SettingsReadingComponent },
  { path: 'admin/settings/privacy', component: SettingsPrivacyComponent },
  { path: 'admin/settings/writing', component: SettingsWritingComponent },    


  { path: 'admin/posts/category', component: TaxonomyCategoryComponent},
  { path: 'admin/posts/post_tag', component: TaxonomyPosttagComponent},
  
  { path: 'admin/posts/new', component: WpeditorComponent},

  { path: 'admin/media/library', component: MediaComponent},

  //Appearence
  { path: 'admin/themes/list', component: ThemesListComponent},
  { path: 'admin/themes/menus', component: MenusComponent},
  { path: 'admin/themes/widgets', component: WidgetsComponent}, 
  

];   

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
