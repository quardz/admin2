import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//import {}
import * as _ from 'underscore'; 
import * as cloneDeep from 'lodash/cloneDeep';
import { StorageMap } from '@ngx-pwa/local-storage';


import { WphelperModule } from './modules/wphelper.module';
import { WpdataService } from './wpdata.service';

interface ISites {
  name?: string,
  url?: string,
  status?: number,
  id?: string, //usually hash
  platform?: string, //like arweave or s3 or inmemory etc
}


 
@Injectable({
  providedIn: 'root'
})
export class WpcoreService {

  public dbData: any;
  dbStatus: number; 
  dbDataSrc: string = 'server';
  loaded: boolean = false;
  URLs: Array<any> = []; //link, component, entity = posts/users, type = post/page, parameters as obj
  mapIndex_Pk: Array<any> = []; // It contains the map between primary key and index
  archives: Array<any> = [];
  apiURL: string = '/db.json';
  sitePublished: boolean = false;
  sitePublishedTime: number = 0;
  public sites: ISites[];
  
  coreEntityTables = ['users', 'posts', 'terms', 'files'];
  tablePKs = {
    'users': 'ID',
    'posts': 'ID',
    'terms': 'term_id',
    'files': 'fid',

  };

  

  public currentTheme = 'author';

  public entityDefines = {};


  constructor(private http: HttpClient, 
      private wphelper: WphelperModule,
      private wpdata: WpdataService,
      private storage: StorageMap, 
      ) {
    this.prepareWP();

  }

  //@todo this will bootstrap the site in order
  public prepareWP() {
    this.loadSites();

  }

  public postDataLoad() {
    this.resolveDataURL();    
    this.loadSemaphore();    
  }

  //---------------------------------------------------------------------
  //-----------------------------semaphore-------------------------------
  //---------------------------------------------------------------------

  //It should return next id always, not the current one. 

  semaphore: any = {};

  public loadSemaphore() {
    this.semaphore = this.getOption('semaphore');
    if(_.isNull(this.semaphore) || _.isUndefined(this.semaphore) || _.isEmpty(this.semaphore))  {
       this.generateSemaphore();
    }
  }

  public getSemaphore(entity_type:string = ''){
    if(entity_type && this.semaphore[entity_type]) {
      var _sema = parseInt(this.semaphore[entity_type]) + 1;
      return _sema;
    }
    return false;
  }
  
  //@todo, finetue this
  private generateSemaphore(){
    this.semaphore = {};
    for(let _index in this.coreEntityTables) {
      let _entity_type = this.coreEntityTables[_index];
      if(_.has(this.mapIndex_Pk, _entity_type)) {
        var all_keys = _.map(_.allKeys(this.mapIndex_Pk[_entity_type]), Number);
        if(all_keys) {
          this.semaphore[_entity_type] = (_.max(all_keys) + 1);
        }
      }
    }
  }

  private setSemaphore(entity_type: string, entity_id?: number) {
    if(entity_id){
      this.semaphore[entity_type] = entity_id;
    }
    else {
      this.semaphore[entity_type]++;  
    }
    this.setOption('semaphore', this.semaphore);  
  }


  //@todo dynamic
  public loadSites(){
    this.sites = [
      {
        name: "Default Site", 
        url: "localhost",
        status: 1,
        id: "ddffdd",
        platform: "custom"
      },
    
    
      {
        name: "New Site",
        url: "localhost",
        status: 0,
        id: "frtghy",
        platform: "new"
      },
    ];
  }

  addSite(site: ISites) {
    this.sites.push(site);
  }

  //@todo whole stuff
  public resolveDataURL(){
    this.apiURL = '/db.json';
  }

  public dataSrc(){
    //@todo everything
    //'business' : our centralised server
    //'from blockchain' : may be many variations
    //'broswer': //check the broser first
    return 'browser';
    return 'server';
    

    
  }

  public getLocalDB(tryRemoteAPI = true) {
    return new Promise((resolve, reject) => {

      this.storage.get('sitedb').subscribe((db) => {
        if(db) {
          //this.dbData = this.fixData(db);
          console.log("loaded from local", db);
          this.dbData = db;
          console.log("after loading and fixing", this.dbData);
          //this.getTaxonomyTree('category');//this is for test @todo remove
          this.dbStatus = 1;
          this.loaded = true;
          this.postDataLoad();
          resolve(true);
        }
        else {
          console.log("trying remote db");
          return this.loadRemoteDB(this.apiURL).then((status)=>{
            if(status) {
              console.log("loaded remote dat", status);
              
              resolve(true);
            }
            else {
              reject("error loading remote data");
            }


          });

        }
      });
    });
  }

