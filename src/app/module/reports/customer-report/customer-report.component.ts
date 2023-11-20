import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent implements OnInit {

  actionList = [
    {
      iconcode:'mdi-magnify',
      title:'Search',
      isDisable:false,
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh',
      isDisable:false,
    },
    {
      iconcode: 'mdi-download',
      title: 'Download',
      isDisable:true,
    },
  ];

   newButtonList = [
    {
      iconcode:'mdi-magnify',
      title:'Search'
    },
    {
      iconcode:'mdi-refresh',
      title:'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;  
  fromDate: any;
  toDate: any;
  sellerName: string = '';
  fileDataObj:any;
  showDownload=false;
  customerObj: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getCustomerReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() - 1);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getCustomerReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate,
      SearchText: this.sellerName
    }

    this.commonService.getCustomerReport(param)
      .subscribe(data => {
          console.log('getCustomerReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }

  // (onRowSelect)="onRowSelect($event)" (onRowClick)="onRowClick($event)"

  onRowSelect(event: any) {
    // Handle row selection
    //this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download'){
        item.isDisable = false;
      }
      return item
    })
  }
  onRowUnselect(event: any) {
    // Handle row selection
    //this.customerObj = event?.data;
    console.log('Selected Row:', event?.data);
    this.actionList =  this.actionList.map((item) => {
      if(item.iconcode=='mdi-download'){
        item.isDisable = true;
      }
      return item
    })
  }

 


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getCustomerReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getCustomerReport();
        break;
      case 'mdi-download':
        this.showDownload = true;
        break;
      default:
        break;
    }  
  }

}

