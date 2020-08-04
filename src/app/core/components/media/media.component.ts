
import { Component, OnInit,Input } from '@angular/core';
import { ngfModule, ngf, ngfSrc } from "angular-file"
import { DomSanitizer,SafeUrl } from "@angular/platform-browser";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';

import { MediaModule } from '../../modules/media.module';


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
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  myFormData:FormData;
  uploads: File[];
  files: any = {};
  uploadPercent: any;

  filekeys = [];

  constructor(private storage: StorageMap, 
    public sanitizer: DomSanitizer,
    private media: MediaModule) { 

    this.renderFiles();
    this.getFiles();
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
    var _this = this;
    for(let _i in this.uploads) {
      var result = this.media.saveFile(this.uploads[_i])
        .then(function(_res:any){

          if(_res) {
            var _file = {
              fid: _this.getNextFileId(),
              guid: '', //@todo
              user: 1,
              date: _this.uploads[_i].lastModified,
              mime:_this.uploads[_i].type,
              filename:_this.uploads[_i].name,
              status: '',//@todo
              title: '',//@todo
              storage_type: 'browser',
              size:_this.uploads[_i].size,
              file_obj: cloneDeep(_this.uploads[_i]),
              src_url: _res.uri,
              hash: _res.hash,
            };
            if(!_.has(_this.files, _res.hash)) {
              _this.files[_res.hash] = _file;
              console.log("came here inside has", _this.files);
              var __i = parseInt(_i);
              _this.uploads.splice(__i, 1);
            }
          }
          else {
          }
          //create file object to bloburl 
          return result;
        }) 
        .catch(function(error){
          console.log("file save error", error, _this.uploads);
          return false;
        });

      
    } // for ends
    console.log("result in save files function:: ", this.files);
  }


  readerOnload(event) {
    var data_src = (<FileReader>event.target).result;
  }
  ngOnInit(): void {
  }



}
