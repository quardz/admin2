import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';



@NgModule({ 
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class WphelperModule { 


  public stripTags(html:string) {
    return html.replace(/(<([^>]+)>)/ig,"");
  }


  //Set given object empty
  public setObjEmpty(input){
    if(typeof input === 'object' && input !== null) {
      let keys = Object.keys(input);
      for(let key of keys) {
        if(typeof input[key] != "object" ){
          input[key] = null;
        }else{
          this.setObjEmpty(input[key]);
        }
      }
      return input; 
    }
    return false;
  }

  //Get the empty entity object
  public getEmptyEntityObj(obj:any, entity_type:string = null) {
    if(obj && _.has(obj, entity_type) && obj[entity_type]) {
      var first = _.first(obj[entity_type]);
      if(first && typeof first === 'object' && first !== null) {
        return cloneDeep(first);
      }
    }
    return false;
  }


  //Convert a list of array into tree
  public list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].term_id] = i; // initialize the map
      if(list[i]) {
        list[i].children = []; // initialize the children  
      }
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i]; 
      if (node.parent !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parent]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    if(roots) {
      var _return = [];
      for(let _i in roots) {
        roots[_i].depth = roots[_i].parents.length;
        if(roots[_i].parent == 0) {
          _return.push(roots[_i]);
        }
      }
      return _return;
    }
    return _return;
  }

  //Sort the tree array for select options
  treeSort(tree: any, depth: number = 0){
    var options = [];
    if(depth == 0) {
      options.push({label:'None', value:0});
    }
    for(let _i in tree) {
      var label = "-".repeat(depth) + " " + tree[_i].name

      options.push({label:label, value: tree[_i].term_id});
      if(_.size(tree[_i].children)) {
        var children = this.treeSort(tree[_i].children, depth + 1);
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
  public isDuplicateTerm(term: any, terms: any){
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

  //Create slug from string
  public slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
         str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  //@todo everything
  public checkDuplicateTerm(terms:any, name:string, slug: number, tazonomy: string, parent) {
    //check for 

  }

}
