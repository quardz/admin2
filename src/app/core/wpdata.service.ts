import { Injectable } from '@angular/core';
import { ITheme, IWidget, IRegion, IMenuItem, IMenu } from './wpinterface';

@Injectable({
  providedIn: 'root'
})
export class WpdataService {

  constructor() { }

  getWidgets() {
    let widgets = {

      //Search Widgets
      search: {
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
      },

      //Recent Posts
      recent_posts: {
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
              defaultValue: 'Recent Posts',
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
      },


      archives: {
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
              defaultValue: 'Archives',
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
      },
      
      categories: {
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
              defaultValue: 'Categories',
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
      },

      navigation_menu: {
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
            },
          },
          { 
            key: 'menu',
            type: 'select',
            templateOptions: {
              options: [],
            },
          },        
        ],
        weight: 13,
      },

      pages: {
        title: "Pages",
        machine_name: 'pages',
        description: "A list of your site’s Pages.",
        inputs: [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              type: 'text',
              defaultValue: 'Pages', 
            },
          },
          { 
            key: 'sort_by',
            type: 'select',
            defaultValue: 'ID',
            templateOptions: {
              label: 'Sort By',            
              options: [
                {value: 'post_title', label: "Post Title"},
                {value: 'menu_order', label: "Menu Order"},
                {value: 'ID', label: "Page ID"},
              ],
            },
          },        
          {
            key: 'excludes',
            type: 'input',
            templateOptions: {
              label: 'Exclude',
              type: 'text',
              description: "Page IDs, separated by commas.",
            },
          },        
        ],
        weight: 14,
      },

      custom_html: {
        title: "Custom HTML",
        machine_name: 'custom_html',
        description: "Arbitrary HTML code.",
        weight: 15,
        inputs: [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              type: 'text',
              defaultValue: 'Pages', 
            },
          },
          { 
            key: 'content',
            type: 'textarea',
            templateOptions: {
              label: 'Content',            
            },
          },        
        ],
      },
      calendar: {
        title: "Calendar",
        machine_name: 'calendar',
        description: "A calendar of your site’s posts.",
        inputs: [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              type: 'text',
              defaultValue: 'Calendar',
            },
          }
        ],
        weight: 16,
      },

      meta: {
        title: "Meta",
        machine_name: 'meta',
        description: "Login, RSS, & WordPress.org links.",
        weight: 17,
        inputs: [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              type: 'text',
              defaultValue: 'Meta',
            },
          }
        ],
      },

      tag_cloud: {
        title: "Tag Cloud",
        machine_name: 'tag_cloud',
        description: "A cloud of your most used tags.",
        inputs: [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              type: 'text',
              defaultValue: 'Tag Cloud', 
            },
          },
          { 
            key: 'taxonomy',
            type: 'select',
            defaultValue: 'post_tag',
            templateOptions: {
              label: 'Taxonomy',            
              options: [
                {value: 'category', label: "Categories"},
                {value: 'post_tag', label: "Post Tags"},
                {value: 'ID', label: "Page ID"},
              ],
            },
          },        
          {
            key: 'show_tag_counts',
            type: 'checkbox',
            defaultValue: false,
            templateOptions: {
              label: 'Show tag counts',
            },
          },      
        ],
        weight: 17,
      },
    };

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
      regions: {
        sidebar_main: {
          title: "Main Sidebar",
          machine_name: "sidebar_main",
          description: "Appears on right hand side of all pages, occupies 25% of the screen.",
          weight: 1,           
        },
        sidebar_secondary: {
          title: "Secondary Sidebar",
          machine_name: "sidebar_secondary",
          description: "Appears on left hand side of all pages, occupies 25% of the screen.",
          weight: 2, 
        },        
        footer_first: {
          title: "Footer First",
          machine_name: "footer_first",
          description: "Appears on left hand side of footer on all pages. Occupies 33% of the content area.",
          weight: 3, 
        },
        footer_middle: {
          title: "Footer Middle",
          machine_name: "footer_middle",
          description: "Appears on middle of footer on all pages. Occupies 33% of the content area.",
          weight: 4, 
        },              
        footer_last: {
          title: "Footer Last",
          machine_name: "footer_last",
          description: "Appears on right hand side of footer on all pages. Occupies 33% of the content area.",
          weight: 5, 
        },
      },
    };

    var _theme_2 = {
      title: "Author",
      machine_name: "author",
      version: "0.1",
      core: "^0.1",
      thumbnail: "http://wptest1.quardz.com/wp-content/themes/author/screenshot.png",
      regions: {
        sidebar_main: {
          title: "Primary Sidebar",
          machine_name: "sidebar_main",
          description: "Primary sidebar on left side.",
          weight: 1, 
        },
        footer: {
          title: "Footer",
          machine_name: "footer",
          description: "Appears on left hand side of all pages, occupies 25% of the screen.",
          weight: 2, 
        },      
      },      
    };    

    let themes = [];

    themes.push(_theme_1);
    themes.push(_theme_2);
        
    return themes;
  }

  //This is set of options for options table
  getWpOptions() {
    var options:any = {
      themes: {
        

      },
      widgets: {

      }


    };
    return options;
  }

}
