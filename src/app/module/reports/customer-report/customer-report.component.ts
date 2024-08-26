import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

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
  showLoader = false;
  customerObj: any;
  checkTabView: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getCustomerReport();
    this.checkTabView = this.helperService.isTab();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 10);
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
    this.showLoader = true;

    this.commonService.getCustomerReport(param)
      .subscribe(data => {
          console.log('getCustomerReport :: ');
          console.log(data);
          this.reportData = data.body.data;
        },
        (err: any) => {
          this.showLoader = false;
          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  // (onRowSelect)="onRowSelect($event)" (onRowClick)="onRowClick($event)"

  onRowSelect(event: any) {
    // Handle row selection
    this.customerObj = event?.data;
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

  generateCustomerReport() {

    const param = {
      LocationId: this.locId,
      SellerId: this.customerObj.rowId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    

    this.commonService.generateCustomerReport(param)
      .subscribe(data => {
        console.log('generateCustomerReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Daily_Tickets")
        }

        // console.log(this.fileDataObj);
        this.showDownload = true;
      },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
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
        this.generateCustomerReport();
        break;
      default:
        break;
    }  
  }

}

