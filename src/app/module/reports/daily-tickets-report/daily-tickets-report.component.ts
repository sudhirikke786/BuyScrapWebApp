import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from 'src/app/core/services/common.service';

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
  showLoader = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
    this.setDefaultDate();
    this.getDailyTicketsReport();
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
          console.log(this.fileDataObj);
          this.showDownload = true;
         break;
      default:
        break;
    }  
  }

}

