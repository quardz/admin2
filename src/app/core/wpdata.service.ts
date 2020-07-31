import { Injectable } from '@angular/core';
import { ITheme, IWidget, IRegion, IMenuItem, IMenu } from './wpinterface';

@Injectable({
  providedIn: 'root'
})
export class WpdataService {

  constructor() { }

  getWidgets() {
    let widgets = [];

    //Search Widgets
    var _search = {
      title: "Search",
      machine_name: 'search',
      description: "A search form for your site.",
      inputs: [
        {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Title',
            type: 'text',
            defaultValue: 'Search',
          },
        }
      ],
      weight: 10,
    }
    widgets.push(_search);

    //Recent Posts
    var _recent_posts = {
      title: "Recent Posts",
      machine_name: 'recent_posts',
      description: "Your site’s most recent Posts.",
      inputs: [
        {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Title',
            type: 'text',
            defaultValue: 'Search',
          },
        },
        {
          key: 'post_date',
          type: 'checkbox',
          defaultValue: true,
          templateOptions: {
            label: 'Display post date?',
          },
        },
        {
          key: 'nof_posts',
          type: 'input',
          defaultValue: 5,
          templateOptions: {
            label: 'Number of posts to show:',
            type: 'number',

          },
        },        
      ],
      weight: 11,
    }
    widgets.push(_recent_posts);  


    var _archives = {
      title: "Archives",
      machine_name: 'archives',
      description: "A Monthly archive of your site’s Posts.",
      inputs: [
        {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Title',
            type: 'text',
            defaultValue: 'Search',
          },
        },
        {
          key: 'display_as_dropdown',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Display as dropdown',
          },
        },        
        {
          key: 'show_post_counts',
          type: 'checkbox',
          defaultValue: true,
          templateOptions: {
            label: 'Show post counts',
          },
        },
      ],
      weight: 12,
    }
    widgets.push(_archives);  

    var _categories = {
      title: "Categories",
      machine_name: 'categories',
      description: "A Monthly archive of your site’s Posts.",
      inputs: [
        {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Title',
            type: 'text',
            defaultValue: 'Search',
          },
        },
        {
          key: 'display_as_dropdown',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Display as dropdown',
          },
        },        
        {
          key: 'show_post_counts',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Show post counts',
          },
        },
        {
          key: 'show_hierarchy',
          type: 'checkbox',
          defaultValue: false,
          templateOptions: {
            label: 'Show Hierarchy',
          },
        },        
      ],
      weight: 13,
    }
    widgets.push(_categories);  


    var _navigation_menu = {
      title: "Navigation Menu",
      machine_name: 'navigation_menu',
      description: "Add a navigation menu to your sidebar.",
      inputs: [
        {
          key: 'title',
          type: 'input',
          templateOptions: {
            label: 'Title',
            type: 'text',
            defaultValue: 'Search', 
          },
        },
        { 
          key: 'menu',
          type: 'select',
          defaultValue: false,
          templateOptions: {
            options: [],
          },
        },        
      ],
      weight: 13,
    }
    widgets.push(_navigation_menu);  


       

    return widgets;
  }

  getRegions(theme) {
    var themes = this.getThemes();
    if(themes) {
      for(let _t in themes) {
        if(theme == themes[_t].machine_name && themes[_t].regions) {
          return themes[_t].regions
        }
      }
    }
    return false;
  }

  //@todo automate
  getThemes() {
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

    let themes = [];

    themes.push(_theme_1);
    themes.push(_theme_2);
    themes.push(_theme_1);
    themes.push(_theme_2);    
    themes.push(_theme_1);
    themes.push(_theme_2);
    themes.push(_theme_1);
    themes.push(_theme_2);    
    themes.push(_theme_1);
    themes.push(_theme_2);
    themes.push(_theme_1);
    themes.push(_theme_2);    
    return themes;
  }


}
