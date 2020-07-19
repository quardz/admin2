import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';


import { WpcoreService } from '../../wpcore.service';


interface LooseObject {
    [key: string]: any
}



@Component({
  selector: 'settingsform',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  @Input() model: LooseObject = {};
  @Input() form: any = null;
  @Input() fields: FormlyFieldConfig[];
  @Input() page_title: any = '';
  @Input() page_description: any = '';
  @Input() submit_text: String = 'Submit';


  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 

    if(!this.form) {
      this.form = new FormGroup({});  
    }

    if(!this.fields) {

    }
    this.defaultModel();
    // Load default values to model
  }

  //Generate model from fields
  defaultModel() {
    if(this.fields) {
      for(let _i in this.fields) {
        let _key:string = String(this.fields[_i].key);
        let _has_model_field = _.has(this.model, _key);
        if(_key && (!_has_model_field || (_has_model_field && this.model._key)) ) {
          var _default_value = this.wpcore.getOption(_key);

          if(!_default_value && _.has(this.fields[_i], 'templateOptions') && _.has(this.fields[_i].templateOptions, '_default_value')) {
            _default_value = this.fields[_i].templateOptions._default_value;
          }
          this.model[_key] = _default_value;
        }
      }
    }    
  }

  //Get list of keys and default values
  initModel(keys: any) {
    if(keys) {
      for(let _key in keys) {
        var _default_value = this.wpcore.getOption(_key);
        if(!_default_value && keys[_key]) {
          _default_value = keys[_key];
        }
        this.model[_key] = _default_value;
      }
    }
  }
  
  onSubmit() {
    if(this.model) {
      for(let _key in this.model) {
        this.wpcore.setOption(_key, this.model[_key]);
      }
    }
    this.toastr.success('Success!', 'Form saved successfully!');
    console.log("submitted value", this.model);
  }


  ngOnInit(): void {
  }
}


@Component({
  selector: 'settings-form-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss']
})
export class SettingsGeneralComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.page_title = 'General Settings';

    this.fields = [
        {
          key: 'blogname',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Site Title',
            type: 'text',
            placeholder: 'Website name',
            required: true,
            _default_value: 'Your Site name',
          },

        },
        {
          key: 'blogdescription',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Tagline',
            type: 'text',
            placeholder: '',
            required: false,
            description: 'In a few words, explain what this site is about.'
          },
        },
        {
          key: 'siteurl',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'WordPress Address (URL)',
            type: 'url',
            placeholder: '',
            required: false,
            description: ''
          },
        },
        {  
          key: 'home',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Site Address (URL)',
            type: 'url',
            placeholder: '',
            required: false,
            description: ''
          },
        },
        {
          key: 'new_admin_email',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Administration Email Address',
            type: 'text',
            placeholder: '',
            required: false,
            description: 'This address is used for admin purposes. If you change this, we will send you an email at your new address to confirm it. The new address will not become active until confirmed.'
          },
        },
        {
          key: 'users_can_register',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Membership',
            required: false,
            options: [
              { label: 'Anyone can register', value: 'users_can_register' },        
            ],
          },
        },     
        {
          key: 'default_role',
          type: 'select',
          defaultValue: 'subscriber',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'New User Default Role',
            required: false,
            options: [
              { label: 'Subscriber', value: 'subscriber' },
              { label: 'Contributor', value: 'contributor' },
              { label: 'Author', value: 'author' },
              { label: 'Editor', value: 'editor' },
              { label: 'Administrator', value: 'administrator' },
            ],
          },
        },                     
        {
          key: 'date_format',
          type: 'radio',
          defaultValue: 'F j, Y',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Date Format',
            required: false,
            options: [
              { label: 'June 1, 2020 (F j, Y)', value: 'F j, Y' },
              { label: '2020-06-01 (Y-m-d)', value: 'Y-m-d' },
              { label: '06/01/2020 (m/d/Y)', value: 'm/d/Y' },
              { label: '01/06/2020 (d/m/Y)', value: 'd/m/Y' },
              { label: 'Custom', value: 'custom' },
            ],  
          },
        },        
        {
          key: 'time_format',
          type: 'radio',
          defaultValue: 'g:i a',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Time Format',
            required: false,
            options: [
              { label: '3:27 am (g:i a)', value: 'g:i a' },
              { label: '3:27 AM (g:i A)', value: 'g:i A' },
              { label: '03:27 (H:i)', value: 'H:i' },
              { label: 'Custom', value: 'custom' },
            ],
          },
        },    
        {
          key: 'start_of_week',
          type: 'select',
          defaultValue: 1,
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Week Starts On',
            required: false,
            options: [
              { label: 'Sunday', value: 0 },
              { label: 'Monday', value: 1 },
              { label: 'Tuesday', value: 2 },
              { label: 'Wednesday', value: 3 },
              { label: 'Thursday', value: 4 },
              { label: 'Friday', value: 5 },
              { label: 'Saturday', value: 6 },
            ],
          },
        }, 
      ];    
    this.defaultModel();
  }

  ngOnInit(): void {
  } 

}

