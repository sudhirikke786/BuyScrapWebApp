import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-change-location',
  templateUrl: './change-location.component.html',
  styleUrls: ['./change-location.component.css']
})
export class ChangeLocationComponent implements OnInit {


  locations :any =  [];  
  selectedLocation: any;
  orgName :any;
  locationId:any;
  constructor(private router:Router,private commonService:CommonService){

  }

  ngOnInit() {
    this.getOrgLocation();
    this.orgName = localStorage.getItem('orgName');
    this.locationId = Number(localStorage.getItem("locId"));
  
  }


  changeLocation(){
    localStorage.setItem("locId",this.locationId);
    this.selectedLocation = this.locations.filter((item:any) => item.rowId == this.locationId)[0];
    localStorage.setItem('currencyCode',this.selectedLocation?.currencyCode); 
      
    const URl  = window.location.href;
    console.log(URl);
    this.router.navigateByUrl(`${this.orgName}/home`);
   
  }

  getOrgLocation() {
     
    this.commonService.getOrgLocation()
      .subscribe(data => {
  
          console.log('getOrgLocation :: ');
          console.log(data);
          this.locations = data.body.data;
          this.selectedLocation = this.locations[0];
 
        },
        (err: any) => {
       
          // this.errorMsg = 'Error occured';
        }
      );
  }





}