  public saveDBLocally(showNotif = true){
    var _data = cloneDeep(this.dbData);
    this.storage.set('sitedb', _data).subscribe({
      next: () => {
        console.log("saved the site");
      },
      error: (error) => {
        console.log("error loading the site");
      },
    });
  }

  public getSitePublishedStatus() {
    return this.sitePublished;
  }

  public setSitePublishedStatus(status:boolean) {
    this.sitePublished = status;
    this.setSitePublishedTime(Math.round(+new Date()/1000));
  }

  public setSitePublishedTime(time:number) {
    this.sitePublishedTime = time;
  }

  public getSitePublishedTime() {
    return this.sitePublishedTime;
  }  

  public getData() {  
    return this.dbData; 
  }

  public getTable(table){
    if(_.has(this.dbData, table)) {
      return this.dbData[table];
    }
    return true;
  }


  load() { 
    var _datasrc = this.dataSrc();
    switch(_datasrc){
      case 'browser': 
        console.log("data source is ", _datasrc);
        return this.getLocalDB();
      break;

      case 'server':
        return this.loadRemoteDB(this.apiURL);
      break;
    }
  } 

  loadRemoteDB(apiURL){
    return new Promise((resolve, reject) => {
      this.http.get(apiURL).subscribe(response => {
        this.dbData = this.fixData(response);
        console.log("after loading and fixing", this.dbData);
        //this.getTaxonomyTree('category');//this is for test @todo remove
        this.dbStatus = 1;
        this.loaded = true;
        this.postDataLoad();
        resolve(true);
      },
      error => {
        this.dbStatus = 0;
        this.loaded = false;   
        this.dbData = null;     
        reject(false);
      });
    });    
  }

