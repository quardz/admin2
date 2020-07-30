import { Component, OnInit } from '@angular/core';
import { ITheme, IWidget, IRegion, IMenuItem, IMenu } from '../../wpinterface';

import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { ToastrService } from 'ngx-toastr';

import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';


@Component({
  selector: 'themes-list',
  templateUrl: './themes-list.component.html',
  styleUrls: ['./themes-list.component.scss']
})
export class ThemesListComponent implements OnInit {

  themes: ITheme[];

  constructor() { 
    this.getThemes();
  }

  //@todo Automate
  getThemes() {
    this.themes = [];
    var _theme_1 = {
      title: "Twenty Twelve",
      machine_name: "twentytwelve",
      version: "0.1",
      core: "^0.1",
      thumbnail: "http://wptest1.quardz.com/wp-content/themes/twentytwelve/screenshot.png",
      regions: [
        {
          title: "Main Sidebar",
          machine_name: "sidebar_main",
          description: "Appears on right hand side of all pages, occupies 25% of the screen.",
          weight: 1, 
        },
        {
          title: "Secondary Sidebar",
          machine_name: "sidebar_main",
          description: "Appears on left hand side of all pages, occupies 25% of the screen.",
          weight: 2, 
        },        
        {
          title: "Footer First",
          machine_name: "footer_first",
          description: "Appears on left hand side of footer on all pages. Occupies 33% of the content area.",
          weight: 3, 
        },
        {
          title: "Footer Middle",
          machine_name: "footer_middle",
          description: "Appears on middle of footer on all pages. Occupies 33% of the content area.",
          weight: 4, 
        },              
        {
          title: "Footer Last",
          machine_name: "footer_last",
          description: "Appears on right hand side of footer on all pages. Occupies 33% of the content area.",
          weight: 5, 
        },
      ],
    };

    var _theme_2 = {
      title: "Author",
      machine_name: "author",
      version: "0.1",
      core: "^0.1",
      thumbnail: "http://wptest1.quardz.com/wp-content/themes/author/screenshot.png",
      regions: [
        {
          title: "Primary Sidebar",
          machine_name: "sidebar_main",
          description: "Primary sidebar on left side.",
          weight: 1, 
        },
        {
          title: "Footer",
          machine_name: "footer",
          description: "Appears on left hand side of all pages, occupies 25% of the screen.",
          weight: 2, 
        },      
      ],      
    };    
    this.themes.push(_theme_1);
    this.themes.push(_theme_2);
    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    this.themes.push(_theme_1);
    this.themes.push(_theme_2);    
  }

  activateTheme(theme_name) {
    console.log(theme_name);
  }

  ngOnInit(): void {}

}



@Component({
  selector: 'themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
