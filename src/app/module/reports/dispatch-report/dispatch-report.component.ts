import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
@Component({
  selector: 'app-dispatch-report',
  templateUrl: './dispatch-report.component.html',
  styleUrls: ['./dispatch-report.component.css']
})
export class DispatchReportComponent implements OnInit {

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
      isDisable:false,
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
      isDisable:false,
    },
    {
      iconcode: 'mdi-download',
      title: 'Download',
      isDisable:true,
    }
  ];

  newButtonList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    }
  ];

  reportData: any;
  orgName: any;
  locId: any;
  fromDate: any;
  toDate: any;
  ticketNumber: any;
  dispatchID: any;
  sellerName: string = '';
  fileDataObj: any;
  showDownload = false;

  showLoader = false;
  showLoaderReport = false;
  isReportShow = false;
  customerObj:any;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';
  checkTabView: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService:HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.checkTabView = this.helperService.isTab();
    this.setDefaultDate();
    this.getDispatchReport();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getDispatchReport() {

    const param = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
      DispatchID: this.dispatchID || 0,
      SellerName:this.sellerName,
      LocationId: this.locId,
    }
    this.showLoader = true;
    this.commonService.getDispatchReport(param)
      .subscribe(data => {
        console.log('getSingleTicketReport :: ');
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

  getDispatchReportData() {
    this.isReportShow = true;
    this.showLoaderReport = true;
    
    const param = {
      PickUpID: this.customerObj.rowID,
      LocationId: this.locId
    }

    this.commonService.getDispatchReportData(param)
      .subscribe(data => {
        console.log('getDispatchReportData :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj, "Dispatch Report " + this.customerObj.rowID)
        }

       
      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }




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


  


  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getDispatchReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getDispatchReport();
        break;
      case 'mdi-download':
        this.getDispatchReportData();
        break;
      default:
        break;
    }
  }

}
