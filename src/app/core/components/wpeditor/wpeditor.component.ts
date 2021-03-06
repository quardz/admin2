import { Component, OnInit,Input, ViewEncapsulation } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';


import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';
import { TaxonomyModule } from '../../modules/taxonomy.module';




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
    ID: 0,
    post_title: '',
    post_content: '',
    post_url: '',
    post_author: 1,
    post_date: '',
    post_excerpt: '',
    post_name: '',
    post_parent: 0,
    post_status: 0,
    post_type: '',
    post_tags: [],
    _post_categories: [],
    _post_tags: [],
    

  };

  fields: FormlyFieldConfig[] = [];
  tinymce_init: any; 
  items = ['Pizza', 'Pasta', 'Parmesan'];

  
  categories: any;
  post_tags: any;


  constructor(
    private wpcore: WpcoreService,  
    private wphelper: WphelperModule,
    private taxo: TaxonomyModule, 
    private toastr: ToastrService) {

    this.prepareFormData();
    this.tinymce_init = wphelper.TinyMceInit();
  }

  prepareFormData() {
    this.categories = this.taxo.getTaxonomyTree('category');


    this.post_tags = this.taxo.getTaxonomyTree('post_tag');
  }

  ngOnInit(): void {
  }


  onClickSubmit(formdata) {
    console.log("formdata", formdata);
    this.toastr.error("Error", "Nothing to delete, select atleast 1 item.");

  }







}