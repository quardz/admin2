import { Component, OnInit, Input } from '@angular/core';
import Tabulator from 'tabulator-tables';
import { FormGroup, ReactiveFormsModule,FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';

import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';



@Component({
  selector: 'taxonomy-form',
  templateUrl: './taxonomy-form.component.html',
  styleUrls: ['./taxonomy-form.component.scss']
})
export class TaxonomyFormComponent implements OnInit {
  
  @Input() taxonomy_machine_name: string = 'category';
  @Input() taxonomy_name: string = 'Category';
  @Input() display_parent: boolean = false;

  tax_tree: any;
  form = new FormGroup({});
  model = { 
    name: "",
    slug: "",
    parent:0,
    description: "",
    taxonomy: "",
  };
  fields: FormlyFieldConfig[] = [];

  constructor (private wpcore: WpcoreService, private wphelper: WphelperModule, private toastr: ToastrService) {
    this.tax_tree = wpcore.getTaxonomyTree(this.taxonomy_machine_name); 
    if(this.taxonomy_machine_name == "category") {
      this.display_parent = true;
    }
    var selector = this.wphelper.treeSort(this.tax_tree);
    this.defineFields(selector);
    
  }

  defineFields(_parents?:any) {
  
    this.fields = [
      {
        key: 'name',
        type: 'input',
        //wrappers: ['form-field-horizontal'],
        templateOptions: {
          label: 'Name',
          type: 'text',
          placeholder: '',
          required: true,
          description: 'The name is how it appears on your site.',
        },
      },
      {
        key: 'slug',
        type: 'input',
        //wrappers: ['form-field-horizontal'],

        templateOptions: {
          label: 'Slug',
          type: 'text',
          placeholder: '',
          required: false,
          description: 'The “slug” is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.',
        },
      },
      {
        key: 'parent',
        type: 'select',
        className: this.display_parent ? 'display' : 'hidden', 
        defaultValue: 0,
        //wrappers: ['form-field-horizontal'],
        templateOptions: {
          label: 'Parent Category',
          required: false,
          description: this.taxonomy_name + ', unlike tags, can have a hierarchy. You might have a Jazz category, and under that have children categories for Bebop and Big Band. Totally optional.',
          options: _parents,
        },
      },       

      {
        key: 'description',
        type: 'textarea',
        //wrappers: ['form-field-horizontal'],
        templateOptions: {
          label: 'Description',
          type: 'textarea',
          placeholder: '',
          required: false,
          description: 'The description is not prominent by default; however, some themes may show it.',
        },
      },    

    ];
  }



  onSubmit() {
    
    if(this.model && _.has(this.model,'name')) {
      var name = this.wphelper.stripTags(this.model.name);
      if(name) {
        var slug = this.wphelper.slugify(name);
        var term = {
          name: name,
          slug: slug,
          parent: this.model.parent,
          taxonomy: this.taxonomy_machine_name,
          description: this.wphelper.stripTags(this.model.description),
        };

        var msg = this.wpcore.saveEntity(term, 'terms');

        //var msg = "Slug : " + slug + " :: name : " + name;
        this.toastr.success('Success!', msg);
        console.log("new term", msg);
        console.log("all terms", this.wpcore.dbData.terms);  
      }
    }
  }

  ngOnInit(): void {
  }



}

@Component({
  selector: 'taxonomy-table',
  templateUrl: './taxonomy-table.component.html',
  styleUrls: ['./taxonomy-table.component.scss']
})
export class TaxonomyTableComponent implements OnInit {
  title = 'DemoTabulator';
  terms: any[];
  columnNames: any[] = [];
  termTable: Tabulator;
  find: string;




  @Input() taxonomy_machine_name: string = "category";

  constructor(public wpcore: WpcoreService) { 
    var data = this.wpcore.getData();
    this.terms = data.terms;
    
  }

  ngOnInit(): void {

    this.columnNames = [

      { title: "Select", width: 75, formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},
      { title: "Id", field: "term_id",visible:false },
      { title: "Name", field: "name" },
      { title: "Description", field: "description"},//,editor:"textarea" },
      { title: "Slug", field: "slug",editor:"input" },
      { title: "Count", field: "count",formatter:"link", formatterParams:{
        labelField:"Count",
        urlPrefix:"https://posts.com/postsbytax/",
        } 
      },
    ];
    
    var tab_settings = {
        layout: 'fitColumns',
        //selectable:true,
        dataTree:true,
        movableRows: true, //enable user movable rows
        columns:[
          {
            formatter:"rowSelection", 
            titleFormatter:"rowSelection", 
            align:"center", 
            headerSort:false
          },
          {
            rowHandle:true, 
            formatter:"handle",  
            headerSort:false, 
            frozen:true, 
            width:30, 
            minWidth:30},
        ]
    };    

    //this.terms = ;
    
    this.termTable = new Tabulator("#tabulator-div", tab_settings); 
    this.termTable.setColumns(this.columnNames);
    this.termTable.setData(this.terms);
    this.termTable.setFilter(this.customFilter, {taxonomy: this.taxonomy_machine_name});

  }
  customFilter(data, filterParams){
      return data.taxonomy == filterParams.taxonomy; //must return a boolean, true if it passes the filter.
  }

  findbyname(event){
    console.log(event);
    this.termTable.clearFilter();    
    this.termTable.setFilter(this.customFilter, {taxonomy: this.taxonomy_machine_name});
    console.log(this.taxonomy_machine_name, event)
    if(event) {
      //this.myTable.setFilter("name", "LIKE", event);  
    }

  }

}


@Component({
  selector: 'taxonomy',
  templateUrl: './taxonomy.component.html',
  styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
  }

}

