import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sellers-buyers-dashboard',
  templateUrl: './sellers-buyers-dashboard.component.html',
  styleUrls: ['./sellers-buyers-dashboard.component.scss']
})
export class SellersBuyersDashboardComponent implements OnInit {
  
  orgName: any;
  locId: any;

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    },{
      iconcode:'mdi-plus',
      title:'Add Seller',
      label:'Add Seller'

    }
  ];

  sellers: any;
  searchSellerInput: any = '';
  sellerLoader:boolean = false;
  currentPage = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  pageTotal = 0;

  
  constructor(private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 10,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  
  getAllsellersDetails(paramObject: any) {
    this.sellerLoader =  true;
    this.commonService.getAllsellersDetails(paramObject)
      .subscribe(data => {
          console.log('getAllsellersDetails :: ');
          console.log(data);
          this.sellers = data.body.data;
          this.pageTotal =  data?.body?.totalRecord
          this.last = data?.body?.totalIndex;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
          this.sellerLoader =  false;
        },
        () =>{
          this.sellerLoader =  false;
        }
      );
  }


  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1;
    this.first = event.first ;
    let pagObj = {
      PageNumber: this.currentPage,
      RowOfPage: event.rows,
      LocationId: this.locId
    }
    this.pageSize = event.rows;
   // this.pagination = {...this.pagination,...pagObj};
    this.getAllsellersDetails(pagObj);
  }
  

  /** Seller pop up actions start */

  searchSeller() {
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId,
      SerachText: this.searchSellerInput.replace(/ /g, "%")
    };
    this.getAllsellersDetails(paramObject);

  }

  refreshSellerData() {
    this.searchSellerInput = '';
    const paramObject = {
      PageNumber: 1,
      RowOfPage: 1000,
      LocationId: this.locId
    };
    this.getAllsellersDetails(paramObject);
  }

  addNewSeller() {    
    this.router.navigateByUrl(`${this.orgName}/sellers-buyers/add-seller`)
  }  
  /** Seller pop up actions end */


  getAction(actionCode:any){
    
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.searchSeller();
        break;
      case 'mdi-refresh':
        this.refreshSellerData();
        break;
      case 'mdi-plus':
        this.addNewSeller();
        break;
      default:
        break;
    }
  
  }
  
}
