import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
 
@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent implements OnInit {
  checkTabView: boolean = false;

  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search',
      isDisable: false
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh',
      isDisable: false
    },
    {
      iconcode: 'mdi-download',
      title: 'Download',
      isDisable: true
    },
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
  fileDataObj: any;
  showDownload: boolean = false;
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';

  showLoader = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService:HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.setDefaultDate();
    this.getAccountingReport();
    this.checkTabView = this.helperService.isTab();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 7);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getAccountingReport() {

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
   this.showLoader =  true;
    this.commonService.getAccountingReport(param)
      .subscribe(data => {
        console.log('getAccountingReport :: ');
        console.log(data);
        this.reportData = data.body.data;
      },
        (err: any) => {
          this.showLoader =  false;

          // this.errorMsg = 'Error occured';
        },
        () => {
          this.showLoader =  false;
        }
      );
  }

  generateSingleTicketReport() {

    const param = {
      LocationId: this.locId,
      SellerId: 7,
      FromDate: "2021-11-22",
      Todate: "2023-11-22"
    }

    this.showLoader = true;

    this.commonService.generateCustomerReport(param)
      .subscribe(data => {
        console.log('generateCustomerReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        // console.log(this.fileDataObj);
        this.showDownload = true;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Customer Report")
        }
      },
        (err: any) => {
          this.showLoader = false;

          // this.errorMsg = 'Error occured';
        },
        () =>{
          this.showLoader = false;
        }
      
      );
  }


  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.showDownload = false;
        this.getAccountingReport();
        break; 
      case 'mdi-refresh':
        this.showDownload = false;
        this.setDefaultDate();
        this.getAccountingReport();
        break;
        case 'mdi-download':
          this.generateSingleTicketReport();
         break;
      default:
        break;
    }
  }

}
