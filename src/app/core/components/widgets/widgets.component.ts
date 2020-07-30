import { Component, OnInit } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { ToastrService } from 'ngx-toastr';
import { TreeModule } from '@circlon/angular-tree-component';
import { SortablejsOptions, SortablejsModule } from 'ngx-sortablejs';


import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';


@Component({
  selector: 'widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
