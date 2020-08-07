
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
  
  filekeys = [];
  test:any;

  fileEdit: any;
  fileEditHash: string = '';
  editForm:any;
  editFields: any;
  editModal: any;

  thumbs:any = {};
  imageOrig: any = {};
  hashes: any = [];

  constructor(private storage: StorageMap, 
    config: NgbModalConfig, 
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    public wpcore: WpcoreService,
    private media: MediaModule) { 

    
    this.getFiles();

    // customize default values of modals used by this component tree

  }

  //Open a file in modal for editing
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

    if(this.files[file_hash].storage_type == 'browser' && !_.has(this.imageOrig, file_hash)) {
      this.media.reloadLocalDBFileBlobURL([file_hash], true, '').subscribe((dataurl:any)=>{    
        this.imageOrig[file_hash] = dataurl.blob_url;
      });
    }
    
    this.fileEdit = cloneDeep(this.files[file_hash]);
    if(file_hash) {
      this.fileEditHash = file_hash;
    }
    this.editModal = cloneDeep(_model);
    this.modalService.open(modal, modalSettings);

  }

  //In edit screen, the left/right buttons will be handled by this
  fileEditMove(dir) {
    var _cur_pos = _.indexOf(this.hashes, this.fileEditHash);
    var new_pos = _cur_pos;

    switch(dir){
      case 'next':
        new_pos++;
      break;
      case 'prev':
        new_pos--;
      break;
    }
    
    

    console.log("file edit move", dir);
  }

  //Save the edited images
  saveEditedImage(){
    this.files[this.fileEditHash].meta = cloneDeep(this.editModal);
    this.setFiles();
  }

  //Get files from only DB
  //@todo, load the local cache
  getFiles() {
    var _files = this.wpcore.getFiles();
    var _hashes = [];
    for(let _f in _files) {
      if(_files[_f].storage_type == 'browser') {

        _hashes.push(_f);  
      }
    }
    if(_hashes) {
      this.media.reloadLocalDBFileBlobURL(_hashes, false, 'thumb_').subscribe((thumb:any)=>{
        this.thumbs[thumb.hash] = thumb.blob_url;
      });
      this.files = cloneDeep(_files);
    }

    this.hashes = _.keys(this.files);
    
  }



  getNextFileId() {
    return 4; //@todo full
  }

  saveFiles() {
    this.media._saveFiles(this.uploads).subscribe((file:any)=>{
      var _hash = file.hash;
      if(_hash) {
        this.files[_hash] = file;
      }
      this.wpcore.setFiles(this.files);

    });  
  }

  setFiles() {
    this.wpcore.setFiles(this.files);
    this.hashes = _.keys(this.files);

  }

  ngOnInit(): void {
  }



}
