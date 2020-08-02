
import { Component, OnInit,Input } from '@angular/core';
import { ngfModule, ngf, ngfSrc } from "angular-file"
import { DomSanitizer,SafeUrl } from "@angular/platform-browser";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as _ from 'underscore';

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
  files: File[];
  uploadPercent: any;

  filekeys = [];

  constructor(private storage: StorageMap, private media: MediaModule) { 
    this.renderFiles();
    this.getFiles();
  }

  renderFiles() {
    this.storage.keys().subscribe({
      next: (key) => {
        console.log("renderfiles", key, this.filekeys);
        this.filekeys.push(key);
        this.storage.get(key).subscribe((data) => {
          console.log("get data for ", key);
        })
      }
    });
  }

  getFiles() {
    console.log("into get files");
    var files = this.storage.keys().subscribe({
      next: (key) => {
        console.log("getting files", key);
      }
    });
  }

  getNextFileId() {
    return 4; //@todo full
  }

  saveFiles(text) {
    console.log("save files", text, this.files);

    for(let _i in this.files) {
      this.media.saveFile(this.files[_i]);
      //this.saveFile(this.files[_i], _i);
    }
  }

  saveFile(file, index) {
    var storage = this.storage;
    if(!_.has(file, 'file_content')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = this.readerOnload;
      reader.onloadend = function(event) {
        if(reader.result) {
          var file_id = index;//this.getNextFileId();
          var file_content = {
            id: file_id,
            blob: reader.result,
          };
          
          file.file_content = file_content;
          storage.set('file_' + index, reader.result).subscribe((_data) => {
            console.log("_data", _data);
            storage.size.subscribe((size_)=>{
              console.log("total size", size_); 
            });

            storage.get('file_'+index).subscribe((__data) => {
              //console.log("file_ ", __data); 
            });
          });

        }
      }
    }
  }


  readerOnload(event) {
    var data_src = (<FileReader>event.target).result;
  }
  ngOnInit(): void {
  }



}