@Component({
  selector: 'settings-form-discussion',
  templateUrl: './settings-discussion.component.html',
  styleUrls: ['./settings-discussion.component.scss']
})
export class SettingsDiscussionComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [
    {
      className: 'section-label',
      template: '<hr /><div><strong>Default post settings:</strong></div>',
    },

    {
      key: 'group1',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'default_pingback_flag',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Attempt to notify any blogs linked to from the post',
          },
        },
        {
          key: 'default_ping_status',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Allow link notifications from other blogs (pingbacks and trackbacks) on new posts',
            value: "open",
          },
        },
        {
          key: 'default_comment_status',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'text',
            label: ' Allow people to submit comments on new posts',
          },
        },
      ],
    },

    //Section 2

    {
      className: 'section-label',
      template: '<hr /><div><strong>Other comment settings:</strong></div>',
    },
    {
      key: 'group2',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'require_name_email',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Comment author must fill out name and email',
            value: '1',
          },
        },
        {
          key: 'comment_registration',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Users must be registered and logged in to comment',
            value: '1',
          },
        },  
        {
          key: 'close_comments_for_old_posts_group',
          fieldGroupClassName: 'close_comments_for_old_posts_group',
          fieldGroup: [
            {
              key: 'close_comments_for_old_posts',
              type: 'checkbox',
              wrappers: ['form-field-horizontal'],
              templateOptions: {
                required: false,
                type: 'checkbox',
                label: 'Automatically close comments on posts older than',
                value: '1',
              },           
            },
            {
              key: 'close_comments_days_old',
              type: 'input',
              //wrappers: ['form-field-horizontal'],
              defaultValue: 14,
              templateOptions: {
                label: 'days',
                type: 'number',
                placeholder: '',
                required: true,
                description: ''
              },
            },            
          ],
        },
        {
          key: 'show_comments_cookies_opt_in',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Show comments cookies opt-in checkbox, allowing comment author cookies to be set',
            value: '1',
          },
        },     
        {
          key: 'thread_comments_group',
          fieldGroupClassName: 'thread_comments_group',
          fieldGroup: [
            {
              key: 'thread_comments',
              type: 'checkbox',
              wrappers: ['form-field-horizontal'],
              templateOptions: {
                required: false,
                type: 'checkbox',
                label: 'Enable threaded (nested) comments',
                value: '1',
              },           
            },
            {
              key: 'thread_comments_depth',
              type: 'select',
              //wrappers: ['form-field-horizontal'],
              defaultValue: 7,
              templateOptions: {
                label: 'levels depth',
                required: false,
                options: [
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                  { label: '5', value: 5 },
                  { label: '6', value: 6 },
                  { label: '7', value: 7 },
                  { label: '8', value: 8 },
                  { label: '9', value: 9 },
                  { label: '10', value: 10 },
                ],
              },
            },            
          ],
        },  
        {
          key: 'page_comments_group',
          fieldGroupClassName: 'page_comments_group',
          fieldGroup: [
            {
              key: 'page_comments',
              type: 'checkbox',
              wrappers: ['form-field-horizontal'],
              templateOptions: {
                required: false,
                type: 'checkbox',
                label: 'Break comments into pages with',
                value: '1',
              },           
            },
            {
              key: 'comments_per_page',
              type: 'input',
              //wrappers: ['form-field-horizontal'],
              defaultValue: 50,
              templateOptions: {
                label: 'top level comments per page and the',
                required: false,
              },
            },   
            {
              key: 'default_comments_page',
              type: 'select',
              //wrappers: ['form-field-horizontal'],
              defaultValue: 'oldest',
              templateOptions: {
                label: 'page displayed by default Comments should be displayed with the',
                required: false,
                options: [
                  { label: 'newest', value: 'last' },
                  { label: 'oldest', value: 'first' },
                ],
              },
            },   
            {
              key: 'comment_order',
              type: 'select',
              //wrappers: ['form-field-horizontal'],
              defaultValue: 'asc',
              templateOptions: {
                label: 'comments at the top of each page',
                required: false,
                options: [
                  { label: 'asc', value: 'older' },
                  { label: 'desc', value: 'newer' },
                ],
              },
            },                                    
          ],
        },                          
      ]
    },


    //Section 3 Email me whenever
    {
      className: 'section-label',
      template: '<hr /><div><strong>Email me whenever:</strong></div>',
    },    
    {
      key: 'group3',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'comments_notify',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Anyone posts a comment',
          },
        },
        {
          key: 'moderation_notify',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'A comment is held for moderation',
          },
        },
      ],
    },

    //Section 4 Before a comment appears  
    {
      className: 'section-label',
      template: '<hr /><div><strong>Before a comment appears:</strong></div>',
    },    
    {
      key: 'group4',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'comment_moderation',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: ' Comment must be manually approved',
          },
        },
        {
          key: 'comment_whitelist',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: 'Comment author must have a previously approved comment',
          },
        },
      ],
    },

    //Section 5 Before a comment appears  
    {
      className: 'section-label',
      template: '<hr /><div><strong>Before a comment appears:</strong></div>',
    },       

    ];

    var keys = {
      default_pingback_flag: null,
      default_ping_status: null,
      default_comment_status: null,
      require_name_email: null,
      comment_registration: null,
      close_comments_for_old_posts_group: null,
      close_comments_days_old: null,
      show_comments_cookies_opt_in: null, 
      thread_comments: null,
      thread_comments_depth: null, 
      page_comments: null, 
      comments_per_page: null, 
      default_comments_page: null,
      comment_order: null,
      comments_notify: null,
      moderation_notify: null, 
      comment_moderation: null, 
      comment_whitelist: null, 
    };

    this.initModel(keys);
  }
}

