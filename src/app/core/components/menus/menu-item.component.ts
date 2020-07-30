import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SortablejsOptions, SortablejsModule } from 'ngx-sortablejs';



@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
    @Input() listitem: any;
    @Input() isRoot: boolean = false;

  

    options: SortablejsOptions = {
      group: 'test',
      onUpdate: () => {
        console.log('updated');
      },
      onAdd: () => {
        console.log('added');
      },
      onRemove: () => {
        console.log('removed');
      },
    };
    

  constructor() { }

  ngOnInit() {
    
  }
}
