import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-daily-tickets-report',
  templateUrl: './daily-tickets-report.component.html',
  styleUrls: ['./daily-tickets-report.component.scss']
})
export class DailyTicketsReportComponent implements OnInit {

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
      iconcode: 'mdi-download',
      title: 'Download'
    }	  
		

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
  fileDataObj:any;	
  showDownload:boolean=false;
  showLoaderReport = false;
  isReportShow = false;
  showLoader = false;
  checkTabView: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getDailyTicketsReport();
    this.checkTabView = this.helperService.isTab();
  }

  setDefaultDate() {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getDailyTicketsReport() {   

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }
    this.showLoader =  true;

    this.commonService.getDailyTicketsReport(param)
      .subscribe(data => {
          console.log('getDailyTicketsReport :: ');
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

  generateDailyTicketReport() {

    this.isReportShow = true;
    this.showLoaderReport = true;

    const param = {
      LocationId: this.locId,
      FromDate: this.fromDate,
      Todate: this.toDate
    }

    this.commonService.generateDailyTicketsReport(param)
      .subscribe(data => {
        console.log('generateDailyTicketsReport :: ');
        console.log(data);
        this.fileDataObj = data.body.data;
        this.showLoaderReport = false;
        if(this.checkTabView) {
          this.helperService.downloadBase64Pdf(this.fileDataObj,"Daily_Tickets")
        }

      },
        (err: any) => {
          this.showLoaderReport = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }


  getAction(actionCode:any){

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        this.getDailyTicketsReport();
        break;
      case 'mdi-refresh':
        this.setDefaultDate();
        this.getDailyTicketsReport();
        break;
        case 'mdi-download':
          this.generateDailyTicketReport();
         break;
      default:
        break;
    }  
  }

}

