import { Component, OnInit, Input } from '@angular/core';
import Tabulator from 'tabulator-tables';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';

import { WpcoreService } from '../../wpcore.service';



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

  constructor (wpcore: WpcoreService) {
    this.tax_tree = wpcore.getTaxonomyTree(this.taxonomy_machine_name); 
    console.log("tax_tree", this.tax_tree);
  }

  form = new FormGroup({});
  model = {  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'tag_name',
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
      key: 'tag_slug',
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
      defaultValue: 'subscriber',
      //wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: 'Parent Category',
        required: false,
        description: this.taxonomy_name + ', unlike tags, can have a hierarchy. You might have a Jazz category, and under that have children categories for Bebop and Big Band. Totally optional.',
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
  onSubmit() {

    console.log(this.model, this.taxonomy_machine_name);
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

