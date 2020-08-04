//Core import
import { APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


//Third party import
import { ToastrModule } from 'ngx-toastr';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TreeModule } from '@circlon/angular-tree-component';
import { SortablejsModule } from 'ngx-sortablejs';



//Custom
import { WphelperModule } from './core/modules/wphelper.module';
import { MediaModule } from './core/modules/media.module';
import { WpcoreService } from './core/wpcore.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormlyHorizontalWrapper } from './core/components/settings/horizontal-wrapper';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { FooterComponent } from './core/components/sidebar/footer.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { TaxonomyComponent, TaxonomyFormComponent, TaxonomyCategoryComponent, TaxonomyPosttagComponent } from './core/components/taxonomy/taxonomy.component';
import { SettingsComponent,SettingsGeneralComponent,SettingsDiscussionComponent,
  SettingsMediaComponent, SettingsPermalinkComponent, SettingsReadingComponent,
  SettingsPrivacyComponent, SettingsWritingComponent

   } from './core/components/settings/settings.component';
import { WpeditorComponent } from './core/components/wpeditor/wpeditor.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngfModule, ngf } from "angular-file";

//import { OrderModule } from 'ngx-order-pipe';



import { MediaComponent } from './core/components/media/media.component';
import { MenusComponent } from './core/components/menus/menus.component';
import { MenuItemComponent } from './core/components/menus/menu-item.component';
import { WidgetsComponent } from './core/components/widgets/widgets.component';
import { ThemesComponent,ThemesListComponent } from './core/components/themes/themes.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';


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
    TaxonomyFormComponent,
    TaxonomyComponent,
    TaxonomyPosttagComponent,
    TaxonomyCategoryComponent,
    FormlyHorizontalWrapper,
    WpeditorComponent,
    MediaComponent,
    MenusComponent,   
    MenuItemComponent, WidgetsComponent,
    ThemesListComponent, ThemesComponent, DashboardComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    //OrderModule, 
    ToastrModule.forRoot(), // ToastrModule added 
    EditorModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,
    NgxDatatableModule,
    FormlyModule.forRoot(_formly_settings),
    FormlyBootstrapModule,
    HttpClientModule,
    WphelperModule,
    MediaModule,
    NgbModule,
    ngfModule,
    TreeModule,
    
    SortablejsModule.forRoot({ animation: 150}),
  ],
  providers: [
    WpcoreService,
    { provide: APP_INITIALIZER, useFactory: WpDBProvider, deps: [WpcoreService], multi: true }        
  ],
  bootstrap: [AppComponent],
  //schemas: [ NO_ERRORS_SCHEMA ]

})
export class AppModule { }
