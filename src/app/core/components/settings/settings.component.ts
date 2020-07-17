import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as _ from 'underscore';


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


  constructor() { 

    if(!this.form) {
      this.form = new FormGroup({});  
    }

    if(!this.fields) {
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
            settings: {
              default: 'Your Site name',
            }            
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
          defaultValue: '1',
          wrappers: ['form-field-horizontal'],
          templateOptions: {
            label: 'Week Starts On',
            required: false,
            options: [
              { label: 'Sunday', value: '0' },
              { label: 'Monday', value: '1' },
              { label: 'Tuesday', value: '2' },
              { label: 'Wednesday', value: '3' },
              { label: 'Thursday', value: '4' },
              { label: 'Friday', value: '5' },
              { label: 'Saturday', value: '6' },
            ],
          },
        }, 
      ];
    }
  
    if(!this.model || true) {
      this.model = {};
      //_k: string;
      //this.model = {[_k]: any};
      if(this.fields) {
        for(let _i in this.fields) {
          let _key:string = String(this.fields[_i].key);
          if(_key) {
            //this.model[_key] = (this.fields[_i].templateOptions.settings.default) ? this.fields[_i].templateOptions.settings.default : 'yean';
          }
          
          //this.model[this.fields[_i].key] = 
        }
      }

    }
    console.log("model ",this.model);
  }


  
  onSubmit() {
    console.log(this.model);
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

  constructor() { 
    super(); 
  }

  ngOnInit(): void {
  } 

}

