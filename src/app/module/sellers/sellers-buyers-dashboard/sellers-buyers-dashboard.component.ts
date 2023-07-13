import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sellers-buyers-dashboard',
  templateUrl: './sellers-buyers-dashboard.component.html',
  styleUrls: ['./sellers-buyers-dashboard.component.scss']
})
export class SellersBuyersDashboardComponent implements OnInit {
  
  organizationName: any;
  locId: any;

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
      title:'Add Seller'
    }
  ];

  sellers: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.organizationName = localStorage.getItem('orgName');
    this.locId = 1;
    this.getAllsellersDetails();
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
          this.sellers = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.router.navigateByUrl(`ProdTest/sellers-buyers/add-sellers`)
        break;
      case 'mdi-merge':
     
        break;
      default:
        break;
    }

  
  }
  
}
