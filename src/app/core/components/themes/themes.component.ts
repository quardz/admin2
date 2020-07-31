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

  constructor(private wpcore: WpcoreService) {  
    this.themes = wpcore.getThemes();
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
