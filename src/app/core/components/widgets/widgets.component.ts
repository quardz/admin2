import { Component, OnInit } from '@angular/core';
import { FormGroup,FormsModule } from '@angular/forms';

import * as _ from 'underscore';
import * as cloneDeep from 'lodash/cloneDeep';
import { ToastrService } from 'ngx-toastr';
import { TreeModule } from '@circlon/angular-tree-component';
import { SortablejsOptions, SortablejsModule } from 'ngx-sortablejs';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ITheme, IWidget, IRegion, IMenuItem, IMenu, IWidRegMap } from '../../wpinterface';
import { WpcoreService } from '../../wpcore.service';
import { WphelperModule } from '../../modules/wphelper.module';


@Component({
  selector: 'widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
}) 
export class WidgetsComponent implements OnInit {

  regions: any;//[];
  theme: ITheme[];
  widgets: any;//[];
  widreg_map: IWidRegMap[];
  isWidCollapsed:any = {};
  isRegCollapsed:any = {};
  curWidget: string = '';
  regwids: any = {};

  widRegSelected: any = {};


  constructor(private wpcore: WpcoreService) { 
    this.getWidgets();
    this.getRegions();
    this.getPositions();
    console.log("widgets", this.widgets, this.isWidCollapsed);
    console.log("regions", this.regions, this.isRegCollapsed); 

  }

  ngOnInit(): void {
  }

  getWidgets(){
    this.widgets = this.wpcore.getWidgets();
    for(let _w in this.widgets) {
      this.isWidCollapsed[this.widgets[_w].machine_name] = true;
      this.widRegSelected[this.widgets[_w].machine_name] = '';
    }
  }

  getRegions() {
    this.regions = this.wpcore.getRegions();
    for(let _w in this.regions) {
      this.isRegCollapsed[this.regions[_w].machine_name] = false;
    }    
  }

  saveWidgets() {

  }

  getPositions(){

  }
  widgetToggle(widget) {
    if(this.curWidget == widget) {
      this.curWidget = '';
    }
    else {
      this.curWidget = widget; 
    }
    console.log(widget);
  }


  getWidget(machine_name){
    for(let w in this.widgets) {
      if(machine_name == this.widgets[w].machine_name) {
        return cloneDeep(this.widgets[w]);
      }
    }
    return false;
  }
  

  addWidget(widget_mn, region_mn) {

    var _widget = this.getWidget(widget_mn);
    var form = new FormGroup({});
    var fields: FormlyFieldConfig[] = [];
    fields = cloneDeep(_widget.inputs);
    console.log("form fields", fields, _widget); 
    _widget.fields = fields;
    _widget.form = form; 
    _widget.model = {};


    if(!_.has(this.regwids, region_mn)) {
      this.regwids[region_mn] = []; 
    }
    if(_widget) {
      this.regwids[region_mn].push(_widget);  
    }
    

    console.log(widget_mn, region_mn, this.regwids, _widget );
  }

  removeWidget(widget_delta) {

  }

  regionToggle(asdasd) {

  }

  onSubmit() {

  }

}
