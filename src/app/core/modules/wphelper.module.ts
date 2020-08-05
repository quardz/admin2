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

  public getPostsByType(posts, post_type, post_status = "publish") {
    var _filter = {
      post_type: post_type,
      post_status: post_status,
    }
    return this.getEntitiesByFilter(posts, _filter);
  }

  public getEntitiesByFilter(entities, filter) {
    if(entities && filter) {
      return _.where(entities, filter);
    }
    return false;
  }

  public isValidUrl(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;  
    }
    return true;
	}

  public TinyMceInit() {

    return {
      plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
      imagetools_cors_hosts: ['picsum.photos'],
      menubar: 'file edit view insert format tools table help',
      toolbar: 'formatselect bold italic numlist bullist blockquote underline strikethrough quickimage image imagetools| alignleft aligncenter alignright alignjustify | fontselect fontsizeselect  | outdent indent | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample undo redo| ltr rtl',
      toolbar_sticky: true,
      autosave_ask_before_unload: true,
      autosave_interval: "30s",
      autosave_prefix: "{path}{query}-{id}-",
      autosave_restore_when_empty: false,
      autosave_retention: "2m", 
      image_advtab: true,
      content_css: '//www.tiny.cloud/css/codepen.min.css',
      link_list: [
        { title: 'My page 1', value: 'http://www.tinymce.com' },
        { title: 'My page 2', value: 'http://www.moxiecode.com' }
      ],
      /*image_list: [
        { title: 'My page 1', value: 'http://www.tinymce.com' },
        { title: 'My page 2', value: 'http://www.moxiecode.com' }
      ],*/
      image_class_list: [
        { title: 'None', value: '' },
        { title: 'Some class', value: 'class-name' }
      ],
      importcss_append: true,

      //file_picker_types: 'image',

      templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
      ],
      template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
      template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
      height: 600,
      image_caption: true,
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      noneditable_noneditable_class: "mceNonEditable",
      toolbar_mode: 'sliding',
      contextmenu: "link table image imagetools ",
   };



  }

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

  // list to tree
  public list2tree(list, field_id = 'term_id', field_children = 'children', field_parent = 'parent') {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i][field_id]] = i; // initialize the map
      if(list[i]) {
        list[i][field_children] = []; // initialize the children  
      }
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i]; 
      if (node[field_parent] !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node[field_parent]]][field_children].push(node);
      } else {
        roots.push(node);
      }
    }    

    if(roots) {
      var _return = [];
      for(let _i in roots) {
        if(roots[_i][field_parent] == 0) {
          _return.push(roots[_i]);
        }
      }
      return _return;
    }
    return _return;    

  }

  //Convert a list of array into tree, use this only for term
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
  treeSort(tree: any, depth: number = 0, delimeter = "-"){
    var options = [];
    if(depth == 0) {
      options.push({label:'None', value:0});
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

  public getUniqueSlug(text:string, list:any) {
    var slug = this.slugify(text);
    var _init_slug = slug; 
    var count = 1;
    while(1) {
      if(_.contains(list, slug)) {
        slug = _init_slug + "_" + count;
        count++;
      }
      else {
        return slug;
      }
    }
  }

  //Merge the first obj into second object
  public saveUnionObjects(src, dst) {
    console.log("saveUnionObjects", src, dst);
    if(src) {
      for(let _skey in src) {
        dst[_skey] = src[_skey];
      }
    }
    return dst;
  }

  //Create slug from string
  public slugify(str, replacer = "-") {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
         str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, replacer) // collapse whitespace and replace by -
    .replace(/-+/g, replacer); // collapse dashes

    return str;
  }

  //Convert single file to blob
  public fileToBlob(file) {

  }

  //@todo everything
  public checkDuplicateTerm(terms:any, name:string, slug: number, tazonomy: string, parent) {
    //check for 

  }

}
