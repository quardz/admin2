import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';


import { IFile } from './../wpinterface';
import { WpcoreService } from './../wpcore.service';
import { WphelperModule } from './wphelper.module';

@NgModule({ 
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class TaxonomyModule { 
  terms: any;
  slugs: any;
  taxonomies: any;

  constructor (
    private wphelper: WphelperModule, 
    private wpcore: WpcoreService){  

    this.getTerms();
  }

  loadTerms(){
    this.terms = this.wpcore.getTable('terms');
    this.getAllSlugs();
  }



  getTerms(){
    this.loadTerms();
    return this.terms;
  }

  getAllSlugs() {
    var slugs = [];
    for(let _i in this.terms) {
      if(this.terms[_i].slug) {
        slugs.push(this.terms[_i].slug);
      }
    }
    this.slugs = slugs;
    
  }

  // reutn {status:, msg:}
  addTerm(name, taxonomy, slug = '', description = '', parent?:any, weight?:any) {
    name = this.wphelper.stripTags(name);
    if(name && taxonomy) {
      if(!slug) {
        slug = this.wphelper.slugify(name);  
      }
      var term = {
        name: name,
        slug: slug,
        parent: parent ? parent : 0,
        taxonomy: taxonomy,
        description: this.wphelper.stripTags(description),
      };

      if(this.isDuplicateTerm(term)) {
        return {
          status: 0,
          message: 'A term with the name provided already exists with this parent.',
          data: null,
        }
      }
      else {
        var msg = this.wpcore.saveEntity(term, 'terms'); //Replace with better save entity, somthign like save term
        return {
          status: 1,
          message: 'Term created successfully!',
          data: msg,
        };
      }
    }
    return {
      status: 0,
      message: 'Fill the required fields!',
      data: null
    };
  }

  editTerm(term_id, term) {

  }

  deleteTerm() {

  }



  getTaxonomies() {

  }

  getTermsByTaxonomy(taxonomy: string = "category"){
    return _.filter(this.terms, function(item){ 
      return item.taxonomy == taxonomy; 
    });
  }


  getTaxonomyTree(taxonomy: string = "category") {
    var terms = this.getTermsByTaxonomy(taxonomy);
    return this.wphelper.list_to_tree(terms);
  } 


  //Check if current term is duplicate
  public isDuplicateTerm(term: any, terms?: any){
    if(!terms) {
      terms = this.terms;
    }
    var find = {
      name: term.name,
      slug: term.slug,
      parent: term.parent,
      taxonomy: term.taxonomy,
    };
    var com = _.findLastIndex(terms, find);
    if(com == -1) {
      return false;
    }
    return true;
    //name, slug, category, parent
  }





}