  // Add default tables to json data, Add keys to all the data
  fixData(data){
    if(!data) {
      return false;
    }

    var _data_copy = data;
    var _metatables = this.coreEntityTables;
    var _term_urls = {};

    var tablePKs = this.tablePKs;

    var _post_types_to_display = ['page', 'post'];
    var  _archives = [];

    var _url_category_base = this.getOption('category_base', 'category');
    var _url_tag_base = this.getOption('tag_base', 'tag');    

    //Generate URL for terms
    if(data.terms) {
      for(let _t in data.terms) {
        var _path = '';
        if(data.terms[_t][6] == 'category' || data.terms[_t][6] == 'post_tag') {
          if(data.terms[_t][8]) {
            for(let _pid in data.terms[_t][10]) {
              _path =  data.terms[data.terms[_t][10][_pid]][2] + "/" + _path;
            }
          }
          if(data.terms[_t][6] == 'category') {
            _path = _url_category_base + "/" + _path  + data.terms[_t][2];            
          }
          if(data.terms[_t][6] == 'post_tag') {
            _path = _url_tag_base + "/" + _path  + data.terms[_t][2];            
          }
          
        }
        data.terms[_t][12] = _path.replace(/\/$/, "").replace(/^\/+/, '');
        data.terms[_t][13] = [];
        data.terms[_t][14] = 0;//weight
        //data.terms[_t][12] = "/" +  _path
        var _route = {
          url: data.terms[_t][12], 
          component: "TermComponent",
          id: data.terms[_t][0],
          entity: 'terms',
        };
        this.URLs.push(_route);   
        _term_urls[_route.id] = _route.url;
      }
      data.terms._describe[12] = "url";
      data.terms._describe[13] = "children";
      data.terms._describe[14] = "weight";
    }
    //END : URL for terms

    //Contents belongs to terms
    
    for(let table in data) {
      //skip options table
      if(table == "options") {
        continue;
      }
      
      var mapIndex_Pk_key = tablePKs[table] ? tablePKs[table] : 0;
      if(mapIndex_Pk_key) {
        this.mapIndex_Pk[table] = {};  
      }
      

      //Make the array with proper key value
      var keys = data[table]['_describe'];
      var table_data_new = [];      
      var _row_counter = 0;
      for(let row_id in data[table]) {
        if(row_id != '_describe') {
          var _tmp_row = {};  
          for(let key_id in keys) {
            _tmp_row[keys[key_id]] = data[table][row_id][key_id];
          }
          if(_metatables.includes(table)) {
            _tmp_row['metatbl'] = data[table][row_id]['metatbl'];  
          }
          //Map Key to index
          if(mapIndex_Pk_key) {
            this.mapIndex_Pk[table][_tmp_row[mapIndex_Pk_key]] = _row_counter; 
          }

          //data[table][row_id] = _tmp_row; //uncomment this to make rows group with ID
          table_data_new.push(_tmp_row);
          _row_counter++;


        }
      }
      data[table] = table_data_new;
      //END : Make the array with proper key value
      

      //Generate URL for posts
      if(table == 'posts') {
        var urlformat = '?p=/%post_id%';
        var default_category = 1;
        if(data.options){
          if(data.options.permalink_structure){
            urlformat = data.options.permalink_structure;
          }      
          if(data.options.default_category) {
            default_category = data.options.default_category;
          }
        }

        for(let _p in data.posts) { 

          // Attach terms to posts
          data.posts[_p]._tags = [];
          if(data.term_relationships) {
            for(let _r in data.term_relationships) {
              if(data.term_relationships[_r][0] == data.posts[_p].ID) {
                data.posts[_p]._tags.push(data.term_relationships[_r][1]);
              }
            }
          }

          //Generating URL
          var tmp_date = new Date(data.posts[_p].post_date);
          var author = "admin";
          if(_data_copy.users && _data_copy.users[data.posts[_p].post_author] && _data_copy.users[data.posts[_p].post_author].display_name) {
            author = _data_copy.users[data.posts[_p].post_author].display_name;
          }
          var _main_category = default_category;
          if(data.posts[_p]._tags) {
            for(let _tid in data.posts[_p]._tags) {
              if(data.terms[data.posts[_p]._tags[_tid]].taxonomy == 'category' || data.terms[data.posts[_p]._tags[_tid]][6] == 'category') {
                _main_category = data.posts[_p]._tags[_tid];

              }
            }
          }

          var _post_month = tmp_date.getMonth();
          var _post_year = tmp_date.getFullYear();

          var _tokens = {
            '%year%': _post_year,
            '%monthnum%': ("0" + (_post_month + 1)).slice(-2),
            '%day%': ("0" + tmp_date.getDate()).slice(-2),
            '%postname%': data.posts[_p].post_name,
            '%post_id%': data.posts[_p].ID,
            '%hour%': ("0" + tmp_date.getHours()).slice(-2),
            '%minute%': ("0" + tmp_date.getMinutes()).slice(-2),
            '%second%': ("0" + tmp_date.getSeconds()).slice(-2), 
            '%category%': _term_urls[_main_category].replace("category", ""), 
            '%author%': author, 
          };  
      
          var tmp_url = urlformat;
          for(let _find in _tokens) {
            tmp_url = tmp_url.split(_find).join(_tokens[_find]);
          }      
          data.posts[_p].post_url = tmp_url.replace(/\/$/, "").replace(/^\/+/, "").replace("//", "/");
          //data.posts[_p].post_url = "/" + tmp_url.replace("//", "/");

          // for pages, just use slug
          if(data.posts[_p].post_type == 'page') {
            data.posts[_p].post_url = data.posts[_p].post_name; 
          }
          var _route = {
            url: data.posts[_p].post_url,
            component: "PostComponent",
            id: data.posts[_p].ID,
            entity: 'posts',
          };
          this.URLs.push(_route);

          //Create Archive list
          
          if(data.posts[_p].post_status == "publish" && data.posts[_p].post_type == 'post') {
            var _date_key = _post_year + '/' + ("0" + (_post_month + 1)).slice(-2);
            
            if(_archives[_date_key]) {
              _archives[_date_key].push(data.posts[_p].ID);
            }
            else {
              _archives[_date_key] = [data.posts[_p].ID]; 
            }
          } 
        }//END for posts   
      }


      
    } // END of for loop on each tables 


    if(!_.has(data,'files')) {
      data.files = {};
    }


    //End : content per terms
    
    var _defaultTables: string[] = ['options', 'posts', 'terms', 'term_relationships', 'users'];
    for(let table in _defaultTables) {
      if(!data.hasOwnProperty(_defaultTables[table])){
        data[_defaultTables[table]] = [];
      }
    }


    //Push other URLs 
    var _search_url = {
      url: 'search/:key', 
      component: "WppageComponent",
      id: 0,
      entity: 'search',
    };
    this.URLs.push(_search_url); 


    this.archives = _archives;
    if(_archives) {
      for(let _date in _archives) {
        this.URLs.push({
          url: 'date/' + _date, 
          component: "WppageComponent",
          id: _date,
          entity: 'archive',
        });
      }
    }

    //Generate Semaphores for future use
    

    
    return data;
  }

  getOption(option_id: number|string, _default?:any) { 
    if(this.dbData && this.dbData.options && this.dbData.options[option_id]) {
      return this.dbData.options[option_id];
    }
    return _default;
  }

  setOption(option_id: number|string, value?:any) {
    this.dbData.options[option_id] = value;
  }

