import { Component, Input, OnInit, ViewChild } from '@angular/core';


import { FormGroup, ReactiveFormsModule,FormControl, ValidationErrors,FormBuilder } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import * as cloneDeep from 'lodash/cloneDeep';

import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';
import { TaxonomyModule } from '../../modules/taxonomy.module';



@Component({
  selector: 'taxonomy-form',
  templateUrl: './taxonomy-form.component.html',
  styleUrls: ['./taxonomy-form.component.scss']
}) 
export class TaxonomyFormComponent {
  
  @Input() taxonomy_machine_name: any;
  @Input() taxonomy_name: string = 'Category';


  //Data
  terms: any[];
  tax_tree: any;
  
  
  //Table 
  rows:any;
  tempRows = [];

  columns = [
    { prop: 'name', name: 'Name' }, 
    { prop: 'description', name: 'discp' }, 
    { prop: 'slug', name: "Slug" },
    { prop: 'count', name: "Count" }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  selectedRows = [];
  find: string;
  bulkOps = {
    'select': 'Bulk Actions',
    'delete': 'Delete',
  };

  // Forms
  form = new FormGroup({});
  model = { 
    name: "",
    slug: "",
    parent:0,
    description: "",
    taxonomy: "",
  };
  fields: FormlyFieldConfig[] = [];


  constructor (private wpcore: WpcoreService,  
    private wphelper: WphelperModule, 
    public taxo: TaxonomyModule,
    private toastr: ToastrService,
    //public fb: FormBuilder
      ) {

  }

  //Define forms for search and action forms
  /*
  termSearchForm = this.fb.group({
    searchterm: ['']
  });
  
  bulkActionsForm = this.fb.group({
    bulkaction: ['']
  });
  */


  //After Selecting rows
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selectedRows);

    this.selectedRows.splice(0, this.selectedRows.length);
    this.selectedRows.push(...selected);
  }


  ngxDataTableTerms() {
    //this.getData();
    this.rows = cloneDeep(this.terms);
    this.rows = [...this.rows];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempRows.filter(function (d) {
      if(d && _.has(d, 'name') && d.name) {
        var _name = d.name.toString() + '';
        return _name.toLowerCase().indexOf(val) !== -1 || !val;  
      }
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


  initiate() {
    
    this.tax_tree = this.taxo.getTaxonomyTree(this.taxonomy_machine_name);
    

    var selector = this.wphelper.treeSort(this.tax_tree);
    this.defineFields(selector);
    this.getData();    
    this.ngxDataTableTerms();
  }


  getData() {
    this.taxo.getTerms();
    this.terms = this.taxo.getTermsByTaxonomy(this.taxonomy_machine_name);
    this.tempRows = [...this.terms];
  }



  //forms 
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
        className: (this.taxonomy_machine_name == 'category') ? 'display' : 'hidden', 
        defaultValue: 0,
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
    var res = this.taxo.addTerm(this.model.name, this.taxonomy_machine_name, this.model.slug, this.model.description, this.model.parent);
    if(res.status) {
      this.toastr.success(res.message);
      this.model = {
        name: " ",
        slug: "",
        parent:0,
        description: "",
        taxonomy: "",            
      };      
    }
    else {
      this.toastr.error(res.message);
      console.log("error creating term", res.data);
    }
  }

  onSubmitbulkActionsForm() {/*
    var _counts = {
      total:0,
      deleted:0,
    };
    if(this.bulkActionsForm.get('bulkaction').value == 'delete') {  
      var rows = [];
      if(rows) {
        if(confirm("Are you sure to delete selected terms")) {
          for(let _index in rows) {
            var row = rows[_index];
            if(row) {
              var row_data = row.getData();
              if(row_data.term_id != 1) {
                _counts.total++;
                if(this.wpcore.deleteEntity(row_data.term_id, 'terms')) {
                  _counts.deleted++;
                }
              }
            }
          }
          this.toastr.success('Deleted!', "Deleted " + _counts.deleted + " of total " + _counts.total + ".");
        }
      }
      else {
        this.toastr.error("Error", "Nothing to delete, select atleast 1 item.");
      }
    }     */
  }

  termEdit() {

  }

  termQuickEdit() {

  }
  
  termDelete() {

  }

  ngOnInit() {
    this.initiate();
  }




  displayCheck(){return true;}

}

@Component({
  selector: 'taxonomy-editform',
  templateUrl: './taxonomy-editform.component.html',
  styleUrls: ['./taxonomy-editform.component.scss']
})
export class TaxonomyEditFormComponent implements OnInit {




  ngOnInit(): void {
  
  }
}


@Component({
  selector: 'taxonomy',
  templateUrl: './taxonomy.component.html', 
  styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {


  ngOnInit() {}
  ngOnDestroy() {}
}


@Component({
  selector: 'taxonomy-category',
  templateUrl: './taxonomy-category.component.html',  
})
export class TaxonomyCategoryComponent implements OnInit {
  ngOnInit() {
  }
}

@Component({
  selector: 'taxonomy-posttag',
  templateUrl: './taxonomy-posttag.component.html', 
})
export class TaxonomyPosttagComponent implements OnInit {
  ngOnInit() {
  }
}