@Component({
  selector: 'settings-form-media',
  templateUrl: './settings-media.component.html',
  styleUrls: ['./settings-media.component.scss']
})
export class SettingsMediaComponent extends SettingsComponent implements OnInit {
  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [

    {
      className: 'section-label',
      template: '<hr /><div><strong>Thumbnail size:</strong></div>',
    },

    {
      key: 'group1',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'thumbnail_size_w',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 150,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Width',
          },
        },
        {
          key: 'thumbnail_size_h',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 150,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Height',
          },
        },
        {
          key: 'thumbnail_crop',
          type: 'checkbox',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            required: false,
            type: 'checkbox',
            label: ' Crop thumbnail to exact dimensions (normally thumbnails are proportional)',
          },
        },        
      ],
    },

    //Section 2

    {
      className: 'section-label',
      template: '<hr /><div><strong>Medium size:</strong></div>',
    },

    {
      key: 'group1',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'medium_size_w',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 300,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Max Width',
          },
        },
        {
          key: 'medium_size_h',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 300,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Max Height',
          },
        },
      ],
    },

    //Section 3

    {
      className: 'section-label',
      template: '<hr /><div><strong>Large size:</strong></div>',
    },

    {
      key: 'group1',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'large_size_w',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 1024,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Max Width',
          },
        },
        {
          key: 'large_size_h',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: 1024,
          templateOptions: {
            required: true,
            type: 'number',
            label: 'Max Height',
          },
        },
      ],
    },        

    //Section 4 Uploading Files

    {
      className: 'section-label',
      template: '<hr /><div><strong>Uploading Files:</strong></div>',
    },
    {
      key: 'thumbnail_crop',
      type: 'checkbox',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        required: false,
        type: 'checkbox',
        label: ' Crop thumbnail to exact dimensions (normally thumbnails are proportional)',
      },        
    },

    ];
    var keys = {
      thumbnail_size_w: null, 
      thumbnail_size_h: null, 
      thumbnail_crop: null,
      medium_size_w: null, 
      medium_size_h: null, 
      large_size_w: null,
      large_size_h: null,


    };
    this.initModel(keys);
  }    

}



@Component({
  selector: 'settings-form-permalink',
  templateUrl: './settings-permalink.component.html',
  styleUrls: ['./settings-permalink.component.scss']
})
export class SettingsPermalinkComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [
    {
      key: 'selection',
      type: 'radio',
      defaultValue: 'posts',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Your homepage displays',
        required: false,
        options: [
          { 
            label: 'Plain www.yourwebsite.com/?p=123', 
            value: '' 
          },
          { label: 'Day and name http://www.yourwebsite.com/2020/06/02/sample-post/', 
            value: '/%year%/%monthnum%/%day%/%postname%/' 
          },
          { label: 'Month and name http://www.yourwebsite.com/2020/06/sample-post/', 
            value: '/%year%/%monthnum%/%postname%/' 
          },
          { label: 'Numeric http://www.yourwebsite.com/archives/123', 
            value: '/archives/%post_id%' 
          },
          { label: 'Post name http://www.yourwebsite.com/sample-post/', 
            value: '/%postname%/' 
          },
          { label: 'Custom Structure http://www.yourwebsite.com/2020/06/02/sample-post/', 
            value: 'custom' 
          },                                        
        ],
      },
    },

    {
      className: 'section-label',
      template: '<hr /><div><strong>Optional:</strong></div>',
    },    

    {
      className: 'section-text',
      template: '<div class = "desc">If you like, you may enter custom structures for your category and tag URLs here. For example, using topics as your category base would make your category links like http://wptest1.quardz.com/topics/uncategorized/. If you leave these blank the defaults will be used.</div>',
    },    
    {
      key: 'group3',
      //      defaultValue: undefined,
      //description: '(These settings may be overridden for individual posts.)',
      //fieldGroupClassName: 'hidechecklabel',

      fieldGroup: [

        {
          key: 'category_base',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: '',
          templateOptions: {
            label: 'Category base',
            type: 'text',
            placeholder: '',
            required: false,
            description: ''
          },
        },
        {
          key: 'tag_base',
          type: 'input',
          wrappers: ['form-field-horizontal'],
          defaultValue: '',
          templateOptions: {
            label: 'Tag base',
            type: 'text',
            placeholder: '',
            required: false,
            description: ''
          },
        },          
      ],
    },

  ];
    var keys = {
      selection: null, 
      category_base: null, 
      tag_base: null,
    };
    this.initModel(keys);
  }

}  


