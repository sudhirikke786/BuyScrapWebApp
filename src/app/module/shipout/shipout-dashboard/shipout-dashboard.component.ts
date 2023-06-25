import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-shipout-dashboard',
  templateUrl: './shipout-dashboard.component.html',
  styleUrls: ['./shipout-dashboard.component.scss']
})
export class ShipoutDashboardComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-plus',
      title:'New Ship Out'
    }
  ];

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },
    {
      iconcode:'mdi-account',
      title:'New Customer'
    }
  ];


  

  shipouts: any;
  sellers: any;

  visible = false;
  custVisible=  false;
  orgName: any;
  locId: any;  
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.getAllShipOutDetails();
  }

  getAllShipOutDetails() {   

    const pagination = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    }

    this.commonService.getAllShipOutDetails(pagination)
      .subscribe(data => {
          console.log('getAllShipOutDetails :: ');
          console.log(data);
          this.shipouts = data.body;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  getAllsellersDetails() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
          console.log('getAllsellersDetails :: ');
          console.log(data);
          this.sellers = data.body;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  showDialog() {    
    this.visible =  true;
    this.getAllsellersDetails();
  }

  showCustomerModel(sellerId: any){
    alert(sellerId);
    this.custVisible = true;
  }
  closeDriver(){
    this.custVisible = false;
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showDialog();
        break;
      case 'mdi-merge':
      
        break;
      default:
        break;
    }

  
  }

}
