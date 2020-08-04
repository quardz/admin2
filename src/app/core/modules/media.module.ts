import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Md5 } from "md5-typescript";

import { IFile } from './../wpinterface';
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
    var _this = this;
    var fid = 45; //@todo

    return new Promise(function(resolve, reject){
      if(!file) {
        reject("Not a file!");
      }
      const reader = new FileReader();
      var blolurl = reader.readAsDataURL(file);
      reader.onload = function(event) {
        (<FileReader>event.target).result;
        var md5 = Md5.init(reader.result);
        console.log("file loaded", md5);
        _this.storage.has(md5).subscribe((result) => {
          if(result) {
            reject("File Already Exists!");
          }
          else {
            _this.storage.set(md5, reader.result).subscribe({
              next: () => { 
                var _res = {
                  hash: md5,
                  uri: _this.dataURItoBlobURI(reader.result),
                };
                resolve(_res);
              },
              error: (error) => { 
                var _msg = {
                  'text': "Error in saving file Already Exists!",
                  error: error,
                };
                reject(error);
              },
            });
          }
        });
      };
    });
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

  dataURItoBlobURI(dataURI) {
    var blob = this.dataURItoBlob(dataURI);
    if(blob) {
      return this.blobtoBlobURI(blob);
    }
    return false;
  }

  blobtoBlobURI(blob) {

    if(blob) {
      return URL.createObjectURL(blob);    
    }
    return false;
  }

  dataURItoBlob(dataURI) {
    if(!dataURI) {
      return false;
    }
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

    var _dataURI_split = dataURI.split(',');
    if(_dataURI_split.length < 2) {
      return false;
    }

    var byteString = atob(_dataURI_split[1]);  
    
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }

}
