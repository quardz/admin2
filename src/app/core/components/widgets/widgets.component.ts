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

  regions: any; //list of regions 
  theme: ITheme[]; //current theme
  widgets: any; //List of saveWidgets
  widreg_map: any = {}; //Map of reg wids, this is to be saved in DB
  regwids: any = {}; // SAme as widreg_map but this is for admin purpose. 
  isWidCollapsed:any = {};
  isRegCollapsed:any = {};
  
  curWidget: string = ''; 
  

  widRegSelected: any = {};

  regWidsDelta: number = 1; //Holds the next delta id for each reagi


  sortable_options: SortablejsOptions = {
      group: 'test',
      onUpdate: () => {
        console.log('updated', this.regwids);
      },
      onAdd: () => {
        console.log('added', this.regwids);
      },
      onRemove: () => {
        console.log('removed', this.regwids);
      },
  };
    

  constructor(private wpcore: WpcoreService) { 
    this.getWidgets();
    this.getRegions();
    this.getPositions();
    console.log("widgets", this.widgets, this.isWidCollapsed);
    console.log("regions", this.regions, this.isRegCollapsed); 

  }

  ngOnInit(): void {
  }

  getRegWidsDelta(){
    return this.regWidsDelta;
  }

  getWidgets(){
    this.widgets = this.wpcore.getWidgets();
    for(let _w in this.widgets) {
      this.isWidCollapsed[_w] = true;
      this.widRegSelected[_w] = '';
    }
  }

  getRegions() {
    this.regions = this.wpcore.getRegions();
    for(let _w in this.regions) {
      this.isRegCollapsed[this.regions[_w].machine_name] = false;
      this.regWidsDelta
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
      if(machine_name == w) {
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

    this.regWidsDelta++;

    _widget.fields = fields;
    _widget.form = form; 
    _widget.model = {};
    _widget.delta = this.getRegWidsDelta();
    _widget.isWidCollapsed = true;

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

  deleteRegWid(region, delta) {
    console.log("delete styff", region, delta);
    /*
    if(_.has(this.regwids, region)) {
      for(let _i in this.regwids[region]) {
        if(this.regwids[region][_i].delta == delta) {
          delete this.regwids[region][_i];
        }
      }
    }
    */
  }

  onSubmit(region, widget, data = null, delta = 0,weight = 0) {



    if(region && widget) {
      if(!_.has(this.widreg_map, region)) {
        this.widreg_map[region] = {};
      }
      this.widreg_map[region][delta] = {
        data: data,
        weight: weight,
      };
    }
    //create gaint array,
    //keep it sync with regwids
    console.log("submit regwid",region, widget, data, this.widreg_map);
  }

}
