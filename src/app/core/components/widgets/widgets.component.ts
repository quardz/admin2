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
        this.saveData();
      },
      onAdd: () => {
        this.saveData();
      },
      onRemove: () => {
        this.saveData();
      },
  };
    

  constructor(private wpcore: WpcoreService,
    ) { 
    this.getWidgets();
    this.getRegions();
    this.getPositions();
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

  //Loads default position from database
  getPositions(){
    var _positions = this.wpcore.getThemeSettings('regwids');
    if(_positions) {
      var deltaCollections = [];
      for(let region_mn in _positions) {
        this.regwids[region_mn] = []; 
        if(_positions[region_mn]) {
          for(let _index in _positions[region_mn]) {
            var _regwid = _positions[region_mn][_index];
            var _widget = this.getWidget(_regwid._w);
            var form = new FormGroup({});
            var fields: FormlyFieldConfig[] = [];
            fields = cloneDeep(_widget.inputs); 
            deltaCollections.push(_regwid._d);    


            _widget.fields = fields;     
            _widget.form = form; 
            _widget.model = _regwid._m;
            _widget.delta = _regwid._d;
            _widget.isWidCollapsed = true;
            this.regwids[region_mn].push(_widget);  
          }
        }
      }
    }
    console.log("cuurrent positions", _positions, this.regwids);

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
    

    this.saveData();
  }

  removeWidget(widget_delta) {

  }

  regionToggle(asdasd) {

  }


  saveData() {
    var dataSave:any = {};
    if(this.regwids) {
      for(let _region in this.regwids) {  
        dataSave[_region] = [];
        if(this.regwids[_region]) {
          for(let _index in this.regwids[_region]) {
            var item = {
              _w: this.regwids[_region][_index].machine_name,
              _d: this.regwids[_region][_index].delta,
              _m: this.regwids[_region][_index].model,
            };
            dataSave[_region].push(item);
          }
        }
      }
    }
    this.wpcore.setThemeSettings('regwids', dataSave);
  }

  deleteRegWid(region, delta) {
    if(_.has(this.regwids, region)) {
      for(let _i in this.regwids[region]) {
        if(this.regwids[region][_i].delta == delta) {
          this.regwids[region].splice(_i, 1);
        }
      }
    }
    this.saveData();
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
    this.saveData();
  }

}
