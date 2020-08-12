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

  //@todo bring all datafix stuffs about term here from wpcore if possible 

  loadTerms(){
    this.terms = this.wpcore.getTable('terms');
    this.getAllSlugs();
  }

  //Reorder the terms based on the tree structure for better table disply 
  loadCategory(){
    var _terms = this.wpcore.getTable('terms');
    var categories = _.filter(_terms, function(item){ 
      return item.taxonomy == 'category'; 
    });
    var tree =  this.wphelper.list_to_tree(categories);
    var flat_tree = this.treeSort(tree);
    var new_terms:any = [];
    if(flat_tree && categories) {
      for (let _f in flat_tree) {
        var flat_term_id = flat_tree[_f].value;
        var new_term = _.filter(categories, function(item){ 
          return item.term_id == flat_term_id; 
        });
        if(new_term && _.size(new_term)) {
          new_term[0].parents = this.getParents(new_term[0].term_id, categories);
          new_terms.push(new_term[0]);  
        }
        
      }
    }
    return new_terms;
  }

  getTermByID(term_id){

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

  //Get list of parents of given term ID
  getParents(term_id, terms) {
    var parents = [];
    if(terms && term_id) {
      var term = _.filter(terms, function(item){ 
        return item.term_id == term_id; 
      });
      if(term && _.size(term)) {
        var parent_id = term[0].parent;
        
        if(parent_id) {
          parents.push(parent_id);
          var _parents = this.getParents(parent_id, terms);
          if(_parents) {
            for(let _p in _parents) {
              parents.push(_parents[_p]);
            }
          }
        }
      }
    }
    return parents;
  }

  //Get list of children of given term id 
  getChildren(term_id, terms){
    //@todo everything 
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

  updateTerm(term) {
    var _term_id = 0;
    if(_.isString(term)) {
      _term_id = parseInt(term);
    }

    if(_.isObject(term)) {
      _term_id = term.term_id;
    }

    if(this.terms && _term_id && _.isNumber(_term_id) 
      && _term_id > 1 && term && term.name && term.term_id && term.slug) {
      for(let _t in this.terms) {
        if(this.terms[_t].term_id == _term_id) {
          var _terms = this.getTermsBySlug(term.slug, term.taxonomy, term.parent);
          if(_terms) {
            if(_terms) {
              if(_.size(_terms) == 1 && _terms[0].term_id == _term_id) {
                this.terms[_t].name = term.name;
                this.terms[_t].slug = term.slug;
                this.terms[_t].description = term.description;
                this.terms[_t].parent = term.parent;
                return {
                  status: 1,
                  message: 'Term updated successfully!',
                };
              }
              else {
                return {
                  status: 0,
                  message: 'Error!, Slug should be unique.',
                };
              }
            }
          }
        }
      }
    }
    return {
      status: 0,
      message: 'Unknown error!',
    }
  }

  getTermsBySlug(slug, taxonomy?:string, parent?:any) {
    var _filter:any = {
      slug: slug
    };
    if(taxonomy) {
      _filter.taxonomy = taxonomy;
    }
    if(parent) {
      _filter.parent = parent;
    }    
    return _.where(this.terms, _filter);
  }

  deleteTerm(row:any, confirmation = true) {
    //@todo
    //Reordering the tree after delete

    var _term_id = row;
    if(_.isString(row)) {
      _term_id = parseInt(row);
    }

    if(_.isObject(row)) {
      _term_id = row.term_id;
    }

    if(this.terms && _term_id && _.isNumber(_term_id) && _term_id > 1) {

      for(let _t in this.terms) {
        if(this.terms[_t].term_id == _term_id) {

          if(!confirmation || confirm("Are you sure to delete :: " + this.terms[_t].name)) {          
            var _delete_term = cloneDeep(this.terms[_t]);
            //@todo reordering the tree here to escap the errors
            this.terms.splice(_t, 1);
            return {
              status: 1,
              message: 'Deleted the term "' + _delete_term.name + '" successfully!',
              data: _delete_term,
            }
            break;
          }
        }
      }
    }
    return {
      status: 0,
      message: "Can't delete, unknown error!",
    };
  }



  getTaxonomies() {

  }

  getTermsByTaxonomy(taxonomy: string = "category"){

    if(taxonomy == 'category') {
      return this.loadCategory();
    }

    return _.filter(this.terms, function(item){ 
      return item.taxonomy == taxonomy; 
    });
  }


  getTaxonomyTree(taxonomy: string = "category", flattened = true) {
    var terms = this.getTermsByTaxonomy(taxonomy);
    var tree =  this.wphelper.list_to_tree(terms);
    if(!flattened) {
      return tree;
    }
    var flat_tree = this.treeSort(tree);
    return flat_tree;
  } 

  //Sort the tree array for select options
  treeSort(tree: any, depth: number = 0, delimeter = "-"){
    var options = [];
    if(depth == 0) {
      
    }
    for(let _i in tree) {
      var _prefix = delimeter.repeat(depth);
      if(depth) {
        _prefix = _prefix + " ";
      }
      var label = _prefix + tree[_i].name
      options.push({label:label, value: tree[_i].term_id});
      if(_.size(tree[_i].children)) {
        var children = this.treeSort(tree[_i].children, depth + 1, delimeter);
        if(children) {
          for(let _j in children) {
            options.push({label:children[_j].label, value: children[_j].value});
          }
        }
      }
    }
    if(_.size(options)) {
      return options;
    }
    return false;
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

  //Saves the current terms in table
  saveTable() {

  }


}
