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
  cur_theme: any;
  theme: any; //holds current theme obj


  constructor(private wpcore: WpcoreService, private toastr: ToastrService,) {  
    this.prepare()
    
    
    
  }

  prepare() {
    this.themes = this.wpcore.getThemes();
    this.cur_theme = this.wpcore.getTheme();
    if(this.themes) {
      for(let _i in this.themes) {
        if(this.cur_theme == this.themes[_i].machine_name) {
          this.theme = this.themes[_i];
          this.cur_theme = this.themes[_i].machine_name;
          break;
        }
      }
    }    
    console.log("current theme", this.cur_theme, this.themes, this.theme);
  }



  activateTheme(cur_theme, theme_title) {
    if(cur_theme) {
      this.cur_theme = cur_theme;
      this.wpcore.setTheme(cur_theme);
      this.toastr.success('Success!', "Changed to '" + theme_title + "' theme successfully!");
      this.prepare();
    } 
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
