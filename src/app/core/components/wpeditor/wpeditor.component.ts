import { Component, OnInit, ViewChild,AfterContentInit } from '@angular/core';
import { BlockEditorProviderComponent, IBlock } from '../../../../../projects/ng-gutenberg/src/lib/block-editor-provider.component';
import * as _wpblocks from '@wordpress/blocks';
//import { EditorComponent, IBlock } from './editor.component';

@Component({
  selector: 'app-wpeditor',
  templateUrl: './wpeditor.component.html',
  styleUrls: ['./wpeditor.component.scss']
})
export class WpeditorComponent implements OnInit {
  
  title = 'gutenberg';
  blocks: IBlock[];
  @ViewChild('editor', { static: true }) public editor: BlockEditorProviderComponent;

  constructor() {
    this.realstuff();
  }
  logBlocks() {
    localStorage.setItem("blocks", JSON.stringify(this.blocks));
    var html = _wpblocks.serialize(this.blocks);
    localStorage.setItem("html", JSON.stringify(html));
    console.log("con", this.blocks, html);
  }

  realstuff() {
      var html = localStorage.getItem("html");
      if (html) {
        var json = JSON.parse(html)
        this.blocks = _wpblocks.parse(json);
      }
      else {

        this.blocks = [];
      }    
  }

  ngOnInit(): void {
  }
}