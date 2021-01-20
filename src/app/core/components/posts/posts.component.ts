import { Component, Input, OnInit, ViewChild } from '@angular/core';


import { FormGroup, ReactiveFormsModule,FormControl, ValidationErrors,FormBuilder } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { NgxDatatableModule,DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import * as cloneDeep from 'lodash/cloneDeep';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';
import { TaxonomyModule } from '../../modules/taxonomy.module';
import { PostsModule } from '../../modules/posts.module';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() post_type: string = 'page';

  //Data
  posts: any;
  postTypes: any;
  
  //table
  @ViewChild(DatatableComponent) posttable: DatatableComponent;
  columns: any; 
  rows:any;
  tempRows = [];    
  selectedRows = [];
  find: string;

  //Quick Edit
  quickEditID: number = 0;
  quickEditPost: any;


  constructor(
    private wpcore: WpcoreService,  
    private wphelper: WphelperModule, 
    public taxo: TaxonomyModule,
    public post: PostsModule,
    private toastr: ToastrService,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    public fb: FormBuilder,
    ) { 

  }

  //Build the table
  tableBuild() {
    this.columns = [
      //{ prop: 'ID', name: 'ID' }, 
     // { prop: 'post_title', name: 'title' }, 
      //{ prop: 'post_author', name: 'post_author' }, 
    ];

    if(this.post_type == 'page') {
      //this.columns.push({ prop: 'post_categories', name: 'post_categories' });
      //this.columns.push({ prop: 'post_tags', name: 'post_tags' });
    }
    //this.columns.push({ prop: 'comment_count', name: 'comment_count' });
    //this.columns.push({ prop: 'post_date', name: 'post_date' });

  }

  getData(){
    var _posts = this.post.getPosts(this.post_type);
    var _post_type = this.post_type;
    var _post_filtered = _.filter(_posts, function(item){ 
      return item.post_type == _post_type; 
    });    
    this.posts = cloneDeep(_post_filtered);
    this.rows = cloneDeep(_post_filtered);
    this.tempRows = [...this.rows];
  }

  ngxDataTableTerms() {
    //this.getData();
    this.rows = cloneDeep(this.posts);
    this.rows = [...this.rows];
  }


  //After Selecting rows
  onSelect({ selected }) {
    this.selectedRows.splice(0, this.selectedRows.length);
    this.selectedRows.push(...selected);
  }

  searchPosts(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempRows.filter(function (d) {
      if(d && _.has(d, 'post_title') && d.post_title) {
        var post_title = d.post_title.toString() + '';
        return post_title.toLowerCase().indexOf(val) !== -1 || !val;  
      }
    });

    this.rows = temp;
    this.posttable.offset = 0;
  }

  dummy(one_?:any, two_?:any, three?:any) {
    console.log();
  }

  initiate() {
    //get all posts postTypes
    this.postTypes = this.post.getTypes();
    this.getData();
    this.tableBuild();
    this.ngxDataTableTerms();


    console.log("id dates", this.post.getDatesFromPosts(this.posts));
  }

  displayCheck(){return true;}

  ngOnInit(): void {
    this.initiate();

  }

}
