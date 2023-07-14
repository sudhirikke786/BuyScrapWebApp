import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/core/interfaces/common-interfaces';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sellers-buyers-details',
  templateUrl: './sellers-buyers-details.component.html',
  styleUrls: ['./sellers-buyers-details.component.scss']
})
export class SellersBuyersDetailsComponent implements OnInit {


  
  orgName: any;
  locId = 1;
  sellerId: any;
  seller: any;
  tickets: any;

  
  pagination: Pagination = {
    Status: 'ALL',
    PageNumber: 1,
    RowOfPage: 5,
    LocationId: this.locId
  }
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = 1;
    this.route.params.subscribe((param)=>{
      this.sellerId = param["sellerId"];
      this.getSellerById();
      this.getAllTicketsDetails(this.pagination);
    });
  }
  
  getSellerById() {
    const paramObject = {
      ID: this.sellerId,
      LocationId: this.locId
    };
    this.commonService.getSellerById(paramObject)
      .subscribe(data => {
          console.log('getSellerById :: ');
          console.log(data);
          this.seller = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  getAllTicketsDetails(pagination: Pagination) {
    this.commonService.getAllTicketsDetails(pagination)
      .subscribe(data => {
          console.log('getAllTicketsDetails :: ');
          console.log(data);
          this.tickets = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

}
