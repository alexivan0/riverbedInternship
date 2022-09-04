import { Component } from '@angular/core';
import { AppDataService } from '../services/app-data.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  isUserAuthenticated!: boolean;

  constructor(private service: AppDataService) {
    this.isUserAuthenticated = service.isUserAuthenticated();
    console.log(this.isUserAuthenticated)
  }

  logOut(){
    this.service.logOut();
    this.service.reloadCurrentPage();
  }


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


}
