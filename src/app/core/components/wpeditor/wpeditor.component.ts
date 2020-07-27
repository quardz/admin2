import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips'; 


import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';





@Component({
  selector: 'wpeditor',
  templateUrl: './wpeditor.component.html',
  styleUrls: ['./wpeditor.component.scss'],
  encapsulation: ViewEncapsulation.None,
   
})
export class WpeditorComponent implements OnInit {
  
  //Inputs
  @Input() post_type: string = 'post';
  @Input() form_type: string = 'add';
  @Input() post_id: number = 0;  

  //Declarations
  form = new FormGroup({});
  model = { 
    items: [],
  };
  fields: FormlyFieldConfig[] = [];
  tinymce_init: any; 

  


  constructor(
    private wpcore: WpcoreService,  
    private wphelper: WphelperModule, 
    private toastr: ToastrService) {

    this.tinymce_init = wphelper.TinyMceInit();
    this.model.items = ['Pizza', 'Pasta', 'Parmesan'];
  }

  ngOnInit(): void {
  }


  onClickSubmit(formdata) {
    console.log("formdata", formdata);
    this.toastr.error("Error", "Nothing to delete, select atleast 1 item.");

  }







}