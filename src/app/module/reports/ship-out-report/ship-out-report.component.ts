import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';
@Component({
  selector: 'app-ship-out-report',
  templateUrl: './ship-out-report.component.html',
  styleUrls: ['./ship-out-report.component.css']
})
export class ShipOutReportComponent implements OnInit {

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
  ticketNumber: any = '';
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
    this.getAllShipOutDetails();
  }

  setDefaultDate() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 3);
    console.log(defaultDate);
    this.fromDate = this.datePipe.transform(defaultDate, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.fromDate);
  }

  getAllShipOutDetails() {

    const param = {
      //TicketId: this.ticketNumber || 0,
      // LocationId: this.locId,
      // TicketSettingsId: 0,
      // FromDate: this.fromDate,
      // Todate: this.toDate,
      // SellerName: this.sellerName
      SerachText: this.ticketNumber,
      PageNumber: 1,
      RowOfPage: 100,
      LocationId: this.locId,
      first: 0,
    }
    this.showLoader = true;
    this.commonService.getAllShipOutDetails(param)
      .subscribe(data => {
        console.log('getAllShipOutDetails :: ');
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

  generateSingleTicketReport() {

    this.isReportShow = true;
    this.showLoaderReport = true;

    const param = {
      TicketId:this.customerObj.ticketId,
      LocationId: this.locId,
      Type: 'A4Size'
    }

    this.commonService.generateSingleTicketReport(param)
      .subscribe(data => {
        console.log('generateSingleTicketReport :: ');
        console.log(data);
        this.showLoaderReport = false;
        this.fileDataObj = data.body.data;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,this.customerObj.ticketId)
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
        this.getAllShipOutDetails();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getAllShipOutDetails();
        break;
      case 'mdi-download':
        this.generateSingleTicketReport();
        break;
      default:
        break;
    }
  }

}
