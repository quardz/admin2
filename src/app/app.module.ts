import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';


import { WpcoreService } from './core/wpcore.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { TaxonomyComponent } from './core/components/taxonomy/taxonomy.component';
import { SettingsComponent,SettingsGeneralComponent } from './core/components/settings/settings.component';
import { FormlyHorizontalWrapper } from './core/components/settings/horizontal-wrapper';

var _formly_settings = {
    wrappers: [{ name: 'form-field-horizontal', component: FormlyHorizontalWrapper }],
    validationMessages: [
        { name: 'required', message: 'This field is required' },
    ],
/*    types: [
        { name: 'tinymce', component: FormlytinymceComponent } 
    ], 
*/
};

export function WpDBProvider(wpcore: WpcoreService) {
  return () => wpcore.load();
}


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    TaxonomyComponent,
    SettingsComponent, SettingsGeneralComponent,
    FormlyHorizontalWrapper,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(_formly_settings),
    FormlyBootstrapModule,
    HttpClientModule,
  ],
  providers: [
    WpcoreService,
    { provide: APP_INITIALIZER, useFactory: WpDBProvider, deps: [WpcoreService], multi: true }        
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