@Component({
  selector: 'settings-form-reading',
  templateUrl: './settings-reading.component.html',
  styleUrls: ['./settings-reading.component.scss']
})
export class SettingsReadingComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [
    {
      key: 'show_on_front',
      type: 'radio',
      defaultValue: 'posts',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Your homepage displays',
        required: false,
        options: [
          { label: 'Your latest posts', value: 'posts' },
          { label: 'A static page (select below)', value: 'page' },
        ],
      },
    },

    {
      key: 'page_on_front',
      type: 'select',
      defaultValue: '1',
      wrappers: ['form-field-horizontal'],
      
      templateOptions: {
        label: 'Homepage',
        required: false,
        options: [
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
        ],
      },
    }, 

    {
      key: 'page_for_posts',
      type: 'select',
      defaultValue: '1',
      wrappers: ['form-field-horizontal'],
      hideExpression: 'model.show_on_front == "posts"',
      templateOptions: {
        label: 'Posts page',
        required: false,
        options: [
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
        ],
      },
    },     

   {
      key: 'posts_per_page',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Blog pages show at most',
        type: 'number',
        placeholder: '',
        required: false,
        description: ''
      },
    },

    {
      key: 'posts_per_rss',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Syndication feeds show the most recent',
        type: 'number',
        placeholder: '',
        required: false,
        description: ''
      },
    },    

    {
      key: 'rss_use_excerpt',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Default Post Format',
        options: [
          { label: 'Full text', value: '0' },
          { label: 'Summary', value: '1' },
        ],
        required: true,
        description: 'Your theme determines how content is displayed in browsers. Learn more about feeds.',
      },
    }, 

    {
      key: 'blog_public',
      type: 'checkbox',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Search Engine Visibility ',
        required: false,
        options: [
          { label: 'Anyone can register', value: '0' },        
        ],
        description: 'Discourage search engines from indexing this site. It is up to search engines to honor this request.'
      },
    },      

  ];
    var keys = {
      show_on_front: null, 
      page_on_front: null, 
      page_for_posts: null,
      posts_per_page: null,
      posts_per_rss: null,
      rss_use_excerpt: null,
      blog_public: null,
    };
    this.initModel(keys);
  }
}


@Component({
  selector: 'settings-form-writing',
  templateUrl: './settings-writing.component.html',
  styleUrls: ['./settings-writing.component.scss']
})
export class SettingsWritingComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [
    {
      key: 'default_category',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Default Post Category',
        options: [
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
          { label: 'Tuesday', value: '2' }, 
          { label: 'Wednesday', value: '3' },
          { label: 'Thursday', value: '4' },
          { label: 'Friday', value: '5' },
          { label: 'Saturday', value: '6' },
        ],
        required: true,
      },
    },
    {
      key: 'default_post_format',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Default Post Format',
        options: [
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
          { label: 'Tuesday', value: '2' },
          { label: 'Wednesday', value: '3' },
          { label: 'Thursday', value: '4' },
          { label: 'Friday', value: '5' },
          { label: 'Saturday', value: '6' },
        ],
        required: true,
      },
    },


  ];

    var keys = {
      default_category: null, 
      default_post_format: null, 
    };
    this.initModel(keys);
  }

}


@Component({
  selector: 'settings-form-privacy',
  templateUrl: './settings-privacy.component.html',
  styleUrls: ['./settings-privacy.component.scss']
})
export class SettingsPrivacyComponent extends SettingsComponent implements OnInit {

  constructor(public wpcore: WpcoreService, public toastr: ToastrService) { 
    super(wpcore, toastr); 
    this.fields = [
    {
      key: 'page_for_privacy_policy',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      defaultValue: 7,
      templateOptions: {
        label: 'Change your Privacy Policy page',
        required: false,
        options: [
          { label: '2', value: 2 },
          { label: '3', value: 3 },
        ],
      },
    },    

    ];
 
    var keys = {
      page_for_privacy_policy: null, 
    };
    this.initModel(keys);
  }
}