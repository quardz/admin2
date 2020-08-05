
import { Component, OnInit,Input } from '@angular/core';
import { ngfModule, ngf, ngfSrc } from "angular-file"
import { DomSanitizer,SafeUrl } from "@angular/platform-browser";

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';

import { FormGroup, ReactiveFormsModule,FormControl, ValidationErrors,FormBuilder } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { MediaModule } from '../../modules/media.module';
import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';


export interface IWpFile {
  filename: string,
  uuid: string;
  blockchainUrl: string,
  serverurl: string,
  id: number,
  dataurl: string
}

@Component({
  selector: 'wpmedia-picker',
  templateUrl: './media-picker.component.html',
  styleUrls: ['./media-picker.component.scss']
})
export class MediaPickerComponent implements OnInit {

  @Input() items: number = 1;  

    ngOnInit(): void {}

}


@Component({
  selector: 'wpmedia',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  providers: [NgbModalConfig, NgbModal]

})
export class MediaComponent implements OnInit {

  myFormData:FormData;
  uploads: File[];
  files: any = {};
  uploadPercent: any;
  fileEdit: any;
  filekeys = [];
  test:any;

  editForm:any;
  editFields: any;
  editModal: any;

  constructor(private storage: StorageMap, 
    config: NgbModalConfig, 
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    public wpcore: WpcoreService,
    private media: MediaModule) { 

    this.renderFiles();
    this.getFiles();

    // customize default values of modals used by this component tree

  }

  renderFiles() {
    /*this.storage.keys().subscribe({
      next: (key) => {
        console.log("renderfiles", key, this.filekeys);
        this.filekeys.push(key);
        this.storage.get(key).subscribe((data) => {
          console.log("get data for ", key);
        })
      }
    });
    */
  }

  openFile(modal, file_hash){
    this.editForm = new FormGroup({});
    var editFields: FormlyFieldConfig[] =  [
      {
        key: 'alt',
        type: 'input',
        //wrappers: ['form-field-horizontal'],
        defaultValue: this.files[file_hash].meta.alt,
        templateOptions: {
          label: 'Alternative Text',
          type: 'text',
          placeholder: '',
          required: false,
          description: 'Describe the purpose of the image. Leave empty if the image is purely decorative.',
        },
      },
      {
        key: 'title',
        type: 'input',
        defaultValue: this.files[file_hash].meta.title,
        templateOptions: {
          label: 'Title',
          type: 'text',
          placeholder: '',
        },
      },
      {
        key: 'caption',
        type: 'textarea',
        defaultValue: this.files[file_hash].meta.caption,        
        templateOptions: {
          label: 'Caption',
        },
      },
      {
        key: 'description',
        type: 'textarea',
        defaultValue: this.files[file_hash].meta.description,
        templateOptions: {
          label: 'Description',
        },
      },            
    ]; 
    var _model = {
      alt: this.files[file_hash].meta.alt,
      title: this.files[file_hash].meta.title,
      caption: this.files[file_hash].meta.caption,
      description: this.files[file_hash].meta.description,
    };
    this.editFields = editFields;
    var modalSettings = {
      size: 'xl',
      centered: true, 
      scrollable: true,
    };

    
    this.fileEdit = cloneDeep(this.files[file_hash]);
    this.editModal = cloneDeep(_model);
    this.modalService.open(modal, modalSettings);

  }

  fileEditMove(dir) {
    console.log("file edit move", dir);
  }

  saveEditedImage(){
    console.log("content edited", this.editModal); 
  }

  getFiles() {

    //Get files from db. 

    console.log("all files ", this.files);
    /*
    console.log("into get files");
    var files:any = [];
    this.storage.keys().subscribe({
      next: (key) => {
        this.storage.get(key).subscribe({
          next: (_file_data) => { 
              if(_file_data) {
              var _blob_url = this.media.dataURItoBlobURI(_file_data);
              console.log("getting files", key, _blob_url);    
            }
          },

          error: (error) => { 
            console.log("loading error", key, error);
          },
        });
      
      }
    });
    */
  }

  getNextFileId() {
    return 4; //@todo full
  }

  saveFiles() {
    this.media._saveFiles_v2(this.uploads).subscribe((file:any)=>{
      var _hash = file.hash;
      if(_hash) {
        this.files[_hash] = file;
      }
      this.wpcore.setFiles(this.files);
      console.log("file obj created", file);
    });
    
    /*
    this._saveFiles().then((res)=>{
      
      
      console.log("saved files", res, this.files, this.wpcore.dbData.files);
    });
    */
  }
  /*
    this._saveFiles(cloneDeep(this.uploads)).then((_files:any)=>{
      console.log("files from promize", _files, _.size(_files));
      //this.files = cloneDeep(_files);
      if(_files) {
        var _somehing = cloneDeep(_files);
        //this.files 
        console.log("files from promize promize", _files, this.files, _somehing, _.size(_files));
        /*
        
        for(let _hash in _files) {
          console.log("files inside promize loop");
          this.files[_hash] = cloneDeep(_files[_hash]);
          console.log("uploaded files", _files, _hash, _files[_hash]);  
        }
       
      }
      else {
        console.log("error uploaded files", _files); 
      }
    });
  }
  */
  _saveFiles(){
    return new Promise((resolve, reject) => {
      var _error_counts = 0;
      var _this = this;
      var files = {};

      if(this.uploads) {
        for(let _i in this.uploads) {
          if(this.uploads[_i] && this.uploads[_i].size) {
            var result = this.media.saveFileBlobinDB(this.uploads[_i]).then(function(_res:any){
              if(_res && _this.uploads[_i]) {
                var _file = {
                  fid: _this.media.getNextFileID(),
                  guid: '', //@todo
                  user: 1,
                  date: _this.uploads[_i].lastModified,
                  mime: _this.uploads[_i].type,
                  filename: _this.uploads[_i].name,
                  status: '',//@todo
                  title: '',//@todo
                  storage_type: 'browser',
                  size: _this.uploads[_i].size,
                  file_obj: cloneDeep(_this.uploads[_i]),
                  src_url: _res.uri,
                  hash: _res.hash,
                  meta: {
                    alt:'',
                    title: '',
                    caption: '',
                    description: '',
                  }
                };
                if(!_.has(_this.files, _res.hash)) {
                  _this.files[_res.hash] = _file;
                  var __i = parseInt(_i);
                  _this.uploads.splice(__i, 1);
                }
              }
              else {
              }
            }).catch(function(error){
              console.log("file save error", error, _this.uploads[_i]);
            });
          }
        }// END OF FOR 
        resolve(true);
      }            
    });
  }



  ngOnInit(): void {
  }



}
