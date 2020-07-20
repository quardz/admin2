//Core import
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


//Third party import
import { ToastrModule } from 'ngx-toastr';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

//Custom
import { WpcoreService } from './core/wpcore.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormlyHorizontalWrapper } from './core/components/settings/horizontal-wrapper';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { TaxonomyComponent, TaxonomyFormComponent, TaxonomyTableComponent } from './core/components/taxonomy/taxonomy.component';
import { SettingsComponent,SettingsGeneralComponent,SettingsDiscussionComponent,
  SettingsMediaComponent, SettingsPermalinkComponent, SettingsReadingComponent,
  SettingsPrivacyComponent, SettingsWritingComponent

   } from './core/components/settings/settings.component';



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
    SettingsComponent, 
    SettingsGeneralComponent,
    SettingsDiscussionComponent,
    SettingsMediaComponent,
    SettingsPermalinkComponent,
    SettingsReadingComponent,
    SettingsPrivacyComponent, 
    SettingsWritingComponent,
    TaxonomyTableComponent,
    TaxonomyFormComponent,
    TaxonomyComponent,
    FormlyHorizontalWrapper,    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added    
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
