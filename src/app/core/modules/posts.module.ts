import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';


import { IFile } from './../wpinterface';
import { WpcoreService } from './../wpcore.service';
import { WphelperModule } from './wphelper.module';
import { TaxonomyModule } from './taxonomy.module';

@NgModule({ 
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PostsModule { 
  posts: any;
  slugs: any;
  postTypes: any = {
    page: {
      title: 'Page',
    },
    post: {
      title: 'Post',
    }
  };

  constructor (
    private wpcore: WpcoreService,
    private wphelper: WphelperModule, 
    private taxo: TaxonomyModule,
    ){  
    this.getPosts();
  }

  //Load the posts from core and preprocess it
  loadPosts() {
    var posts = this.wpcore.getTable('posts');
    this.preparePosts();
    this.posts = posts;
  }

  getPosts(post_type?:string) {
    this.loadPosts();
    return this.posts;
  }

  getPostsDates(post_type?:string){

  }



  //Get array of unix time stamp and return array of month/year key-value
  public getDatesFromPosts(posts){

    if(!posts) {
      return false;
    }
    
    var idDates = _.indexBy(posts, 'ID');
    for(let _i in idDates) {
      idDates[_i] = _.propertyOf(idDates[_i])('post_date');
    }
    


    //var dates = idDates;
    
    if(!idDates) {
      return false;
    }

    var _options = {};
    var months = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
    ];
    for(let id in idDates) {
      
      var timestamp = idDates[id]; 
      
      var date = new Date(timestamp);
      let year:any = date.getFullYear(); // 2020
      let month:any = date.getMonth(); // 4 (note zero index: Jan = 0, Dec = 11)
      if(!_.has(_options, year)) {
        _options[year] = {};
      }

      if(!_.has(_options[year], month)) {
        _options[year][month] = [];
      }

      _options[year][month].push(parseInt(id));
    }
    return _options;
  }



  //prepare the posts after loading
  preparePosts(){

  }

  //Save new content
  addPost(){

  }
  //delete a content
  deletePost(){

  }

  //update a psot
  updatePost(){

  }
  //load a post
  getPost(){

  }
  //get post types
  getTypes(){
    return this.postTypes;
  }

  //Create a revision after a saving a post
  createRevision() {

  }

  //Delete revisions of particular post
  deleteRevisions() {

  }

  //Remove all the revisions
  purgeRevisions() {

  }

  purgeDrafts(){

  }



  
}
