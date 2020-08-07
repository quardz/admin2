import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Md5 } from "md5-typescript";
import { Observable } from 'rxjs';


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

  getNextFileID() {
    //@todo auto generate this 
    return 4;
  }

  _saveFiles(uploads){

    var _this = this;

    const fileObservable = new Observable(observer => {
      for(let _i in uploads) {
        if(uploads[_i] && uploads[_i].size) {
          var result = this.saveFileBlobinDB(uploads[_i]).then(function(_res:any){
            if(_res && uploads[_i]) {
              var _file = {
                fid: _this.getNextFileID(),
                guid: '', //@todo
                user: 1,
                date: uploads[_i].lastModified,
                mime: uploads[_i].type,
                filename: uploads[_i].name,
                status: '',//@todo
                title: '',//@todo
                storage_type: 'browser',
                size: uploads[_i].size,
                file_obj: cloneDeep(uploads[_i]),
                src_url: _res.uri,
                hash: _res.hash,
                temp:{},
                meta: {
                  alt:'',
                  title:'',
                  caption:'',
                  declaration:'',
                },
              };
              
              observer.next(_file);
            }
          }).catch(function(error){
            console.log("file save error", error, uploads);
          });
        }
      }
    });
    return fileObservable;
  }  



  public reloadLocalDBFileBlobURL(hashes, bloburl = true, prefix = "thumb_") {
    const fileObservable = new Observable(observer => {
      if(hashes) {
        for(let _h in hashes) {
          var _storage_key = prefix + hashes[_h];
          this.storage.get(_storage_key).subscribe((dataURI)=>{
            var _ret:any;
            if(!bloburl) {
              _ret = {
                hash: hashes[_h],
                blob_url: dataURI,
              };              
              observer.next(_ret);
            }
            else {
              var _blob_uri = this.dataURItoBlobURI(dataURI);
              _ret = {
                hash: hashes[_h],
                blob_url: _blob_uri,
              };
            
              observer.next(_ret);
            }
          })    
        }
      }
    });
    return fileObservable;
  }

  public generateThumbsLocal(hashes, prefix = 'thumb_'){
    const fileObservable = new Observable(observer => {
      if(hashes) {
        for(let _h in hashes) {
          this.storage.get(hashes[_h]).subscribe((dataURI)=>{   
            this.thumbnailify(dataURI, 140, function(thumbdataURI){
              var _thumb_hash = prefix + hashes[_h];
              this.storage.set(_thumb_hash, thumbdataURI).subscribe({
                next: () => {
                  var _ret = {
                    hash: hashes[_h],
                    blob_url: thumbdataURI,
                  };
                  observer.next(_ret);    
                },
                error: (error) => {},
              });                
            });
          });
        }
      }
    });
    return fileObservable;           
  }


  //Get file obj, store in local storage, create file item in DB, return file ID
  saveFileBlobinDB(file, thumb = "thumb_") {
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

          //store main image          
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

          //create Thumb image
          if(thumb) {
            _this.thumbnailify(reader.result, 140,  function(thumbdatasrc) {
              var _thumb_hash = thumb + md5;
              _this.storage.set(_thumb_hash, thumbdatasrc).subscribe(() => {});
            });
          }
         
        
      };
    });
  }

  

  getAllFiles() {

  }

  getOrapanLocalFiles() {

  }

  //Check both db and local storage and increment from it, better to keep the semaphore in main db 
  getLatestFileID() {

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

  //Credits  :https://jsfiddle.net/wunderbart/hnj5vrf0/
  public thumbnailify(base64Image, targetSize, callback) {
    if(!targetSize) {
      targetSize = 140;
    }

    var img = new Image();
    img.onload = function() {
      var width = img.width;
      var height = img.height;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");

      canvas.width = canvas.height = targetSize;

      ctx.drawImage(
        img,
        width > height ? (width - height) / 2 : 0,
        height > width ? (height - width) / 2 : 0,
        width > height ? height : width,
        width > height ? height : width,
        0, 0,
        targetSize, targetSize
      );

      callback(canvas.toDataURL());
    };
    img.src = base64Image;
  };




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
