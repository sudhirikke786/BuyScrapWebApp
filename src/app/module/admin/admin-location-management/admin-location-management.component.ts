import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-location-management',
  templateUrl: './admin-location-management.component.html',
  styleUrls: ['./admin-location-management.component.scss']
})
export class AdminLocationManagementComponent {


  visible =  false;

  location  = [{
    locationName:'California',
    userCount:'1000',
    totalTickets:'90',
    avlTickets:'888',

  },
  {
    locationName:'Mumbai',
    userCount:'1000',
    totalTickets:'90',
    avlTickets:'888',

  },
  {
    locationName:'Pune',
    userCount:'1000',
    totalTickets:'90',
    avlTickets:'888',

  }]
  locationVisble: boolean = false;
  addlocationVisble: boolean = false;


  hideModel(){
    this.visible = false;
  }

  showLocationModel(){
    this.locationVisble =  true;
  }

  hideLocationModel(){
    this.locationVisble =  false;
  }

  showModel() {
    this.visible = true;
  }

  showLocation() {
    this.addlocationVisble =  true;
  }

  hideLocation() {
    this.addlocationVisble =  true;
  }

  

}
