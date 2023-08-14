import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sellers-buyers-details',
  templateUrl: './sellers-buyers-details.component.html',
  styleUrls: ['./sellers-buyers-details.component.scss']
})
export class SellersBuyersDetailsComponent implements OnInit {

  orgName: any;
  locId: any;
  sellerId: any;
  seller: any;
  tickets: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.route.params.subscribe((param)=>{
      this.sellerId = param["sellerId"];
      this.getSellerById();      
      this.getAllTicketsBySellerId();
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

  getAllTicketsBySellerId() {    
    const paramObj: any = {
      SellerId: this.sellerId,
      LocationId: this.locId
    }
    this.commonService.getAllTicketsBySellerId(paramObj)
      .subscribe(data => {
          console.log('getAllTicketsBySellerId :: ');
          console.log(data);
          this.tickets = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

}
