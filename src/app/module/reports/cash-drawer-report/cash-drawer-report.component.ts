import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-cash-drawer-report',
  templateUrl: './cash-drawer-report.component.html',
  styleUrls: ['./cash-drawer-report.component.scss']
})
export class CashDrawerReportComponent implements OnInit {
  checkTabView: boolean = false;
  actionList = [
    {
      iconcode: 'mdi-magnify',
      title: 'Search'
    },
    {
      iconcode: 'mdi-refresh',
      title: 'Refresh'
    },
    {
      iconcode: 'mdi-download',
      title: 'Download'
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
  showDownload = false;
  showLoader = false;
  isReportShow = false;
  
  numberFormat: string = '1.3-3';
  currencySymbol: string = 'USD';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.currencySymbol = localStorage.getItem('currencyCode') || 'USD';
    this.setDefaultDate();
    this.getCashDrawerReport();
    this.checkTabView = this.helperService.isTab();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getCashDrawerReport() {

    const param = {
      LocId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showLoader = true;
    this.commonService.getCashDrawerReport(param)
      .subscribe(data => {
       
        console.log('getCashDrawerReport :: ');
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

  generateCashDrawerReport() {

    this.isReportShow = true;
    const param = {
      LocId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showDownload = true;
    this.commonService.generateCashDrawerReport(param)
      .subscribe(data => {
        console.log('generateCashDrawerReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showDownload = false;

        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Cash Drawer Report"+this.toDate)
        }

      },
        (err: any) => {
          this.showDownload = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }


  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getCashDrawerReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getCashDrawerReport();
        break;
      case 'mdi-download':
        this.generateCashDrawerReport();
        break;
      default:
        break;
    }
  }

}