  getMetadata(meta_key:string, entity: any){
    if(entity && entity.metatbl && entity.metatbl[meta_key] ) {
      if(Array.isArray(entity.metatbl[meta_key]) && entity.metatbl[meta_key][1]) {
        return entity.metatbl[meta_key][1];  
      }
      else {
        entity.metatbl[meta_key];
      }
    } 
    return false;
  }

  getEntityByID(entity_type: string, entity_id: number) {
    if(this.mapIndex_Pk[entity_type][entity_id] !== undefined) { 
      let _index = this.mapIndex_Pk[entity_type][entity_id]
      return this.dbData[entity_type][_index];
    }
    return false;
  }

  //Get complete User data
  getUser(user_id: number) {
    return this.getEntityByID('users', user_id);
  }



  //Get post data
  getPost(post_id: number){
    return this.getEntityByID('posts', post_id);
  }

  //Get term data
  getTerm(term_id: number) {
    return this.getEntityByID('terms', term_id);
  }  


  //@todo review
  saveEntity(data:any, entity_type: string) {

    if(_.contains(this.coreEntityTables, entity_type) && data) {
      
      var new_entity = this.wphelper.getEmptyEntityObj(this.dbData, entity_type);
      var next_entity_id:any = this.getSemaphore('terms');
      for(let _key in data) {
        if(_.has(new_entity, _key)) {
          new_entity[_key] = data[_key];
        }
      } 
      var _primary_key = this.tablePKs[entity_type]; 
      
      new_entity[_primary_key] = next_entity_id; 

      var old_size = _.size(this.dbData[entity_type]);
      this.dbData[entity_type].push(new_entity);
      var new_size = _.size(this.dbData[entity_type]);
      if(new_size == (old_size+1)) { 
        this.setSemaphore(entity_type, parseInt(next_entity_id));
        this.mapIndex_Pk[entity_type][next_entity_id] = new_size;
        return this.dbData[entity_type][old_size];
      }
    }
    return false;
    //@todo
  }


  //Delete entities
  //@todo check deendencies, integrities etc
  deleteEntity(entity_id: any, entity_type: string, permenent = false) {
    if(_.has(this.mapIndex_Pk, entity_type) 
      && _.has(this.mapIndex_Pk[entity_type], entity_id) 
      && _.has(this.dbData, entity_type)) {
        var _entity_index = this.mapIndex_Pk[entity_type][entity_id];
        //@todo, check entity id and entity are same 
        delete this.mapIndex_Pk[entity_type][entity_id];
        delete this.dbData[entity_type][_entity_index];
        return true;
    }
    return false;
  }

  //Files 
  getFiles(){
    if(_.has(this.dbData, 'files')) {
      return cloneDeep(this.dbData.files);  
    }
    this.dbData.files = {};
    return {};
  }
 
  setFile(){

  }

  public setFiles(files) {
    this.wphelper.saveUnionObjects(files, this.dbData.files);
    return this.dbData.files;
  }



  // Themes / regions / widgets
  setTheme(theme) {
    if(theme) {
      this.currentTheme = theme;
      this.setOption('currentTheme', theme);
    }
  }

  getTheme() { 
    return this.getOption("currentTheme", this.currentTheme); 
  }

  getThemes() { 
    return this.wpdata.getThemes();
  }

  getRegions(theme?:string) {
    if(!theme) {
      theme = this.currentTheme;
    }
    return this.wpdata.getRegions(theme);
  }

  getWidgets() {
    return this.wpdata.getWidgets();
  }
  //Save region widgets

  setThemeSettings(key:string, data:any, theme?:string) {
    if(!theme) {
      theme = this.getTheme();  
    }
    var _data = {};
    _data[theme] = data;
    var current_data = this.getOption(key, _data);
    current_data[theme] = data;
    this.setOption(key, current_data);
  }  

  

  getThemeSettings(key:string, theme?:string){
    if(!theme) {
      theme = this.getTheme();  
    }    
    var current_data = this.getOption(key);
    if(!current_data) {
      return false;
    }
    if(_.has(current_data, theme)) {
      return current_data[theme];
    }
    return false;
  }

  //---------------------------------------------------------------------
  //-------------------------activities----------------------------------
  //---------------------------------------------------------------------

  activities:any = [];

  //Add each activity
  public addActivity(_type:string, title?:string, msg?:string, data?:any){
    if(_type || title || msg || data) {
      var _event = {
        type: _type,
        title: title,
        msg: msg,
        data: data,
      };      
      this.activities.push(_event);
    }
  }
  //Get the activity
  public getActivities() {
    return this.activities;
  }

}
 
