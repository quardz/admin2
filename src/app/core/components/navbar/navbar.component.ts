import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { WpcoreService } from '../../wpcore.service';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]  
})
export class NavbarComponent implements OnInit {
  public sidebarOpened = false;
  sites: any;
  currentsite: any;
  
  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    }
    else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  
  constructor(config: NgbDropdownConfig, public wpcore: WpcoreService, public toastr: ToastrService) {
    config.placement = 'bottom-right';
    this.sites = wpcore.sites;

  }

  sitesOnChange(siteid: any) {
    console.log("selected site", siteid); 
    this.toastr.success('Success!', 'Changed the site');
  }

  host() {
     this.toastr.success('Success!', 'Site is being published...you will be notified'); 
  }

  getSites(){
 
  }

  setSites() {

  }
  
  ngOnInit() {
  }
}
