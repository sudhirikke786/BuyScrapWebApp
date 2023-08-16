import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-location-management',
  templateUrl: './admin-location-management.component.html',
  styleUrls: ['./admin-location-management.component.scss']
})
export class AdminLocationManagementComponent implements OnInit {


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

  orgName: any;
  locId: any;
  locationObj: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.getLocations();

    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

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

  getLocations(){
    this.commonService.GetLocations({RowId:1}).subscribe((res) =>{
      this.locationObj =  res?.body?.data;
    })
  }
  

}
