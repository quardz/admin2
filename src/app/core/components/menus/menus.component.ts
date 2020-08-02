import { Component, OnInit } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { ToastrService } from 'ngx-toastr';
import { SortablejsOptions, SortablejsModule } from 'ngx-sortablejs';

import { ITheme, IWidget, IRegion, IMenuItem, IMenu } from '../../wpinterface';
import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';
import { MenuItemComponent } from './menu-item.component';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {

  menus: IMenu[];
  current_menu_key: any = 'primary';
  current_menu_index:any = 0;
  current_menu_title: string = '';
  current_menu: any = [];
  locations: any;
  menutypes: any = {
    post: 'Post', 
    page: 'Page',
    link: 'Custom Link',
    category: 'Category', 
  }; 
  posts: any = {
    post: {},
    page: {},
  };
  postTitles: any = {};
  menuCounter = 1;
  postlinkform: any;
  pagelinkform: any;

  categories: any;
  categoryTitle: any = {};

  activeTag = 1;
  new_menu_name: string = '';
  





  options: SortablejsOptions = {
    group: 'meunus',
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
    private toastr: ToastrService,
    private wpcore: WpcoreService,  
    private wphelper: WphelperModule) {

    this.prepare();
  }

  prepare(){
    this.loadMenuID();
    this.getMenus();
    this.getThemeLocations();
    this.getPostsMenu('page');
    this.getPostsMenu('post');
    this.changeMenu();
    this.getCategoryMenu();
  }

  makeCurrentMenu() {
    if(this.current_menu) {
      for(let _i in this.current_menu) {
        if(!this.current_menu[_i].children) {
          this.current_menu[_i].children = [];  
        }
        this.current_menu[_i].isCollapsed = true;
      }
    }
  }

  getNextMenuID() {
    this.menuCounter++;
    return this.menuCounter;//@todo fully
  }

  loadMenuID(){
    if(!this.menuCounter) {
      this.menuCounter = 1;
    }
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
        this.current_menu = cloneDeep(this.menus[_i].items);
        this.current_menu_title = cloneDeep(this.menus[_i].title);
        this.makeCurrentMenu();
        break;
      }
      else {
        this.current_menu = [];
        this.current_menu_title = '';
        this.current_menu_index = null;        
      }
    }

  }

  createMenu() {
    var _menu_keys = _.pluck(this.menus, 'name');
    var menu_key = this.wphelper.getUniqueSlug(this.new_menu_name, _menu_keys);
    if(menu_key && this.new_menu_name) {
      var _new_menu = {
        title: this.new_menu_name,
        name: menu_key,
        items: [],
      };
      this.menus.push(_new_menu);
      this.current_menu_key = menu_key;
      this.changeMenu();
      this.activeTag = 1;
      this.toastr.success('Success!', "Created '" + this.new_menu_name + "' menu successfully!");

    }
    console.log("new menu is ", this.new_menu_name, this.menus);
  }

  deleteMenu() {
    var _del = confirm("Are you sure you want to delete this menu?. It's irreversable");
    if(_del) {
      for(let _i in this.menus) {
        if(this.menus[_i].name == this.current_menu_key){
          this.menus.splice(parseInt(_i), 1);
          //delete this.menus[_i];

          console.log("deleted", this.menus, this.current_menu);
          this.current_menu_key = '';

          this.current_menu = [];
          this.toastr.success('Deleted!', "Deleted '" + this.current_menu_title + "' menu successfully!");
          this.current_menu_title = '';     
          this.changeMenu();     
          break;
        }
      }
    }  
  }

  addMenuItem(item, menu?:string) {
    this.current_menu.push(item);
  }

  deleteMenuItem(item, menu) {

  }

  

  newmenuBox() {

  }

  newCustomMenu() {

  }

  saveMenu(){
    var tree = this._purifyMenu( cloneDeep(this.current_menu ));
    tree = this._purifyMenu(tree);
    for(let _i in this.menus) {
      if(this.menus[_i].name == this.current_menu_key) {
        this.menus[_i].title = this.current_menu_title;
        this.menus[_i].items = tree;
        break;
      }
    }
    this.wpcore.setThemeSettings('menus', this.menus);
    this.toastr.success('Saved!', "Saved '" + this.current_menu_title + "' menu successfully!");
  }

  _purifyMenu(tree){
    var _removeables = [
      'collapsed', 'entity_label', 'isCollapsed', 'removed'
    ];
    if(tree) {
      for(let _t in tree) {
        if(tree[_t].removed) {
          delete tree[_t];
          continue;
        }      
        for(let _r in _removeables) {
          delete tree[_t][_removeables[_r]];
        }
        if(tree[_t].children && !tree[_t].removed) {
          tree[_t].children = this._purifyMenu(tree[_t].children);  
        }
      }  
    }
    return tree;
  }

  saveLocations(){
    var locations = {};
    for(let _l in this.locations) {
      locations[this.locations[_l].name] = this.locations[_l].menu;
    }

    this.wpcore.setThemeSettings('menu_locations', locations);
        console.log("menu locations", locations);

    this.toastr.success('Saved locations successfully!', "Success");
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
        children: [],
        isCollapsed: true,
        removed: false,
        entity_label: 'Custom Link',
      }
      this.addMenuItem(menuItem);
    }
  }

  //Pages Menu 
  getPostsMenu(post_type) {
    var _posts = cloneDeep(this.wphelper.getPostsByType(this.wpcore.dbData.posts, post_type));
    if(_posts) {
      for(let _p in _posts) {
        _posts[_p]._selected = false;
        this.postTitles[_posts[_p].ID] = _posts[_p].post_title;
        
      }
      this.posts[post_type] = _posts;
    }
    return false;
  }

  onClickSubmitpostlinkform(formvalue, post_type, third) {
    if(formvalue){
      for(let _p in formvalue) {
        if(formvalue[_p]) {
          var menuItem = {
            id: this.getNextMenuID(),
            entity_type: 'post',
            entity_id: parseInt(_p),
            //link: ,
            title: this.postTitles[_p],
            children: [],
            isCollapsed: true,
            removed: false,
            entity_label: post_type,
          };
          this.addMenuItem(menuItem);

        }
      } 
      this.getPostsMenu(post_type);
    }
  }


  //Get the categories for menu
  getCategoryMenu() {

    var _tax_tree = this.wpcore.getTaxonomyTree('category');
    var _categories = this.wphelper.treeSort(_tax_tree, 0, '-');
    if(_categories) {
      for(let _c in _categories) {
        var _term_id = _categories[_c].value;
        if(_term_id) {
          _categories[_c]._selected = false;
          this.categoryTitle[_term_id] = _categories[_c].label;
        }
      }
    }
    this.categories = _categories;
  }

  onClickSubmitcategorylinkform(formValue) {
    if(formValue) {
      for(let _p in formValue) {
        if(formValue[_p]) {
          var menuItem = {
            id: this.getNextMenuID(),
            entity_type: 'taxonomy',
            entity_id: parseInt(_p),
            //link: ,
            title: this.categoryTitle[_p],
            children: [],
            isCollapsed: true,
            removed: false,
            entity_label: 'Category',
          };
          this.addMenuItem(menuItem);
        }
      }
    }
    this.getCategoryMenu();
  }
}
