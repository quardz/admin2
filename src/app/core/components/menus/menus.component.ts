import { Component, OnInit } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { TreeModule } from '@circlon/angular-tree-component';
import { SortablejsOptions, SortablejsModule } from 'ngx-sortablejs';


import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';
import { MenuItemComponent } from './menu-item.component'

export interface IMenuItem {
  title: string,
  id: number,
  link?: string,
  weight?: number,
  parent?: number,
  entity_type?: string,
  entity_id?: string,
  target?: string,
  attributes?: any,
  description?: any,
}

export interface IMenu {
  title: string,
  name: string, //unique machine name
  description?: string,
  items?: IMenuItem[], 
}



@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {

  menus: IMenu[];
  current_menu_key: any = 'primary';
  current_menu_index:any = 0;
  current_menu: any = [];
  locations: any;
  menutypes: any = {
    post: 'Post', 
    page: 'Page',
    link: 'Custom Link',
    category: 'Category', 
  }; 
  

  active = 1;

  



  name = 'Angular 6';


  options: SortablejsOptions = {
    group: 'test',
    onUpdate: () => {
      console.log('updated');
    },
    onAdd: () => {
      console.log('added');
    },
    onRemove: () => {
      console.log('removed');
    },
  };


// nodes  

  constructor(
    private wpcore: WpcoreService,  
    private wphelper: WphelperModule) {

    this.prepare();
  }

  prepare(){
    this.getMenus();
    this.getThemeLocations();
  }

  makeCurrentMenu() {
    console.log("current selected menu", this.current_menu);
    if(this.current_menu) {
      for(let _i in this.current_menu) {
        this.current_menu[_i].children = [];
        this.current_menu[_i].collapsed = true;
      }
    }
    console.log("tree menu", this.wphelper.list2tree(this.current_menu, 'id', 'children', 'parent'));
  }

  getNextMenuID() {
    return 4;//@todo fully
  }

  //get current theme location
  //@todo all
  getThemeLocations(theme?:string) {
    var locations = [
      {
        name: 'primary',
        title: 'Primary',
        menu: '',
      },
      {
        name: 'footer',
        title: 'Footer',
        menu: '',
      },
      {
        name: 'user',
        title: 'User',
        menu: '',
      },            
    ];
    this.locations = locations;
    return this.locations;
  }

  getMenus() {
    //@todo, make it dynamic
    this.menus = [
      {
        title: "Primary Menu",
        name: 'primary',
        items: [],
      },
      {
        title: "Secondary Menu",
        name: 'secondary',
        items: [],
      },
      {
        title: "Footer Menu",
        name: 'footer',
        items: [],
      },      
    ];
  }

  ngOnInit(): void {
  }

  changeMenu() {
    for(let _i in this.menus) {
      if(this.menus[_i].name == this.current_menu_key){
        this.current_menu_index = _i;
        this.current_menu = this.menus[_i].items;
        this.makeCurrentMenu();
        break;
      }
    }
  }

  createMenu() {

  }

  deleteMenu() {

  }

  addMenuItem(item, menu?:string) {
    this.current_menu.push(item);
    console.log("current menu item", this.current_menu);
  }

  deleteMenuItem(item, menu) {

  }

  getPostMenus() {

  }

  newmenuBox() {

  }

  newCustomMenu() {

  }

  removeMenuItem(id) {
    console.log("remove the entity id");
  }

  onClickSubmitcustomlinkform(item){
    if(item && item.newlink_url && item.newlink_text && this.wphelper.isValidUrl(item.newlink_url)) {
      var menuItem = {
        id: this.getNextMenuID(),
        entity_type: 'link',
        entity_id: '',
        link: item.newlink_url,
        title: item.newlink_text,
        weight: 0,
        parent: 0,
        children: [],
        isCollapsed: true,
        removed: false,
        entity_label: 'Custom Link',//this.menutypes['link'],
      }
      this.addMenuItem(menuItem);
      //item.newlink_url = '';
      //item.newlink_text = '';
    }
  }

}
