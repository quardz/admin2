import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Md5 } from "md5-typescript";
//import MD5 from 'md5.js';

  


@NgModule({ 
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MediaModule { 

  constructor(private storage: StorageMap) { 

  }


  //Conver URL or 
  generateThmubnail(file:any, size: any) {

  }

  //Save the datasource to file in blob
  dataSrcToBlob(dataSrc:any){

  }

  //Delete file in file table and remove file 
  deleteFile(fid) {

  }

  //Reset all local storage
  cacheReset() {

  }

  //Get total size of local storage and used size
  getLocalStorageSize() {

  }

  //Get file obj, store in local storage, create file item in DB, return file ID
  saveFile(file) {
    if(!file) {
      return false;
    }
    var fid = 45;
    var _this = this;

    const reader = new FileReader();
    var blolurl = reader.readAsDataURL(file);
    reader.onload = function(event) {
      var data_src = (<FileReader>event.target).result;
    };

    reader.onloadend = function(event) {
      if(reader.result) {
        var _data_src = (<FileReader>event.target).result;
        var md5 = Md5.init(reader.result);
        var blolurlw = reader.readAsDataURL(file);
        _this.storage.has(md5).subscribe((result) => {
          if(!result) {
            _this.storage.set(md5, reader.result).subscribe((_data) => {
              _this.storage.size.subscribe((size_)=>{
                console.log("total size", size_, blolurlw, md5); 
              }); 
            });
          }
          else {
            console.log("file already exists");
          }
        });
      }
    }



  }

  md5hash(d) {
    //@todo use proper lib for this. 
    
  }

  getAllFiles() {

  }

  getOrapanLocalFiles() {

  }

  //Check both db and local storage and increment from it, better to keep the semaphore in main db 
  getLatestFileID() {

  }
  getNextFileID() {
    return 4;//@todo fully
  }


}
