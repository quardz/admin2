import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import Tabulator from 'tabulator-tables';
import { FormGroup, ReactiveFormsModule,FormControl, ValidationErrors,FormBuilder } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';

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


  title = 'DemoTabulator';
  terms: any[];
  columnNames: any[] = [];
  termTable: Tabulator;
  find: string;
  bulkOps = {
    'select': 'Bulk Actions',
    'delete': 'Delete',
  };


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

  bulkActionsForm = this.fb.group({
    bulkaction: ['']
  });

  termSearchForm = this.fb.group({
    searchterm: ['']
  });  


  constructor (private wpcore: WpcoreService,  
    private wphelper: WphelperModule, 
    private toastr: ToastrService,
    public fb: FormBuilder) {
      //this.initiate();
  }

  initiate() {
    console.log("initiate started");
    
    this.tax_tree = this.wpcore.getTaxonomyTree(this.taxonomy_machine_name);

    switch(this.taxonomy_machine_name) {
      case 'category':
        this.display_parent = true;
      break;

      case 'post_tag': 
        this.display_parent = false;
      break;

      default:
    }

    var selector = this.wphelper.treeSort(this.tax_tree);
    this.defineFields(selector);
    this.getData();    
    this.buildTable();
  }

  updateData() {

  }


  getData() {
    var data = this.wpcore.getData(); 
    this.terms = data.terms;    
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

        if(this.wphelper.isDuplicateTerm(term, this.wpcore.dbData.terms)) {
          this.toastr.error('Error!', "A term with the name provided already exists with this parent.");
        }
        else {
          var msg = this.wpcore.saveEntity(term, 'terms');
          this.refreshTable();
          this.toastr.success('Success!', "Created new Item");
          this.model = {
            name: " ",
            slug: "",
            parent:0,
            description: "",
            taxonomy: "",            
          };
        }
      }
    }
  }

  

  buildTable(): void {
    console.log("buildTable started");

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

    var tab_selector = "#tabulator-div-" + this.taxonomy_machine_name;
    
    this.termTable = new Tabulator(tab_selector, tab_settings); 

    this.termTable.setColumns(this.columnNames);
    this.termTable.clearData();
    this.termTable.setData(this.terms);
    this.termTable.setFilter(this.customFilter, {taxonomy: this.taxonomy_machine_name});
    console.log("in build,", this.taxonomy_machine_name, this.terms);
  }  

  ngOnInit() {
    this.initiate();
    //this.buildTable();
    console.log("oniniti started");
  }



  onSubmitbulkActionsForm() {
    var _counts = {
      total:0,
      deleted:0,
    };
    if(this.bulkActionsForm.get('bulkaction').value == 'delete') {  
      var rows = this.termTable.getRows("active");
      if(rows) {
        if(confirm("Are you sure to delete selected terms")) {
          for(let _index in rows) {
            var row = rows[_index];
            if(row.isSelected()) {
              var row_data = row.getData();
              if(row_data.term_id != 1) {
                _counts.total++;
                if(this.wpcore.deleteEntity(row_data.term_id, 'terms')) {
                  _counts.deleted++;
                }
              }
            }
          }
          this.refreshTable();
          this.toastr.success('Deleted!', "Deleted " + _counts.deleted + " of total " + _counts.total + ".");
        }
      }
      
      else {
        this.toastr.error("Error", "Nothing to delete, select atleast 1 item.");
      }


    } 
    

  }

  onSubmitTermSearchForm() {
    var _keyword = this.termSearchForm.get('searchterm').value; 
    if(_keyword) {
      this.termTable.clearFilter();
      this.termTable.setFilter(this.customFilter, {taxonomy: this.taxonomy_machine_name});
      var _filter = {
        field: "name",
        type: "like",
        value: _keyword,
      };
      this.termTable.setFilter([_filter]);
    }
    else {
      this.termTable.clearFilter();
      this.termTable.setFilter(this.customFilter, {taxonomy: this.taxonomy_machine_name});
    }
 
  }

  refreshTable() {    
    this.getData();
    this.termTable.replaceData(this.terms); 
    console.log("refreshTable started");
  }

  customFilter(data, filterParams){
      return data.taxonomy == filterParams.taxonomy; //must return a boolean, true if it passes the filter.
  }

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
export class TaxonomyComponent implements OnInit, OnDestroy {

  /*

  @Input() taxonomy_machine_name: string = "category";
  @Input() taxonomy_name: string = "Categories";
  display_parent = false;
  sub: any;

  constructor(public wpcore: WpcoreService, private route:ActivatedRoute, 
    private router: Router) { 

    //this.taxonomy_machine_name = this.actRoute.snapshot.params.taxonomy;



    
  }


  ngOnInit() {
    this.sub = this.route.data.subscribe(v => {
      this.taxonomy_machine_name = v.taxonomy;
      switch(this.taxonomy_machine_name) {
        case 'category':
          this.display_parent = true;
          this.taxonomy_name = 'Categories';
        break;

        case 'post_tag': 
          this.display_parent = false;
          this.taxonomy_name = 'Tags';
        break;

        default: 
      }        
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  */
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


